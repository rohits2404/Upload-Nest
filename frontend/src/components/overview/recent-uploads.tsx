import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { UploadFileLayout } from "../uploadfile-layout";
import { LAYOUT_VIEW } from "@/constant";

export const RecentUploads = () => {
    return (
        <Card className="gap-4!">
            <CardHeader className="pb-0! w-full flex items-center justify-center">
                <CardTitle className="flex-1">Recent Uploads</CardTitle>
                <Link
                    to={PROTECTED_ROUTES.FILES}
                    className="underline text-sm text-muted-foreground"
                >
                    View All
                </Link>
            </CardHeader>
            <CardContent>
                <UploadFileLayout
                    showToolBar={false}
                    isShowPagination={false}
                    layoutView={LAYOUT_VIEW.LIST}
                />
            </CardContent>
        </Card>
    );
};
