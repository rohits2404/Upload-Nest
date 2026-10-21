import { Router } from "express";
import { getUserAnalyticsWithChartController } from "../../controllers/analytics.controller.js";

const analyticsRoutes = Router();

analyticsRoutes.get("/user", getUserAnalyticsWithChartController);

export default analyticsRoutes;
