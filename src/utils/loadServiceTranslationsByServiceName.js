import i18next from "i18next";

const { locales } = require("../i18n");

export const loadServiceTranslationsByServiceName = (serviceName) => {
  return import(`../translations/${serviceName}/i18n`).then((module) => {
    locales.forEach((lang) => {
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
