import { useEffect, useRef } from "react";

export const useAvoidFirstRender = (
	callback: () => void,
	depsArray: unknown[],
) => {
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender?.current) {
			isFirstRender.current = false;
			return;
		}

		callback();
	}, depsArray);
};
