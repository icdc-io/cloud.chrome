import { loadServiceTranslationsByServiceName } from "@/shared/lib/loadServiceTranslationsByServiceName";
import { useEffect, useState } from "react";

export const useSpecificTranslations = (url: string) => {
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		loadServiceTranslationsByServiceName(url).finally(() => {
			setIsReady(true);
		});
	}, []);

	return { isReady };
};
