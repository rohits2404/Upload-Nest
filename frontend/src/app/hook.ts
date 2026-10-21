import {
    useDispatch,
    useSelector,
    type TypedUseSelectorHook,
} from "react-redux";

import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
