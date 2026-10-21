import { useRef, useState } from "react";
import { FileUploader, type FileUploaderRef } from "../file-uploader";
import { useUploadFilesMutation } from "@/features/file/filesAPI";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

export const FileUploaderDialog = (props: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileUploaderRef = useRef<FileUploaderRef>(null);

    const [uploadFiles] = useUploadFilesMutation();

    const handleUploadButtonClick = () => {
        if (selectedFiles.length === 0) {
            toast.info("Please Select Files To Upload");
            return;
        }

        setIsOpen(false);

        const totalFiles = selectedFiles.length;
        const toastId = toast.loading(`Uploading ${totalFiles} File(s)...`, {
            description: "Please Wait While We Upload Your Files",
            duration: Infinity,
        });

        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));

        uploadFiles(formData)
            .unwrap()
            .then((res) => {
                const successCount = res.data.length;
                const failedCount = res.failedCount || 0;
                toast.success(
                    `Uploaded ${successCount} File(s) Successfully ` +
                        (failedCount > 0 ? `${failedCount} Failed` : ""),
                    {
                        id: toastId,
                        description: `Your Files Are Now Available`,
                    },
                );
            })
            .catch((error) => {
                console.log(error);
                toast.error("Failed To Upload Files", {
                    id: toastId,
                    description: "Please Try Again Later",
                });
            })
            .finally(() => {
                toast.dismiss(toastId);
                fileUploaderRef.current?.clearSelectedFiles();
                setSelectedFiles([]);
            });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{props.children}</DialogTrigger>
            <DialogContent className="w-full sm:max-w-150 p-6">
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                </DialogHeader>
                <div className="py-4 w-full">
                    <FileUploader
                        ref={fileUploaderRef}
                        onFilesSelected={setSelectedFiles}
                        maxFileSize={100 * 1024 * 1024}
                        acceptedFileTypes={{
                            "image/*": [
                                ".jpeg",
                                ".png",
                                ".gif",
                                ".svg",
                                ".jpg",
                            ],
                            "application/pdf": [".pdf"],
                            "application/msword": [".doc"],
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                                [".docx"],
                            "application/vnd.ms-excel": [".xls"],
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                                [".xlsx"],
                            "application/vnd.ms-powerpoint": [".ppt"],
                            "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                                [".pptx"],
                            "application/zip": [".zip"],
                            "application/x-rar-compressed": [".rar"],
                            "application/x-tar": [".tar"],
                            "text/plain": [".txt"],
                        }}
                    />
                </div>
                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleUploadButtonClick}
                        className="hover:bg-primay/80 cursor-pointer text-white w-full disabled:opacity-80 disabled:cursor-not-allowed"
                        disabled={selectedFiles.length === 0}
                    >
                        Upload
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
