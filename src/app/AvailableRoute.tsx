// import ErrorScreen from "@/widgets/Error";
import { type FC, type ReactNode, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
	changeBurgerVisibility,
	changeCurrentService,
	changeSidebarVisibility,
	fetchLocationData,
} from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/shared";
// import { Errors } from "@/shared/constants/errors";
import { HOME } from "@/shared/constants/servicesNames";
// import { useSpecificTranslations } from "@/shared/hooks/useSpecificTranslations";
// import { isServiceAvailable } from "@/shared/lib/availability";
import { loadServiceTranslationsByServiceName } from "@/shared/lib/loadServiceTranslationsByServiceName";
import type { Service } from "@/types/entities";

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

type AvailableRoute = {
	children?: ReactNode;
};

const AvailableRoute: FC<AvailableRoute> = ({ children }) => {
	const location = useLocation();
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.host.user);
	const currentService = useAppSelector((state) => state.host.currentService);
	const remotes = useAppSelector((state) => state.host.remotes);
	const currentRoute = location.pathname.split("/")[1];
	const currentServiceApp = location.pathname.split("/")[2];

	// if (!fullAccountsInfo || !currentService) return;
	const currentServiceInfo = currentRoute
		? remotes?.find(
				(service) => service.path.substring(1) === currentService,
			) || HOME
		: HOME;

	useEffect(() => {
		const newService = location.pathname.split("/")[1];
		dispatch(changeSidebarVisibility(Boolean(newService)));
		dispatch(changeBurgerVisibility(Boolean(newService)));
	}, [location.pathname]);

	useEffect(() => {
		changeMetaData(currentServiceInfo);
	}, []);

	useEffect(() => {
		if (currentRoute !== currentService) {
			dispatch(changeCurrentService(currentRoute));
		}
	}, [currentRoute]);

	useEffect(() => {
		const currentServiceAppInfo = currentServiceInfo.apps?.find(
			(app) => app.name === currentServiceApp,
		);

		if (currentServiceAppInfo) {
			loadServiceTranslationsByServiceName(
				currentServiceInfo,
				currentServiceAppInfo,
			);
		}
	}, [currentServiceApp, currentServiceInfo]);

	useEffect(() => {
		if (currentServiceInfo.name === HOME.name) {
			loadServiceTranslationsByServiceName(currentServiceInfo, undefined);
		}
	}, []);

	useEffect(() => {
		changeMetaData(currentServiceInfo);
	}, [currentService]);

	useEffect(() => {
		dispatch(fetchLocationData(user.location));
	}, [user.location]);

	if (children) return children;

	// if (currentService && token && !isServiceAvailable(currentService, token))
	// 	return <ErrorScreen errorStatus={Errors.NO_ACCESS_ERROR} />;

	return <Outlet />;
};

export default AvailableRoute;
