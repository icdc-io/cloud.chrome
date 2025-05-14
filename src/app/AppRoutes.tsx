import AvailableRoute from "@/app/AvailableRoute";
import { store } from "@/redux/store";
import RemoteComponent from "@/shared/ui/RemoteComponent";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "@/styles/Popup.scss";
import { HOME } from "@/shared/constants/servicesNames";
import Loader from "@/shared/ui/loader";
import "semantic-ui-css/semantic.min.css";
import { useAppSelector } from "@/redux/shared";
import { Errors } from "@/shared/constants/errors";
import ErrorScreen from "@/widgets/Error";

const AppRoutes = () => {
	const remotes = useAppSelector((state) => state.host.remotes);

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
											remoteUrl={window.origin}
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
									process.env.NODE_ENV === "production"
										? window.location.origin
										: "http://localhost:8080"
								}
								remote={HOME}
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
