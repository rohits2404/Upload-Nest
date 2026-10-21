import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { Link } from "react-router-dom";

export const Logo = (props: { url?: string }) => {
    return (
        <Link
            to={props.url || PROTECTED_ROUTES.OVERVIEW}
            className="flex items-center gap-2"
        >
            <div>
                <h1 className="relative flex select-none flex-row items-baseline font-bold text-2xl lg:text-3xl">
                    <span className="sr-only">UploadNest</span>
                    <span className="tracking-tight cursor-pointer">
                        Upload<span className="text-primary">Nest</span>
                    </span>
                </h1>
            </div>
        </Link>
    );
};
