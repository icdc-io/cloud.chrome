import { useEffect, useMemo, useRef } from "react";

function debounce<Args extends unknown[]>(
	fn: (...args: Args) => void,
	delay: number,
): ((...args: Args) => void) & { cancel: () => void } {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	const debounced = (...args: Args) => {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			timeoutId = null;
			fn(...args);
		}, delay);
	};

	debounced.cancel = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	};

	return debounced;
}

export function useDebouncedCallback<Args extends unknown[]>(
	fn: (...args: Args) => void,
	delay: number,
): ((...args: Args) => void) & { cancel: () => void } {
	const fnRef = useRef(fn);
	fnRef.current = fn;

	const debounced = useMemo(
		() =>
			debounce((...args: Args) => {
				fnRef.current(...args);
			}, delay),
		[delay],
	);

	useEffect(() => {
		return () => debounced.cancel();
	}, [debounced]);

	return debounced;
}
