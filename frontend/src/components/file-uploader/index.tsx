import { useCallback, useState, useImperativeHandle, forwardRef } from "react";
import Dropzone from "react-dropzone";
import {
    CloudUploadIcon,
    File,
    MousePointerSquareDashed,
    X,
} from "lucide-react";
import { toast } from "sonner";

interface FileUploaderProps {
    maxFileSize?: number;
    acceptedFileTypes?: Record<string, string[]>;
    onFilesSelected: (files: File[]) => void;
}
export interface FileUploaderRef {
    clearSelectedFiles: () => void;
    getSelectedFiles: () => File[];
}

const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024;

export const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(
    (
        {
            maxFileSize = DEFAULT_MAX_FILE_SIZE,
            acceptedFileTypes,
            onFilesSelected,
        },
        ref,
    ) => {
        const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

        useImperativeHandle(ref, () => ({
            clearSelectedFiles: () => {
                setSelectedFiles([]);
                onFilesSelected([]);
            },
            getSelectedFiles: () => selectedFiles,
        }));

        const handleDrop = useCallback(
            (acceptedFiles: File[], rejectedFiles: any[]) => {
                rejectedFiles.forEach((rejectedFile) => {
                    if (rejectedFile.file.size > maxFileSize) {
                        toast.error(
                            `File "${rejectedFile.file.name}" Exceeds The ${maxFileSize / (1024 * 1024)} MB Limit.`,
                        );
                    } else {
                        toast.error(
                            `File "${rejectedFile.file.name}" Type Not Allowed.`,
                        );
                    }
                });

                const newFiles = acceptedFiles.filter(
                    (file) =>
                        !selectedFiles.some(
                            (existingFile) =>
                                existingFile.name === file.name &&
                                existingFile.size === file.size,
                        ),
                );

                if (newFiles.length > 0) {
                    const updatedFiles = [...selectedFiles, ...newFiles];
                    setSelectedFiles(updatedFiles);
                    onFilesSelected(updatedFiles);
                }
            },
            [maxFileSize, selectedFiles, onFilesSelected],
        );

        const removeFile = useCallback(
            (fileToRemove: File) => {
                const updatedFiles = selectedFiles.filter(
                    (file) => file !== fileToRemove,
                );
                setSelectedFiles(updatedFiles);
                onFilesSelected(updatedFiles);
            },
            [selectedFiles, onFilesSelected],
        );

        return (
            <div className="w-full">
                <Dropzone
                    multiple={true}
                    accept={acceptedFileTypes}
                    maxSize={maxFileSize}
                    onDrop={handleDrop}
                    onDropRejected={(rejectedFiles) => {
                        if (
                            rejectedFiles[0].file.size > DEFAULT_MAX_FILE_SIZE
                        ) {
                            toast.error("File Size Exceeds The Limit");
                        }
                    }}
                >
                    {({ getRootProps, getInputProps }) => (
                        <div
                            {...getRootProps()}
                            className="border border-dashed border-gray-700 rounded-lg p-6 text-center cursor-pointer min-h-100 flex flex-col items-center justify-center overflow-hidden"
                        >
                            <input {...getInputProps()} />
                            {selectedFiles.length === 0 ? (
                                <div className="flex flex-col items-center justify-center gap-1">
                                    <CloudUploadIcon className="h-12 w-12 text-gray-500 mb-1" />
                                    <span className="font-semibold text-primary text-sm leading-6 hover:text-primary-muted">
                                        Choose Files Or Drag And Drop
                                    </span>
                                    <p className="text-sm text-gray-500">
                                        All file types
                                    </p>
                                </div>
                            ) : (
                                <div className="flex h-87.5 w-full flex-col justify-center gap-2 overflow-y-auto p-2 text-muted-foreground text-sm">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between gap-2 p-2 border border-muted rounded-md bg-muted/40 text-sm"
                                        >
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <File className="h-5 w-5 text-gray-500 shrink-0" />
                                                <p
                                                    className="truncate text-[12px] md:text-sm text-ellipsis whitespace-nowrap max-w-37.5 
                        md:max-w-11/12
                        lg:max-w-100"
                                                >
                                                    {file.name}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile(file);
                                                }}
                                                className="text-gray-400 hover:text-gray-600 shrink-0"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}

                                    <p className="flex items-end justify-center gap-1 text-xs text-gray-500 pt-2">
                                        <MousePointerSquareDashed className="w-4 h-4 mb-[0.5px] animate-bounce" />
                                        <span> Click To Add More Files.</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </Dropzone>
            </div>
        );
    },
);

FileUploader.displayName = "FileUploader";
