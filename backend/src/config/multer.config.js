import multer from "multer";
import {
    ALLOWED_MIME_TYPES,
    MAX_FILE_SIZE,
    MAX_FILES,
} from "../constant/multer.js";
import { BadRequestException } from "../utils/app-error.js";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        return cb(
            new BadRequestException(`File Type ${file.mimetype} Not Allowed`),
        );
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        files: MAX_FILES,
        fileSize: MAX_FILE_SIZE,
    },
});

export const multiUpload = upload.array("files", MAX_FILES);
