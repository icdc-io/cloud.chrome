import type { Langs } from "@/shared/translations/i18n";
import i18next from "i18next";

const { locales } = require("@/shared/translations/i18n");

export const loadServiceTranslationsByServiceName = (serviceName: string) => {
  return import(`@/shared/translations/${serviceName}/i18n`).then((module) => {
    locales.forEach((lang: Langs) => {
      i18next.addResourceBundle(
        lang,
        "translation",
        module.default[lang].translation,
      );
    });
  });
};

// loadServiceTranslationsByServiceName("storage2").then(() => {
//   setState(prev => prev + 1);
// });
