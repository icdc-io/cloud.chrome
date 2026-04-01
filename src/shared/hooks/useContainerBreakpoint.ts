import { useEffect, useState } from "react";

export function useContainerBreakpoint(
	ref: React.MutableRefObject<null>,
	breakpoint: number = 600,
) {
	const [isNarrow, setIsNarrow] = useState(false);

	useEffect(() => {
		if (!ref.current) return;
		const observer = new ResizeObserver(([entry]) => {
			setIsNarrow(entry.contentRect.width <= breakpoint);
		});
		observer.observe(ref.current);
		return () => observer.disconnect();
	}, [ref, breakpoint]);

	return isNarrow;
}
