export interface FilterParams {
    preset?: string;
    from?: string;
    to?: string;
}

export interface ChartDataType {
    date: string;
    usages: number;
    formatedUsages?: string;
    uploadedFiles?: number;
}

export interface UserAnalyticsAndChartResponse {
    message: string;
    chart: ChartDataType[];
    totaluploadFilesForPeriod: number;
    totalUsageForPeriod: string;
    storageUsageSummary: {
        totalUsage: number;
        quota: number;
        formattedTotalUsage: string;
        formattedQuota: string;
    };
}
