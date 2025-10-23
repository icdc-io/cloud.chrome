import type { Langs } from "@/shared/translations/langs";
import type { Remote, Service } from "@/types/entities";
import i18next from "i18next";
import { HOME } from "../constants/servicesNames";

const { locales } = require("@/shared/translations/i18n");

export const loadServiceTranslationsByServiceName = (
	serviceInfo: Remote | string,
	appName: string,
) => {
	let url = window.location.origin;
	if (process.env.NODE_ENV === "development") {
		if ((serviceInfo as string) === HOME) {
			url = "http://localhost:8080";
		} else {
			const appUrl = (serviceInfo as Remote)?.apps?.find(
				(app) => app.name === appName,
			)?.url;
			url = appUrl || url;
		}
	}
	console.log("origin url: ", url);
	return (
		fetch(`${url}/i18n.json?${new Date().getMilliseconds()}`)
			.then((module) => module.json())
			.then((module) => {
				console.log("fetch new translations");
				locales.forEach((lang: Langs) => {
					i18next.addResourceBundle(
						lang,
						"translation",
						module[lang].translation,
					);
				});
			})
			// for old translations approach
			.catch(() => {
				fetch(
					`/translations/${(serviceInfo as Service).name}/i18n.json?${new Date().getMilliseconds()}`,
				)
					.then((module) => module.json())
					.then((module) => {
						console.log("fetch old translations");
						locales.forEach((lang: Langs) => {
							i18next.addResourceBundle(
								lang,
								"translation",
								module[lang].translation,
							);
						});
					});
			})
	);
};
