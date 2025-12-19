export const sortByParams = <T extends Record<string, unknown>>(
	brokers: T[],
	{ column, direction }: { column: string; direction: string },
) => {
	if (!brokers) return [];

	if (!brokers.length) return brokers;

	if (!column || !direction) return brokers;

	const sorted = [...brokers].sort((a, b) => {
		const av = a[column];
		const bv = b[column];

		if (av == null && bv != null) return -1;
		if (av != null && bv == null) return 1;
		if (av == null && bv == null) return 0;

		if (typeof av === "number" && typeof bv === "number") {
			return direction === "ascending" ? av - bv : bv - av;
		}

		const as = String(av);
		const bs = String(bv);

		return direction === "ascending"
			? as.localeCompare(bs)
			: bs.localeCompare(as);
	});

	return sorted;
};
