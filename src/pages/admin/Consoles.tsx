import { useAppSelector } from "@/redux/store";
import External from "@/shared/images/ext.svg";
import { Button } from "@/shared/ui/button";
import Loader from "@/shared/ui/loader";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Consoles = () => {
	const { t } = useTranslation();
	const { location } = useAppSelector((state) => state.host.user);
	const baseUrls = useAppSelector((state) => state.host.baseUrls);
	const servicesArray = new Array(5).fill("");
	const [isLoaded, setIsLoaded] = useState(false);

	const currentBaseUrl = baseUrls?.[location]
		? baseUrls[location].substr(baseUrls[location].indexOf(".") + 1)
		: "";

	useEffect(() => {
		setTimeout(() => {
			setIsLoaded(true);
		}, 100);
	}, []);

	return isLoaded ? (
		<div className="general-container">
			<div className="consoles">
				<h2>{t("consolesTitle")}</h2>
				<p className="consoles-description">{t("consolesDescription")}</p>
				{servicesArray.map((_item, index) => (
					<div className="service-block" key={index}>
						<h6>{t(`consolesItem${index + 1}Title`)}</h6>
						<p>{t(`consolesItem${index + 1}Description`)}</p>
						<a
							href={t(`consolesItem${index + 1}Link`, {
								baseUrl: currentBaseUrl,
							})}
							target="_blank"
							rel="noreferrer"
						>
							<Button variant="primary">
								{t(`consolesItem${index + 1}Button`)}
								<img src={External} alt="External link" />
							</Button>
						</a>
					</div>
				))}
			</div>
		</div>
	) : (
		<Loader />
	);
};

export default Consoles;
