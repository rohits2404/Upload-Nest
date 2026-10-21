import SignIn from "@/pages/auth/sign-in";
import { AUTH_ROUTES } from "./routePath";
import SignUp from "@/pages/auth/sign-up";

export const authenticationRoutePaths = [
    { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
    { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
];
