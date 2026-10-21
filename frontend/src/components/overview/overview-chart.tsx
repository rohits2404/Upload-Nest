import { endOfDay, format, startOfDay, subDays } from "date-fns";
import type { ChartDataType } from "@/features/analytics/anayticsType";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "../ui/chart";
import { useState } from "react";
import { useGetUserAnalyticsWithChartQuery } from "@/features/analytics/analyticsAPI";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { formatBytes } from "@/lib/format-utils";
import { StorageUsage } from "./storage-usage";

const COLORS = ["var(--primary)", "var(--chart-1)"];

const CHART_TYPES = {
    uploads: {
        label: "Uploaded Files",
        color: COLORS[0],
    },
    usage: {
        label: "Usage",
        color: COLORS[1],
    },
} as const;

const chartConfig: ChartConfig = {
    uploads: {
        label: "Uploaded",
        color: COLORS[0],
    },
    usage: {
        label: "Usage",
        color: COLORS[1],
    },
} satisfies ChartConfig;

const generatePast30DaysData = (chartData: ChartDataType[] = []) => {
    const today = startOfDay(new Date());
    return Array.from({ length: 30 }, (_, i) => {
        const date = subDays(today, 29 - i);
        const dateString = format(date, "yyyy-MM-dd");

        const data = chartData.find((d) => d.date === dateString);

        return {
            date: dateString,
            uploads: data?.uploadedFiles ?? 0,
            usage: data?.usages ?? 0,
            formatedUsage: data?.formatedUsages ?? "0B",
        };
    });
};

export const OverviewChart = () => {
    const [activeChart, setActiveChart] =
        useState<keyof typeof CHART_TYPES>("uploads");

    const from = subDays(startOfDay(new Date()), 29);
    const to = endOfDay(new Date());
    console.log(from, to);

    const { data, isLoading } = useGetUserAnalyticsWithChartQuery({
        from: from.toISOString(),
        to: to.toISOString(),
    });

    const filledChartData = generatePast30DaysData(data?.chart || []);
    const totals = {
        uploads: data?.totaluploadFilesForPeriod ?? 0,
        usage: data?.totalUsageForPeriod ?? "0B",
    };

    const storageData = data?.storageUsageSummary;

    return (
        <Card className="pt-5 lg:pt-0">
            <CardHeader className="relative flex flex-col items-stretch space-y-0 border-b p-0! sm:flex-row sm:items-start">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 sm:py-6">
                    <CardTitle>Usage Overview</CardTitle>
                    <CardDescription className="text-xs lg:text-sm">
                        Showing Upload And Usage History For The Last 30 Days
                    </CardDescription>
                </div>

                <div className="flex">
                    {Object.entries(CHART_TYPES).map(([key, config]) => {
                        const chartKey = key as keyof typeof CHART_TYPES;
                        const isActive = activeChart === chartKey;
                        const value = totals[chartKey];
                        return (
                            <button
                                key={chartKey}
                                data-active={isActive}
                                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left transition-colors even:border-l data-[active=true]:bg-muted/50 sm:border-t-0 sm:border-l sm:px-8 sm:py-6 cursor-pointer! space-y-1"
                                onClick={() => {
                                    if (isLoading) return;
                                    setActiveChart(chartKey);
                                }}
                            >
                                {isLoading ? (
                                    <div className="space-y-1 min-w-48 min-h-28">
                                        <Skeleton className="h-6 w-48" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-xs text-muted-foreground">
                                            {config.label}
                                        </span>
                                        <span className="text-lg font-bold leading-none sm:text-3xl">
                                            {value}
                                        </span>
                                        <span className="flex min-w-[17ch] gap-x-1 text-xs text-muted-foreground">
                                            +{value} Past 30 Days
                                        </span>
                                    </>
                                )}
                            </button>
                        );
                    })}
                </div>
            </CardHeader>

            <CardContent className="px-2 sm:p-6 pb-px!">
                <div className="flex flex-col gap-y-4">
                    <div>
                        {isLoading ? (
                            <Skeleton className="h-57.5 w-full rounded-md" />
                        ) : (
                            <ChartContainer
                                config={chartConfig}
                                className="aspect-auto h-62.5 w-full"
                            >
                                <BarChart
                                    accessibilityLayer
                                    data={filledChartData}
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={32}
                                        tickFormatter={(value) => {
                                            const date = new Date(value);
                                            return date.toLocaleDateString(
                                                "en-US",
                                                {
                                                    month: "short",
                                                    day: "numeric",
                                                },
                                            );
                                        }}
                                    />
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                className="w-37.5"
                                                labelFormatter={(value) => {
                                                    const date = new Date(
                                                        value,
                                                    );
                                                    return date.toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            weekday: "short",
                                                            month: "long",
                                                            day: "numeric",
                                                            year: "numeric",
                                                        },
                                                    );
                                                }}
                                                formatter={(value, name) => {
                                                    const chartKey =
                                                        name as keyof typeof CHART_TYPES;

                                                    const color =
                                                        chartConfig[
                                                            name as keyof typeof chartConfig
                                                        ]?.color;

                                                    const numericValue = Number(
                                                        value ?? 0,
                                                    );

                                                    const formatValue =
                                                        chartKey === "usage"
                                                            ? formatBytes(
                                                                  numericValue,
                                                              )
                                                            : numericValue;

                                                    return (
                                                        <div className="w-full max-w-sm flex items-center justify-between!">
                                                            <div className="flex-1 flex items-center gap-2">
                                                                <div
                                                                    className="h-2 w-2 shrink-0 rounded-[2px]"
                                                                    style={{
                                                                        backgroundColor:
                                                                            color,
                                                                    }}
                                                                />
                                                                <span>
                                                                    {chartConfig[
                                                                        name as keyof typeof chartConfig
                                                                    ]?.label ||
                                                                        name}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                {formatValue}
                                                            </div>
                                                        </div>
                                                    );
                                                }}
                                            />
                                        }
                                    />
                                    <Bar
                                        dataKey={activeChart}
                                        fill={CHART_TYPES[activeChart].color}
                                        radius={[2, 2, 0, 0]}
                                    />

                                    <ChartLegend
                                        verticalAlign="bottom"
                                        content={<ChartLegendContent />}
                                    />
                                </BarChart>
                            </ChartContainer>
                        )}
                    </div>

                    <StorageUsage
                        usage={storageData?.totalUsage ?? 0}
                        quota={storageData?.quota ?? 0}
                        formattedUsage={
                            storageData?.formattedTotalUsage || "0B"
                        }
                        formattedQuota={storageData?.formattedQuota || "2GB"}
                    />
                </div>
            </CardContent>
        </Card>
    );
};
