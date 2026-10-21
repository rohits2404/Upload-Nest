import { asyncHandler } from "../middlewares/asyncHander.middleware.js";
import { HTTPSTATUS } from "../config/http.config.js";
import { getUserAnalyticsWithChartService } from "../services/analytics.service.js";

export const getUserAnalyticsWithChartController = asyncHandler(
    async (req, res) => {
        const userId = req.user?.id;

        const { from, to } = req.query;

        const filter = {
            dateFrom: from ? new Date(from) : undefined,
            dateTo: to ? new Date(to) : undefined,
        };

        const result = await getUserAnalyticsWithChartService(userId, filter);

        return res.status(HTTPSTATUS.OK).json({
            message: "User Analytics Retrieved Successfully",
            ...result,
        });
    },
);
