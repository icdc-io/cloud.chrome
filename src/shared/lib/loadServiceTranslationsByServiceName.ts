import { i18nInstance } from "@/shared/translations/i18n";
import type { Langs } from "@/shared/translations/langs";

const { locales } = require("@/shared/translations/i18n");

export const loadServiceTranslationsByServiceName = async (
	origin: string,
	serviceName?: string,
) => {
	const url = `${origin}/i18n.json?time=${Date.now()}`;
	// temporary while migration is in progress, we need to load translations from the old url
	const oldUrl = `/translations/${serviceName}/i18n.json?t=${Date.now()}`;

	const res = await fetch(origin === "local" ? oldUrl : url);
	const translations = await res.json();

	locales.forEach((lang: Langs) => {
		i18nInstance.addResourceBundle(
			lang,
			"translation",
			translations[lang].translation,
		);
	});
};
