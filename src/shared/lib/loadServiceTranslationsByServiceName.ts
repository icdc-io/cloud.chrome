import i18next from "i18next";
import { locales } from "@/shared/translations/i18n";
import type { App, Remote } from "@/types/entities";

export const loadServiceTranslationsByServiceName = (
	serviceInfo: Remote,
	appInfo: App | undefined,
) => {
	const isProd = process.env.NODE_ENV === "production";
	const origin = isProd
		? window.location.origin
		: appInfo
			? appInfo.url
			: serviceInfo.url; // 1 case for env = prod, 2 - for remote apps, 3 - for home service

	const url = [
		origin,
		isProd && serviceInfo.name,
		isProd && appInfo?.name,
		`i18n.json?${new Date().getMilliseconds()}`,
	]
		.filter(Boolean)
		.join("/");

	return fetch(url)
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
