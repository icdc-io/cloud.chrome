import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      lang: "English",
      notAvailable:
        "The service is not available in this location. Please choose another location.",
      wrong: "Something went wrong. Please try again later.",
      noAccess: "You don't have enough rights.",
      noAccessAcc: "No access",
      notMatch:
        "Unfortunately, your credentials do not match any organizational account",
      hasAcc: "If your organization has an account:",
      hasAccDescr:
        "Contact your Administrator. They will need to provide you with the appropriate access rights.",
      hasNotAcc: "If your organization does not have an account:",
      hasNotAccDescr:
        "Contact the local service provider's support team for further assistance.",
      thank: "Thank you for your understanding.",
      supportBtn: "Support",
      exitBtn: "Log out",
    },
  },
  ru: {
    translation: {
      lang: "Русский",
      notAvailable:
        "Сервис недоступен в этой локации. Пожалуйста, выберите другую.",
      wrong: "Что-то пошло не так. Пожалуйста, попробуте позже.",
      noAccess: "Недостаточно прав.",
      noAccessAcc: "Нет доступа",
      notMatch:
        "Ваши учетные данные не соответствуют ни одному организационному аккаунту.",
      hasAcc: "Если у вашей организации есть аккаунт:",
      hasAccDescr:
        "Обратитесь к своему Администратору. Ему необходимо будет предоставить вам соответствующие права доступа.",
      hasNotAcc: "Если у вашей организации нет аккаунта:",
      hasNotAccDescr:
        "Свяжитесь со службой поддержки локального провайдера услуг для получения дополнительной помощи.",
      thank: "Благодарим за понимание.",
      supportBtn: "Поддержка",
      exitBtn: "Выйти",
    },
  },
};

const locales = Object.keys(resources);

export const langs = locales.map((locale) => ({
  text: resources[locale].translation.lang,
  value: locale,
}));

export const currentLang = () => {
  const language = localStorage.getItem("icdc-lang");
  const currentLang = locales.includes(language) ? language : locales[0];

  return currentLang;
};

i18n.use(initReactI18next).init({
  resources,
  lng: currentLang(),
  fallbackLng: locales[0],
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export default i18n;
