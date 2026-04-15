type DeepValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
	? K extends keyof T
		? DeepValue<T[K], Rest>
		: unknown
	: P extends keyof T
		? T[P]
		: unknown;

export const fieldGetter = <T, P extends string>(
	obj: T,
	fieldName: P,
): DeepValue<T, P> | string => {
	if (!obj || !fieldName) return "";

	return (fieldName.split(".").reduce<unknown>((acc, curr) => {
		if (!acc || typeof acc !== "object") return "";
		return (acc as Record<string, unknown>)[curr];
	}, obj) ?? "") as DeepValue<T, P> | string;
};
