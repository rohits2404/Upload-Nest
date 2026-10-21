import { Router } from "express";
import { multiUpload } from "../../../config/multer.config.js";
import { CheckStorageAvailability } from "../../../middlewares/check-storage.middleware.js";
import { uploadFilesViaApiController } from "../../../controllers/files.controller.js";

const fileV1Routes = Router();

fileV1Routes.post(
    "/upload",
    multiUpload,
    CheckStorageAvailability,
    uploadFilesViaApiController,
);

export default fileV1Routes;
