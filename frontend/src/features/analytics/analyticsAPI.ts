import { apiClient } from "@/app/api-client";
import type {
    UserAnalyticsAndChartResponse,
    FilterParams,
} from "./anayticsType";

export const analyticsApi = apiClient.injectEndpoints({
    endpoints: (builder) => ({
        getUserAnalyticsWithChart: builder.query<
            UserAnalyticsAndChartResponse,
            FilterParams
        >({
            query: ({ from, to }) => ({
                url: "/analytics/user",
                method: "GET",
                params: { from, to },
            }),
            providesTags: ["analytics"],
        }),
    }),
});

export const { useGetUserAnalyticsWithChartQuery } = analyticsApi;
