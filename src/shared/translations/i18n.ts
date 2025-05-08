import ErrorEn from "@/shared/images/error_en.svg";
import ErrorRu from "@/shared/images/error_ru.svg";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import type { Langs } from "./langs";

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
			toHome: "Home",
			accessDeniedTitle: "Access Denied",
			accessDeniedDescript: "You don't have access to the service",
			noInternet: "No internet connection",
			success: "Success",
			unknown_error: "Unknown error",
			network_error: "Network error or CORS issue",
			copied: "Copied!",
			listEmpty: "List is empty",
			noResults: "No results.",
			required: "Required",
			noOptions: "No options",
			maxLength: "Must be {{value}} characters or less",
			minLength: "Must be {{value}} characters or more",
			notifications: "Notifications",
			markAllAsRead: "Mark all as read",
			openEvents: "Open events",
			all: "All",
			events: "Events",
			alerts: "Alerts",
			markAsRead: "Mark as read",
			markAsUnread: "Mark as unread",
			delete: "Delete",
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
			toHome: "На главную",
			accessDeniedTitle: "В доступе отказано",
			accessDeniedDescript: "У вас нет доступа к сервису",
			noInternet: "Нет подключения к Интернету",
			success: "Успешно",
			unknown_error: "Неизвестная ошибка",
			network_error: "Ошибка сети или проблема CORS",
			copied: "Скопировано!",
			listEmpty: "Список пуст",
			noResults: "Нет результатов.",
			required: "Обязательно для заполнения",
			noOptions: "Нет вариантов",
			minLength: "Должно быть {{value}} символов или больше",
			maxLength: "Должно быть {{value}} символов или меньше",
			notifications: "Уведомления",
			markAllAsRead: "Отметить все как прочитанное",
			openEvents: "Открыть события",
			all: "Все",
			events: "События",
			alerts: "Алерты",
			markAsRead: "Отметить как прочитанное",
			markAsUnread: "Отметить как непрочитанное",
			delete: "Удалить",
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
