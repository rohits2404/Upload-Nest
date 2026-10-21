import {
    BadRequestException,
    UnauthorizedException,
} from "../utils/app-error.js";
import { validateUpload } from "../models/storage.model.js";
import { logger } from "../utils/logger.js";

export const CheckStorageAvailability = async (req, res, next) => {
    try {
        const files = req.files || (req.file ? [req.file] : []);

        if (!files || files.length === 0)
            throw new BadRequestException("No File Uploaded");

        const userId = req.user?.id;
        if (!userId) throw new UnauthorizedException("Unauthorized Access");

        const totalFileSize = files.reduce((sum, file) => sum + file.size, 0);

        const result = await validateUpload(userId, totalFileSize);

        logger.info(`Storage Result: ${JSON.stringify(result)}`);

        next();
    } catch (error) {
        next(error);
    }
};
