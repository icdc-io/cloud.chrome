export const fieldGetter = <T, R = unknown>(
	obj: T,
	fieldName: string,
): R | string => {
	if (!obj || !fieldName) return "";

	return (
		(fieldName.split(".").reduce<unknown>((acc, curr) => {
			if (!acc || typeof acc !== "object") return "";
			return (acc as Record<string, R>)[curr];
		}, obj) as R) ?? ""
	);
};
