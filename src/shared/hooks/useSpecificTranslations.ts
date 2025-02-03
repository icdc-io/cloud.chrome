import { loadServiceTranslationsByServiceName } from "@/shared/lib/loadServiceTranslationsByServiceName";
import { useEffect } from "react";

export const useSpecificTranslations = () => {
	useEffect(() => {
		const changeServiceListener = (e: CustomEvent) => {
			loadServiceTranslationsByServiceName(e.detail);
		};
		window.addEventListener(
			"switchTranslations",
			changeServiceListener as EventListener,
		);

		return () =>
			window.removeEventListener(
				"switchTranslations",
				changeServiceListener as EventListener,
			);
	}, []);

	return;
};
