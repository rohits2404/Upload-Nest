import { Router } from "express";
import { publicGetFileUrlController } from "../../controllers/files.controller.js";
import v1Routes from "./v1/index.js";

const publicRoutes = Router();

publicRoutes.use(`${process.env.BASE_PATH}/v1`, v1Routes);

publicRoutes.use("/files/:fileId/view", publicGetFileUrlController);

export default publicRoutes;
