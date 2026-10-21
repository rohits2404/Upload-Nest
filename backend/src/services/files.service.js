import path from "path";
import { PassThrough } from "stream";
import { v4 as uuidv4 } from "uuid";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
    createFile,
    findFileByIdPublic,
    findFilesByUserId,
    findFilesByIds,
    deleteFilesByIds,
} from "../models/file.model.js";
import { findUserById } from "../models/user.model.js";
import {
    BadRequestException,
    InternalServerException,
    NotFoundException,
    UnauthorizedException,
} from "../utils/app-error.js";
import { sanitizeFilename } from "../utils/helper.js";
import { logger } from "../utils/logger.js";
import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import { s3 } from "../config/aws-s3.config.js";

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const archiver = require("archiver");

export const uploadFilesService = async (userId, files, uploadedVia) => {
    const user = await findUserById(userId);
    if (!user) throw new UnauthorizedException("Unauthorized Access");
    if (!files?.length) throw new BadRequestException("No Files Provided");

    const results = await Promise.allSettled(
        files.map(async (file) => {
            let _storageKey = null;
            try {
                const { storageKey } = await uploadToS3(file, userId);
                _storageKey = storageKey;

                const createdFile = await createFile({
                    userId,
                    storageKey,
                    originalName: file.originalname,
                    uploadVia: uploadedVia,
                    size: file.size,
                    ext: path
                        .extname(file.originalname)
                        ?.slice(1)
                        ?.toLowerCase(),
                    url: null,
                    mimeType: file.mimetype,
                });

                return {
                    fileId: createdFile.id,
                    originalName: createdFile.originalName,
                    size: createdFile.size,
                    formattedSize: createdFile.formattedSize,
                    ext: createdFile.ext,
                    mimeType: createdFile.mimeType,
                };
            } catch (error) {
                logger.error("Error Uploading File", {
                    filename: file.originalname,
                    errorName: error?.name,
                    errorMessage: error?.message,
                    errorCode: error?.code || error?.Code,
                    httpStatusCode: error?.$metadata?.httpStatusCode,
                });

                if (_storageKey) {
                    await deleteFromS3(_storageKey).catch(() => {});
                }

                throw error;
            }
        }),
    );

    const successfulRes = results
        .filter((r) => r.status === "fulfilled")
        .map((r) => r.value);

    const failedRes = results
        .filter((r) => r.status === "rejected")
        .map((r) => r.reason.message);

    if (failedRes.length > 0) {
        logger.warn("Failed To Upload Files", failedRes);
    }

    return {
        message: `Uploaded Successfully ${successfulRes.length} Out Of ${files.length} Files`,
        data: successfulRes,
        failedCount: failedRes.length,
    };
};

export const getAllFilesService = async (userId, filter, pagination) => {
    const { keyword } = filter;
    const { pageSize, pageNumber } = pagination;
    const skip = (pageNumber - 1) * pageSize;

    const { files, totalCount } = await findFilesByUserId({
        userId,
        keyword,
        limit: pageSize,
        offset: skip,
    });

    const filesWithUrls = await Promise.all(
        files.map(async (file) => {
            const url = await getFileFromS3({
                storageKey: file.storageKey,
                mimeType: file.mimeType,
                expiresIn: 3600,
            });

            return {
                ...file,
                url,
                storageKey: undefined,
            };
        }),
    );

    const totalPages = Math.ceil(totalCount / pageSize);

    return {
        files: filesWithUrls,
        pagination: {
            pageSize,
            pageNumber,
            totalCount,
            totalPages,
            skip,
        },
    };
};

export const getFileUrlService = async (fileId) => {
    const file = await findFileByIdPublic(fileId);
    if (!file) throw new NotFoundException("File Not Found");

    const stream = await getS3ReadStream(file.storageKey);

    return {
        url: "",
        stream,
        contentType: file.mimeType,
        fileSize: file.size,
    };
};

