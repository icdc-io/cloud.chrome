import { kc } from "@/entities/keycloak";
import { changeCurrentService, fetchLocationData } from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Errors } from "@/shared/constants/errors";
import { HOME } from "@/shared/constants/servicesNames";
import { useSpecificTranslations } from "@/shared/hooks/useSpecificTranslations";
import { isServiceAvailable } from "@/shared/lib/availability";
import { loadServiceTranslationsByServiceName } from "@/shared/lib/loadServiceTranslationsByServiceName";
import type { Service } from "@/types/entities";
import ErrorScreen from "@/widgets/Error";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const changeMetaData = (serviceInfo: Service | undefined) => {
	if (!serviceInfo) {
		document.title = "Home";
	} else {
		document.title = serviceInfo.display_name || "";
		const description = [
			...(document.getElementsByTagName(
				"META",
			) as HTMLCollectionOf<HTMLMetaElement>),
		].find((tag) => tag.name === "description");
		if (description) {
			description.setAttribute("content", serviceInfo.description || "");
		} else {
			const metaDescription = document.createElement("meta");
			metaDescription.setAttribute("name", "description");
			metaDescription.setAttribute("content", serviceInfo.description || "");
		}
	}
};

const AvailableRoute = () => {
	useSpecificTranslations();
	const currentServiceName = useAppSelector(
		(state) => state.host.currentService,
	);
	const location = useLocation();
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.host.user);
	const currentService = useAppSelector((state) => state.host.currentService);
	const fullAccountsInfo = useAppSelector(
		(state) => state.host.fullAccountsInfo,
	);
	const currentRoute = location.pathname.split("/")[1];

	// if (!fullAccountsInfo || !currentService) return;
	const currentServiceInfo =
		fullAccountsInfo?.[user.account]?.servicesInLocations?.[user.location]?.[
			currentService || ""
		];
	const token = kc.getUserInfo();

	useEffect(() => {
		loadServiceTranslationsByServiceName(currentServiceName || HOME);
		changeMetaData(currentServiceInfo);
	}, []);

	useEffect(() => {
		if (currentRoute !== currentServiceName) {
			dispatch(changeCurrentService(currentRoute));
			loadServiceTranslationsByServiceName(currentRoute || HOME);
		}
	}, [currentRoute]);

	useEffect(() => {
		changeMetaData(currentServiceInfo);
	}, [currentService]);

	useEffect(() => {
		dispatch(fetchLocationData(user.location));
	}, [user.location]);

	if (currentService && token && !isServiceAvailable(currentService, token))
		return <ErrorScreen errorStatus={Errors.NO_ACCESS_ERROR} />;

	return <Outlet />;
};

export default AvailableRoute;
