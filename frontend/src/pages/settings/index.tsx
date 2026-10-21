import { PageLayout } from "@/components/layouts/page-layout";
import { Account } from "@/components/settings/account";
import Appearance from "@/components/settings/appearance";

const Settings = () => {
    return (
        <PageLayout
            title="Settings"
            subtitle="Configure The Settings For This Application."
        >
            <div className="flex flex-col space-y-8 h-auto py-5 pb-7 px-4 divide-y-2 divide-gray-100 dark:divide-gray-800 border rounded-2xl">
                <Appearance />
                <Account />
            </div>
        </PageLayout>
    );
};

export default Settings;
