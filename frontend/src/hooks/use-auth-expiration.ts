import { useEffect } from "react";
import { useAppDispatch, useTypedSelector } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";

const MAX_TIMEOUT = 2_147_483_647; // max setTimeout delay (~24.8 days)
const EXPIRY_BUFFER = 2 * 60 * 1000; // log out 2 minutes early

export const useAuthExpiration = () => {
    const { accessToken, expiresAt } = useTypedSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!accessToken || !expiresAt) return;

        let timer: ReturnType<typeof setTimeout>;

        const check = () => {
            const remaining = expiresAt - Date.now() - EXPIRY_BUFFER;

            if (remaining <= 0) {
                dispatch(logout());
                return;
            }

            // Wait at most MAX_TIMEOUT, then re-evaluate
            timer = setTimeout(check, Math.min(remaining, MAX_TIMEOUT));
        };

        check();
        return () => clearTimeout(timer);
    }, [accessToken, expiresAt, dispatch]);
};
