import type * as actions from "../redux/actions";

type InferValueTypes<T> = T extends {
	[key: string]: infer U;
}
	? U
	: never;

export type ActionsTypes = ReturnType<InferValueTypes<typeof actions>>;
