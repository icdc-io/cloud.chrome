import { initOptions, kc } from "@/entities/keycloak";
import {
	fetchAccountsData,
	fetchRemotes,
	fetchServiceVersion,
} from "@/redux/actions";
import { useAppDispatch, useAppSelector } from "@/redux/shared";
import { useEffect } from "react";

const keycloakRequest = kc.init(initOptions);

const useAuth = () => {
	const dispatch = useAppDispatch();
	const user = useAppSelector((state) => state.host.user);
	const baseUrls = useAppSelector((state) => state.host.baseUrls);

	const initSuccess = async (authSuccess: boolean) => {
		if (!authSuccess) {
			kc.login();
		} else {
			await dispatch(fetchAccountsData());
			dispatch(fetchServiceVersion());
			dispatch(fetchRemotes());
		}
	};

	const initFailed = (e: string) => {
		console.error("Authenticated Failed " + e);
		kc.logout();
	};

	useEffect(() => {
		keycloakRequest.then(initSuccess, initFailed);

		const messageHandler = (event: MessageEvent) => {
			if (event.origin !== window.origin) return;
			if (event.data.action === "getToken") {
				event.source?.postMessage(
					{
						token: kc.getToken(),
						action: "sendToken",
						requestId: event.data.requestId,
					},
					{ targetOrigin: event.origin },
				);
			}
		};

		window.addEventListener("message", messageHandler);

		return () => window.removeEventListener("message", messageHandler);
	}, []);

	useEffect(() => {
		const messageListener = (e: CustomEvent) => {
			e.detail.getUserInfo({
				user: user,
				baseUrl: baseUrls?.[user.location],
			});
		};
		window.addEventListener("requestInfo", messageListener as EventListener);

		return () =>
			window.removeEventListener(
				"requestInfo",
				messageListener as EventListener,
			);
	}, [user]);

	return;
};

export default useAuth;
