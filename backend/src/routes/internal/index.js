import { Router } from "express";
import authRoutes from "./auth.route.js";
import filesRoutes from "./files.route.js";
import { passportAuthenticateJwt } from "../../config/passport-config.js";
import analyticsRoutes from "./analytics.route.js";
import apikeyRoutes from "./apikey.route.js";

const internalRoutes = Router();

internalRoutes.use("/auth", authRoutes);
internalRoutes.use("/files", passportAuthenticateJwt, filesRoutes);
internalRoutes.use("/analytics", passportAuthenticateJwt, analyticsRoutes);

internalRoutes.use("/apikey", passportAuthenticateJwt, apikeyRoutes);

export default internalRoutes;
