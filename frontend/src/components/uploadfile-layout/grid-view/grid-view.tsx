import { FolderOpen } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { FileCardSkeleton } from "@/components/file-card/skeleton";
import type { FileType } from "@/features/file/filesType";
import { FileCard } from "../../file-card";

type Props = {
    data: FileType[];
    isLoading: boolean;
    selectedFiles: FileType[];
    onToggleSelect: (file: FileType) => void;
};

export const GridView = (props: Props) => {
    const { selectedFiles, onToggleSelect, data, isLoading } = props;

    const handleFileSelection = (file: FileType) => {
        onToggleSelect(file);
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                    <FileCardSkeleton key={i} />
                ))
            ) : data.length > 0 ? (
                data.map((file) => {
                    const isSelected = selectedFiles.some(
                        (selectedFile) => selectedFile.id === file.id,
                    );
                    return (
                        <FileCard
                            key={file.id}
                            file={file}
                            isSelected={isSelected}
                            toggleFileSelection={handleFileSelection}
                        />
                    );
                })
            ) : (
                <div className="col-span-5">
                    <EmptyState
                        title="No Files Found"
                        description="You Haven’t Any Files. Upload To Get Started."
                        icon={FolderOpen}
                    />
                </div>
            )}
        </div>
    );
};
