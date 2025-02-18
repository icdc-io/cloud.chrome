import type { Langs } from "../../shared/translations/langs";

export const getCurrentAppropriateLang = (lang: Langs) => {
	return (
		navigator.languages.find((browserLang) => browserLang.includes(lang)) ||
		lang
	);
};
