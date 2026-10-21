import { AllApiKeys } from "@/components/apiKeys/all-apikeys";
import { CreateApiKeyDialog } from "@/components/apiKeys/create-apikey";
import { PageLayout } from "@/components/layouts/page-layout";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const ApiKeys = () => {
    return (
        <PageLayout
            title="Api Keys"
            subtitle="View And Manage Your UploadNest API Keys."
            rightAction={
                <CreateApiKeyDialog>
                    <Button className="pr-7!">
                        <PlusIcon />
                        Create Key
                    </Button>
                </CreateApiKeyDialog>
            }
        >
            <div className="w-full h-auto">
                <AllApiKeys />
            </div>
        </PageLayout>
    );
};

export default ApiKeys;
