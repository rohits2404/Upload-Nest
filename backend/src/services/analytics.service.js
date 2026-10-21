import { getUploadStatsByDate } from "../models/file.model.js";
import { getStorageMetrics } from "../models/storage.model.js";
import { formatBytes } from "../utils/format-byte.js";

export const getUserAnalyticsWithChartService = async (userId, filter) => {
    const { dateFrom, dateTo } = filter;

    const [dailyStats, storageMetrics] = await Promise.all([
        getUploadStatsByDate({ userId, dateFrom, dateTo }),
        getStorageMetrics(userId),
    ]);

    const formattedChartData = dailyStats.map((item) => ({
        ...item,
        formattedUsages: formatBytes(item.usages),
    }));

    const totaluploadFilesForPeriod = dailyStats.reduce(
        (sum, item) => sum + item.uploadedFiles,
        0,
    );
    const totalUsageForPeriod = dailyStats.reduce(
        (sum, item) => sum + item.usages,
        0,
    );

    return {
        chart: formattedChartData,
        totaluploadFilesForPeriod,
        totalUsageForPeriod: formatBytes(totalUsageForPeriod),

        storageUsageSummary: {
            totalUsage: storageMetrics.usage,
            quota: storageMetrics.quota,
            formattedTotalUsage: storageMetrics.formattedUsage,
            formattedQuota: storageMetrics.formattedQuota,
        },
    };
};
