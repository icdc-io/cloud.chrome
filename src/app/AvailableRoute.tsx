import { kc } from "@/entities/keycloak";
import {
	changeBurgerVisibility,
	changeCurrentService,
	changeSidebarVisibility,
	fetchLocationData,
} from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/shared";
import { Errors } from "@/shared/constants/errors";
import { HOME } from "@/shared/constants/servicesNames";
import { useSpecificTranslations } from "@/shared/hooks/useSpecificTranslations";
import { isServiceAvailable } from "@/shared/lib/availability";
import { loadServiceTranslationsByServiceName } from "@/shared/lib/loadServiceTranslationsByServiceName";
import type { Service } from "@/types/entities";
import ErrorScreen from "@/widgets/Error";
import { type FC, type ReactNode, useEffect } from "react";
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

type AvailableRoute = {
	children?: ReactNode;
};

const AvailableRoute: FC<AvailableRoute> = ({ children }) => {
	useSpecificTranslations();
	const currentServiceName = useAppSelector(
		(state) => state.host.currentService,
	);
	const location = useLocation();
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.host.user);
	const currentService = useAppSelector((state) => state.host.currentService);
	const remotes = useAppSelector((state) => state.host.remotes);
	const currentRoute = location.pathname.split("/")[1];

	// if (!fullAccountsInfo || !currentService) return;
	const currentServiceInfo =
		currentService === ""
			? undefined
			: remotes?.find((service) => service.name === currentService);

	const token = kc.getUserInfo();

	useEffect(() => {
		const newService = location.pathname.split("/")[1];
		dispatch(changeSidebarVisibility(Boolean(newService)));
		dispatch(changeBurgerVisibility(Boolean(newService)));
	}, [location.pathname]);

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

	if (children) return children;

	if (currentService && token && !isServiceAvailable(currentService, token))
		return <ErrorScreen errorStatus={Errors.NO_ACCESS_ERROR} />;

	return <Outlet />;
};

export default AvailableRoute;