export const deleteFilesService = async (userId, fileIds) => {
    const files = await findFilesByIds(fileIds, userId);
    if (!files.length) throw new NotFoundException("No Files Found");

    const s3Errors = [];

    await Promise.all(
        files.map(async (file) => {
            try {
                await deleteFromS3(file.storageKey);
            } catch (error) {
                logger.error(
                    `Failed To Delete ${file.storageKey} From S3`,
                    error,
                );
                s3Errors.push(file.storageKey);
            }
        }),
    );

    const successfulFileIds = files
        .filter((file) => !s3Errors.includes(file.storageKey))
        .map((file) => file.id);

    const deletedCount = await deleteFilesByIds(successfulFileIds, userId);

    if (s3Errors.length > 0) {
        logger.warn(`Failed To Delete ${s3Errors.length} Files From S3`);
    }

    return {
        deletedCount,
        failedCount: s3Errors.length,
    };
};

export const downloadFilesService = async (userId, fileIds) => {
    const files = await findFilesByIds(fileIds, userId);
    if (!files.length) throw new NotFoundException("No Files Found");

    if (files.length === 1) {
        const signedUrl = await getFileFromS3({
            storageKey: files[0].storageKey,
            filename: files[0].originalName,
        });

        return {
            url: signedUrl,
            isZip: false,
        };
    }

    const url = await handleMultipleFilesDownload(files, userId);

    return {
        url,
        isZip: true,
    };
};

async function handleMultipleFilesDownload(files, userId) {
    const timestamp = Date.now();
    const zipKey = `temp-zips/${userId}/${timestamp}.zip`;
    const zipFilename = `uploadnest-${timestamp}.zip`;

    const zip = archiver("zip", { zlib: { level: 6 } });
    const passThrough = new PassThrough();

    zip.on("error", (err) => {
        passThrough.destroy(err);
    });

    const upload = new Upload({
        client: s3,
        params: {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: zipKey,
            Body: passThrough,
            ContentType: "application/zip",
        },
    });

    zip.pipe(passThrough);

    const uploadPromise = upload.done();

    for (const file of files) {
        try {
            const stream = await getS3ReadStream(file.storageKey);
            zip.append(stream, { name: sanitizeFilename(file.originalName) });
        } catch (error) {
            zip.destroy(error);
            throw error;
        }
    }

    await zip.finalize();
    await uploadPromise;

    return getFileFromS3({
        storageKey: zipKey,
        filename: zipFilename,
        expiresIn: 3600,
    });
}

async function uploadToS3(file, userId, meta) {
    try {
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        const cleanName = sanitizeFilename(basename).substring(0, 64);

        const storageKey = `users/${userId}/${uuidv4()}-${cleanName}${ext}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: storageKey,
            Body: file.buffer,
            ...(meta && { Metadata: meta }),
        });

        await s3.send(command);

        return { storageKey };
    } catch (error) {
        logger.error("AWS Error Failed Upload", {
            errorName: error?.name,
            errorMessage: error?.message,
            errorCode: error?.code || error?.Code,
            httpStatusCode: error?.$metadata?.httpStatusCode,
            requestId: error?.$metadata?.requestId,
            stack: error?.stack,
        });

        throw error;
    }
}

async function getFileFromS3({
    storageKey,
    filename,
    mimeType,
    expiresIn = 60,
}) {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: storageKey,
            ...(!filename && {
                ResponseContentType: mimeType,
                ResponseContentDisposition: `inline`,
            }),
            ...(filename && {
                ResponseContentDisposition: `attachment;filename="${filename}"`,
            }),
        });

        return await getSignedUrl(s3, command, { expiresIn });
    } catch (error) {
        logger.error(`Failed To Get File From S3: ${storageKey}`);
        throw error;
    }
}

async function getS3ReadStream(storageKey) {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: storageKey,
        });
        const response = await s3.send(command);

        if (!response.Body) {
            logger.error(`No Body Returned For Key: ${storageKey}`);
            throw new InternalServerException(`No Body Returned For Key`);
        }
        return response.Body;
    } catch (error) {
        logger.error(`Error Getting S3 Stream For Key: ${storageKey}`);
        throw new InternalServerException(`Failed To Retrieve File`);
    }
}

async function deleteFromS3(storageKey) {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: storageKey,
        });
        await s3.send(command);
    } catch (error) {
        logger.error(`Failed To Delete File From S3`, storageKey);
        throw error;
    }
}
