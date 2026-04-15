export const fieldSetter = <T extends Record<string, unknown>, V = unknown>(
	obj: T = {} as T,
	path: string,
	value: V,
): T => {
	if (!path) {
		return obj;
	}

	const keys = path.split(".");
	const result = { ...obj } as Record<string, unknown>;
	let current: Record<string, unknown> = result;

	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		current[key] = current[key]
			? { ...(current[key] as Record<string, unknown>) }
			: {};
		current = current[key] as Record<string, unknown>;
	}

	current[keys[keys.length - 1]] = value;

	return result as T;
};
