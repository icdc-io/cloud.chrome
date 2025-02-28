import type { Langs } from "@/shared/translations/langs";
import i18next from "i18next";

const { locales } = require("@/shared/translations/i18n");

export const loadServiceTranslationsByServiceName = (serviceName: string) => {
	return fetch(`/translations/${serviceName}/i18n.json`)
		.then((module) => module.json())
		.then((module) => {
			locales.forEach((lang: Langs) => {
				i18next.addResourceBundle(
					lang,
					"translation",
					module[lang].translation,
				);
			});
		});
};

// loadServiceTranslationsByServiceName("storage2").then(() => {
//   setState(prev => prev + 1);
// });
