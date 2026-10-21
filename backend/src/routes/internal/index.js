import { Router } from "express";
import authRoutes from "./auth.route.js";
import filesRoutes from "./files.route.js";
import { passportAuthenticateJwt } from "../../config/passport-config.js";
import analyticsRoutes from "./analytics.route.js";
import apikeyRoutes from "./apikey.route.js";
import { publicGetFileUrlController } from "../../controllers/files.controller.js";

const internalRoutes = Router();

internalRoutes.use("/auth", authRoutes);

// PUBLIC: must be registered BEFORE the JWT-protected /files router
internalRoutes.get("/files/:fileId/view", publicGetFileUrlController);

internalRoutes.use("/files", passportAuthenticateJwt, filesRoutes);
internalRoutes.use("/analytics", passportAuthenticateJwt, analyticsRoutes);
internalRoutes.use("/apikey", passportAuthenticateJwt, apikeyRoutes);

export default internalRoutes;
