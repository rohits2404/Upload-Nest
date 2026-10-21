import { asyncHandler } from "../middlewares/asyncHander.middleware.js";
import { UploadSourceEnum } from "../models/file.model.js";
import { HTTPSTATUS } from "../config/http.config.js";
import {
    deleteFilesService,
    downloadFilesService,
    getAllFilesService,
    getFileUrlService,
    uploadFilesService,
} from "../services/files.service.js";
import {
    deleteFilesSchema,
    downloadFilesSchema,
    fileIdSchema,
} from "../validators/files.validator.js";

export const uploadFilesViaWebController = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const files = req.files;
    const uploadedVia = UploadSourceEnum.WEB;

    const results = await uploadFilesService(userId, files, uploadedVia);

    return res.status(HTTPSTATUS.OK).json(results);
});

export const uploadFilesViaApiController = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const files = req.files;
    const uploadedVia = UploadSourceEnum.API;

    const results = await uploadFilesService(userId, files, uploadedVia);

    return res.status(HTTPSTATUS.OK).json(results);
});

export const getAllFilesController = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const filter = {
        keyword: req.query.keyword,
    };
    const pagination = {
        pageSize: parseInt(req.query.pageSize) || 20,
        pageNumber: parseInt(req.query.pageNumber) || 1,
    };

    const result = await getAllFilesService(userId, filter, pagination);

    return res.status(HTTPSTATUS.OK).json({
        message: "All Files Retrieved Successfully",
        ...result,
    });
});

export const deleteFilesController = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { fileIds } = deleteFilesSchema.parse(req.body);

    const result = await deleteFilesService(userId, fileIds);

    return res.status(HTTPSTATUS.OK).json({
        message: "Files Deleted Successfully",
        ...result,
    });
});

export const downloadFilesController = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { fileIds } = downloadFilesSchema.parse(req.body);

    const result = await downloadFilesService(userId, fileIds);

    return res.status(HTTPSTATUS.OK).json({
        message: "File Download URL Successfully",
        downloadUrl: result?.url,
        isZip: result?.isZip || false,
    });
});

export const publicGetFileUrlController = asyncHandler(async (req, res) => {
    const fileId = fileIdSchema.parse(req.params.fileId);
    const { stream, contentType, fileSize } = await getFileUrlService(fileId);

    res.set({
        "Content-Type": contentType,
        "Content-Length": fileSize,
        "Cache-Control": "public, max-age=3600",
        "Content-Disposition": "inline",
        "X-Content-Type-Options": "nosniff",
    });

    stream.pipe(res);
});
