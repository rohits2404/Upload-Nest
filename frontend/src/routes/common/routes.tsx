import SignIn from "@/pages/auth/sign-in";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePath";
import SignUp from "@/pages/auth/sign-up";
import Overview from "@/pages/overview";
import Files from "@/pages/files";
import ApiKeys from "@/pages/apiKeys";

export const authenticationRoutePaths = [
    { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
    { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
];

export const protectedRoutePaths = [
    { path: PROTECTED_ROUTES.OVERVIEW, element: <Overview /> },
    { path: PROTECTED_ROUTES.FILES, element: <Files /> },
    { path: PROTECTED_ROUTES.APIKEYS, element: <ApiKeys /> },
];
