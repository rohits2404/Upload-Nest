import { FileUploaderDialog } from "@/components/files/fileuploader-dialog";
import { PageLayout } from "@/components/layouts/page-layout";
import { Button } from "@/components/ui/button";
import { UploadFileLayout } from "@/components/uploadfile-layout";
import { UploadCloud } from "lucide-react";

const Files = () => {
    return (
        <PageLayout
            title="Files"
            subtitle="These Are All of The Files That Have Been Uploaded Via Your Uploader."
            rightAction={
                <FileUploaderDialog>
                    <Button className="pr-7!">
                        <UploadCloud />
                        Upload
                    </Button>
                </FileUploaderDialog>
            }
        >
            <div className="w-full">
                <UploadFileLayout
                    showToolBar
                    isShowPagination={true}
                    pageSize={20}
                    layoutView="GRID"
                />
            </div>
        </PageLayout>
    );
};

export default Files;
