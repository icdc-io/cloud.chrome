import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AvailableRoute from "@/app/AvailableRoute";
import { store } from "@/redux/store";
import { Errors } from "@/shared/constants/errors";
import { HOME } from "@/shared/constants/servicesNames";
import Loader from "@/shared/ui/loader";
import RemoteComponent from "@/shared/ui/RemoteComponent";
import type { Remote } from "@/types/entities";
import ErrorScreen from "@/widgets/Error";
import "@/styles/Popup.scss";

const AppRoutes = ({ remotes }: { remotes: Remote[] }) => {
	const routes = () => {
		if (!remotes) return null;
		return remotes
			.filter((serviceInfo) => !!serviceInfo.name && !!serviceInfo.path)
			.map((serviceInfo) => {
				const route = serviceInfo.path.substring(1);
				return (
					<Route
						key={serviceInfo.name}
						path={`${route}/*`}
						Component={AvailableRoute}
					>
						{serviceInfo.apps.map((remoteServiceInfo) => {
							return (
								<Route
									key={remoteServiceInfo.name}
									path={`${remoteServiceInfo.name}/*`}
									element={
										<RemoteComponent
											fallback={<Loader />}
											remoteUrl={
												(import.meta.env.DEV && remoteServiceInfo.url) ||
												window.origin
											}
											remote={remoteServiceInfo.name}
											service={serviceInfo.name}
											version={remoteServiceInfo.version}
											store={store}
										/>
									}
								/>
							);
						})}
						<Route
							path="*"
							element={<Navigate to={serviceInfo.apps[0].name} replace />}
						/>
					</Route>
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
								remoteUrl={
									import.meta.env.PROD
										? window.location.origin
										: "http://localhost:8080"
								}
								remote={HOME.name}
								store={store}
							/>
						}
					/>
				</Route>
				{routes()}
				<Route
					path="*"
					element={
						<AvailableRoute>
							<ErrorScreen errorStatus={Errors.NO_ACCESS_ERROR} />
						</AvailableRoute>
					}
				/>
			</Routes>
		</React.Suspense>
	);
};

export default AppRoutes;
