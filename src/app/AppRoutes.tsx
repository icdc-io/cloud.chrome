import AvailableRoute from "@/app/AvailableRoute";
import { store } from "@/redux/store";
import { builtInServices } from "@/shared/constants/builtInServices";
import RemoteComponent from "@/shared/ui/RemoteComponent";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "@/styles/Popup.scss";
import { HOME } from "@/shared/constants/servicesNames";
import Loader from "@/shared/ui/loader";
import "semantic-ui-css/semantic.min.css";
import { useAppSelector } from "@/redux/shared";

const AppRoutes = () => {
	const fullAccountsInfo = useAppSelector(
		(state) => state.host.fullAccountsInfo,
	);
	const remotes = useAppSelector((state) => state.host.remotes);
	const uniqueInternalServices = useAppSelector(
		(state) => state.host.uniqueInternalServices,
	);
	const location = useAppSelector((state) => state.host.user.location);
	const account = useAppSelector((state) => state.host.user.account);

	const uniqueInternalServicesList = Object.entries(
		uniqueInternalServices || {},
	).filter((serviceInfo) => {
		return remotes?.[location]?.[serviceInfo[0].substring(1)];
	});

	const routes = () => {
		return uniqueInternalServicesList
			.map((serviceInfo) => ({
				name: serviceInfo[0].substring(1),
				isAvailableInLocation: Boolean(
					fullAccountsInfo?.[account]?.servicesInLocations?.[location]?.[
						serviceInfo[0].substring(1)
					],
				),
			}))
			.map((serviceInfo) => {
				if (!remotes) return;
				return serviceInfo.isAvailableInLocation ? (
					<Route
						key={serviceInfo.name}
						path={`${serviceInfo.name}/*`}
						Component={AvailableRoute}
					>
						{remotes[location][serviceInfo.name].map((remoteServiceInfo) => (
							<Route
								key={remoteServiceInfo.name}
								path={`${remoteServiceInfo.route}/*`}
								element={
									<RemoteComponent
										fallback={<Loader />}
										remoteUrl={remoteServiceInfo.url}
										remote={remoteServiceInfo.route}
										service={serviceInfo.name}
										store={store}
									/>
								}
							/>
						))}
						{builtInServices[serviceInfo.name]?.map((builtInServiceInfo) => (
							<Route
								key={builtInServiceInfo.route}
								path={builtInServiceInfo.route}
								Component={builtInServiceInfo.Component}
							/>
						))}
						<Route
							path="*"
							element={
								<Navigate
									to={remotes[location][serviceInfo.name][0].route}
									replace
								/>
							}
						/>
					</Route>
				) : (
					<Route
						key={serviceInfo.name}
						path={serviceInfo.name}
						element={<h1>Not available in this location</h1>}
					/>
				);
			});
	};

	return (
		<React.Suspense fallback={<Loader />}>
			<Routes>
				<Route path="/" Component={AvailableRoute}>
					<Route
						index
						element={
							<RemoteComponent
								fallback={<Loader />}
								remoteUrl={process.env.REACT_APP_HOME_REMOTE_APP_URL} //change remote Home app url for production
								remote={HOME}
								store={store}
							/>
						}
					/>
				</Route>
				{routes()}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
		</React.Suspense>
	);
};

export default AppRoutes;
