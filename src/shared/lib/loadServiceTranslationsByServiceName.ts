import type { Langs } from "@/shared/translations/langs";
import type { Remote, Service } from "@/types/entities";
import i18next from "i18next";
import { HOME } from "../constants/servicesNames";

const { locales } = require("@/shared/translations/i18n");

export const loadServiceTranslationsByServiceName = (
	serviceInfo: Remote | string,
	appName: string | undefined,
) => {
	const isHome = serviceInfo === HOME;
	const origin = window.location.origin;

	const getBaseUrl = (): string => {
		if (process.env.NODE_ENV === "development") {
			if (isHome) return "http://localhost:8080";

			const remote = serviceInfo as Remote;
			const appUrl = remote?.apps?.find((app) => app.name === appName)?.url;
			if (appUrl) return appUrl;
		}

		if (isHome) return `${origin}/${serviceInfo}`;
		return `${origin}/${(serviceInfo as Remote).name}/${appName}`;
	};

	const url = getBaseUrl();

	return fetch(`${url}/i18n.json?${new Date().getMilliseconds()}`)
		.then((module) => module.json())
		.then((module) => {
			locales.forEach((lang: Langs) => {
				i18next.addResourceBundle(
					lang,
					"translation",
					module[lang].translation,
				);
			});
		});
};
