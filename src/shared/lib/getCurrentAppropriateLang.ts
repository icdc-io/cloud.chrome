import type { Langs } from "@/shared/translations/i18n";

export const getCurrentAppropriateLang = (lang: Langs) => {
  return (
    navigator.languages.find((browserLang) => browserLang.includes(lang)) ||
    lang
  );
};
