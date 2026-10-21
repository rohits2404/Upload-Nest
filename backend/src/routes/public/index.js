import { Router } from "express";
import v1Routes from "./v1/index.js";

const publicRoutes = Router();

const publicBasePath = process.env.PUBLIC_BASE_PATH || "/api/v1";

publicRoutes.use(publicBasePath, v1Routes);

export default publicRoutes;
