import { useEffect } from "react";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";

export const useAuthExpiration = () => {
    const { accessToken, expiresAt } = useTypedSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!accessToken || !expiresAt) return;
        const timeUntilExpiration = new Date(expiresAt).getTime() - Date.now();

        if (timeUntilExpiration <= 2 * 60 * 1000) {
            dispatch(logout());
            return;
        }

        const timer = setTimeout(
            () => dispatch(logout()),
            timeUntilExpiration - 2 * 60 * 1000,
        );
        return () => clearTimeout(timer);
    }, [accessToken, expiresAt, dispatch]);
};
