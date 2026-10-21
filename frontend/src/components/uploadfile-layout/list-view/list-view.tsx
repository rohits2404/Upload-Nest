import type { OnChangeFn, RowSelectionState } from "@tanstack/react-table";
import { useMemo } from "react";
import { DataTable } from "../../data-table";
import { listColumns } from "./column";
import type { FileType } from "@/features/file/filesType";

type Props = {
    data: FileType[];
    selectedFiles: FileType[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<FileType[]>>;
    isShowPagination: boolean;
    pagination: {
        totalCount: number;
        totalPages: number;
        pageNumber: number;
        pageSize: number;
    };
    isLoading: boolean;
    setPagination: React.Dispatch<
        React.SetStateAction<{
            pageNumber: number;
            pageSize: number;
        }>
    >;
};

export const ListView = (props: Props) => {
    const {
        data,
        isShowPagination = false,
        pagination,
        setPagination,
        selectedFiles,
        setSelectedFiles,
        isLoading,
    } = props;

    const rowSelection = useMemo<RowSelectionState>(() => {
        const state: RowSelectionState = {};
        selectedFiles.forEach((file) => {
            state[file.id] = true;
        });
        return state;
    }, [selectedFiles]);

    const handlePageChange = (pageNumber: number) => {
        setPagination((prev) => ({ ...prev, pageNumber }));
    };

    const handlePageSizeChange = (pageSize: number) => {
        setPagination((prev) => ({ ...prev, pageSize }));
    };

    const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (
        updater,
    ) => {
        const nextState =
            typeof updater === "function" ? updater(rowSelection) : updater;
        const selectedIds = Object.keys(nextState);
        const selectedObjects = data.filter((file: FileType) =>
            selectedIds.includes(file?.id),
        );
        setSelectedFiles(selectedObjects);
    };

    return (
        <div>
            <DataTable
                columns={listColumns || []}
                data={data || []}
                isLoading={isLoading}
                showSearch={false}
                selection={true}
                isShowPagination={isShowPagination}
                pagination={pagination}
                rowSelection={rowSelection}
                onRowSelectionChange={handleRowSelectionChange}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
            />
        </div>
    );
};
