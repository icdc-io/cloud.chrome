import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AvailableRoute from "@/app/AvailableRoute";
import { store } from "@/redux/store";
import { Errors } from "@/shared/constants/errors";
import { homepage } from "@/shared/constants/servicesNames";
import Loader from "@/shared/ui/loader";
import RemoteComponent from "@/shared/ui/RemoteComponent";
import type { Remote } from "@/types/entities";
import ErrorScreen from "@/widgets/Error";
import "@/styles/Popup.scss";
import {
	CORE_NAMESPACE,
	filterNonCoreRemotes,
} from "@/shared/lib/src/shared/lib/filterNonCoreRemotes";

const AppRoutes = ({ remotes }: { remotes: Remote[] }) => {
	const routes = () => {
		if (!remotes) return null;
		return remotes
			.filter(
				(serviceInfo) =>
					!!serviceInfo.name &&
					!!serviceInfo.path &&
					filterNonCoreRemotes(serviceInfo),
			)

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

	const homeRemote = remotes
		.find((r) => r.name === CORE_NAMESPACE)
		?.apps.find((app) => app.name === homepage.value);

	return (
		<React.Suspense fallback={<Loader />}>
			<Routes>
				{homeRemote && (
					<Route path="/" Component={AvailableRoute}>
						<Route
							index
							element={
								<RemoteComponent
									fallback={<Loader />}
									remoteUrl={
										(import.meta.env.DEV && homeRemote.url) || window.origin
									}
									remote={homeRemote.name}
									service={CORE_NAMESPACE}
									version={homeRemote.version}
									store={store}
								/>
							}
						/>
					</Route>
				)}
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
