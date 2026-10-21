import { useEffect } from "react";
import { useTypedSelector } from "@/app/hook";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AUTH_ROUTES } from "./common/routePath";

export const ProtectedRoute = () => {
    const { accessToken, user } = useTypedSelector((state) => state.auth);
    const location = useLocation();

    useEffect(() => {
        console.log("ProtectedRoute check:", {
            pathname: location.pathname,
            hasAccessToken: Boolean(accessToken),
            hasUser: Boolean(user),
        });
    }, [location.pathname, accessToken, user]);

    if (!accessToken || !user) {
        console.warn("Redirecting to sign-in: missing credentials");
        return <Navigate to={AUTH_ROUTES.SIGN_IN} replace />;
    }

    return <Outlet />;
};
