import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ErrorEn from "@/shared/images/error_en.svg";
import ErrorRu from "@/shared/images/error_ru.svg";

export enum Langs {
  ru = "ru",
  en = "en",
}

type Translation = {
  [key: string]: string;
};

type LanguageResources = {
  [key in Langs]: {
    translation: Translation;
  };
};

export const resources: LanguageResources = {
  en: {
    translation: {
      lang: "English",
      notAvailable:
        "The service is not available in this location. Please choose another location.",
      wrong: "Oops, something went wrong.",
      wrongDescription: "If this issue persists, please visit our",
      statusPage: "Status Page",
      refresh: "Refresh",
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
      errorImg: ErrorEn,
      error: "Error",
      logout: "Log out",
      unauthTitle: "401 Unauthorized",
      unAuthDescription:
        "Try selecting the correct role, and if the issue persists, please try logging in and out.",
      unAvailable: "The service is not available in this location",
      location: "Location",
      role: "Role",
      accounts: "Accounts",
      language: "Language",
      unavailableDescription: "Please choose another location.",
      loading: "Loading...",
    },
  },
  ru: {
    translation: {
      lang: "Русский",
      notAvailable:
        "Сервис недоступен в этой локации. Пожалуйста, выберите другую локацию.",
      wrong: "Упс, что-то пошло не так.",
      wrongDescription: "Если проблема сохраняется, пожалуйста, посетите нашу",
      statusPage: "страницу статуса",
      refresh: "Обновить",
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
      errorImg: ErrorRu,
      error: "Ошибка",
      logout: "Выйти",
      unauthTitle: "401 Ошибка доступа",
      unAuthDescription:
        "Попробуйте выбрать правильную роль, и если проблема сохраняется, пожалуйста, попробуйте перезайти в систему.",
      unAvailable: "Сервис недоступен в текущей локации",
      location: "Локация",
      role: "Роль",
      accounts: "Аккаунты",
      language: "Язык",
      unavailableDescription: "Пожалуйста, выберите другую локацию.",
      loading: "Загрузка...",
    },
  },
};

export const locales = Object.keys(resources) as Array<keyof typeof Langs>;

export const langs = locales.map((locale) => ({
  text: resources[locale].translation.lang,
  value: locale,
}));

export const currentLang = () => {
  const language = localStorage.getItem("icdc-lang");
  const currentLang =
    !language || !locales.includes(language as Langs) ? locales[0] : language;

  return currentLang as Langs;
};

i18n.use(initReactI18next).init({
  resources,
  lng: currentLang(),
  fallbackLng: locales[0],
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
});

export { i18n as i18nInstance };
