import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AvailableRoute from "@/app/AvailableRoute";
import { useAppSelector } from "@/redux/shared";
import { store } from "@/redux/store";
import { Errors } from "@/shared/constants/errors";
import { HOME } from "@/shared/constants/servicesNames";
import Loader from "@/shared/ui/loader";
import RemoteComponent from "@/shared/ui/RemoteComponent";
import ErrorScreen from "@/widgets/Error";
import "@/styles/Popup.scss";

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
						{serviceInfo.apps.map((remoteAppInfo) => {
							return (
								<Route
									key={remoteAppInfo.name}
									path={`${remoteAppInfo.name}/*`}
									element={
										<RemoteComponent
											fallback={<Loader />}
											remoteUrl={remoteAppInfo.url || window.origin}
											remote={remoteAppInfo.name}
											service={serviceInfo.name}
											version={remoteAppInfo.version}
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
								remoteUrl={HOME.url}
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
