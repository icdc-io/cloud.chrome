import { locales } from "@/shared/translations/i18n";
import i18next from "i18next";

export const loadServiceTranslationsByServiceName = (serviceName: string) => {
	return fetch(
		`/translations/${serviceName}/i18n.json?${new Date().getMilliseconds()}`,
	)
		.then((module) => module.json())
		.then((module) => {
			locales.forEach((lang) => {
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
