import type { Langs } from "@/i18n";

export const getCurrentAppropriateLang = (lang: Langs) => {
	return (
		navigator.languages.find((browserLang) => browserLang.includes(lang)) ||
		lang
	);
};
