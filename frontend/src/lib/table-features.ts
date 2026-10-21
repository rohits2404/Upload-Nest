import {
    tableFeatures,
    rowSelectionFeature,
    rowSortingFeature,
    columnFilteringFeature,
    columnVisibilityFeature,
    createSortedRowModel,
    createFilteredRowModel,
    sortFn_alphanumeric,
    sortFn_text,
    sortFn_basic,
    sortFn_datetime,
    filterFn_includesString,
} from "@tanstack/react-table";

export const assetTableFeatures = tableFeatures({
    rowSelectionFeature,
    rowSortingFeature,
    columnFilteringFeature,
    columnVisibilityFeature,
    sortedRowModel: createSortedRowModel(),
    filteredRowModel: createFilteredRowModel(),
    sortFns: {
        alphanumeric: sortFn_alphanumeric,
        text: sortFn_text,
        basic: sortFn_basic,
        datetime: sortFn_datetime,
    },
    filterFns: {
        includesString: filterFn_includesString,
    },
});

export type AssetTableFeatures = typeof assetTableFeatures;
