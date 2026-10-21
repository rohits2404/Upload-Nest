import { useAuthExpiration } from "@/hooks/use-auth-expiration";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthRoute from "./authRoute";
import { BaseLayout } from "@/components/layouts/base-layout";
import { authenticationRoutePaths, protectedRoutePaths } from "./common/routes";
import { ProtectedRoute } from "./protectedRoute";
import { AppLayout } from "@/components/layouts/app-layout";

export const AppRoutes = () => {
    useAuthExpiration();
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthRoute />}>
                    <Route element={<BaseLayout />}>
                        {authenticationRoutePaths.map((route) => (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={route.element}
                            />
                        ))}
                    </Route>
                </Route>
                <Route element={<ProtectedRoute />}>
                    <Route element={<AppLayout />}>
                        {protectedRoutePaths.map((route) => {
                            return (
                                <Route
                                    key={route.path}
                                    path={route.path}
                                    element={route.element}
                                />
                            );
                        })}
                    </Route>
                </Route>
                <Route path="*" element={<>404</>} />
            </Routes>
        </BrowserRouter>
    );
};
