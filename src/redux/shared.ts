import {
	type TypedUseSelectorHook,
	useDispatch,
	useSelector,
} from "react-redux";
import type { RootState, store } from "./store";

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
