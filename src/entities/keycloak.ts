import Keycloak, {
	type KeycloakConfig,
	type KeycloakInitOptions,
} from "keycloak-js";
import { updateTokenInfo } from "@/redux/actions";
import { store } from "@/redux/store";
import type { UserInfo } from "@/types/entities";
export const onLoad = "check-sso";

const keycloakOptions = {
	url: import.meta.env.REACT_APP_KEYCLOAK_URL,
	realm: import.meta.env.REACT_APP_KEYCLOAK_REALM,
	clientId: import.meta.env.REACT_APP_KEYCLOAK_CLIENTID,
	onLoad,
};

const updateToken = (keycloak: Keycloak) => {
	store.dispatch(updateTokenInfo(keycloak.tokenParsed as UserInfo));
};

export const kc = ((options: KeycloakConfig) => {
	const kc = new Keycloak(options);
	let refreshTokenInterval: ReturnType<typeof setInterval>;

	function onGetToken(isSuccess: boolean): boolean | PromiseLike<boolean> {
		if (isSuccess) {
			updateToken(kc);
		}
		return isSuccess;
	}

	function init(options: KeycloakInitOptions) {
		return kc
			.init(options)
			.then(onGetToken)
			.then((isSuccess) => {
				refreshTokenInterval = setInterval(
					() => {
						kc.updateToken(60).then(onGetToken).catch(logout);
					},
					30 * 60 * 1000,
				);
				return isSuccess;
			});
	}

	function logout() {
		return (
			kc
				.logout({
					redirectUri: process.env.REACT_APP_LOGOUT_URL,
				})
				// .then(onGetToken)
				.then((isSuccess) => {
					clearInterval(refreshTokenInterval);
					return isSuccess;
				})
		);
	}

	function login() {
		return kc
			.login({
				redirectUri: window.location.href,
			})
			.then((e) => console.log(e));
		// .then(onGetToken);
	}

	function getToken() {
		return kc.token;
	}

	function getUserInfo() {
		return kc.tokenParsed as UserInfo;
	}

	return {
		init,
		getToken,
		getUserInfo,
		login,
		logout,
	};
})(keycloakOptions);

export const initOptions: KeycloakInitOptions = {
	onLoad,
	// KeycloakResponseType: 'code',
	silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
	checkLoginIframe: false,
	// pkceMethod: 'S256'
};
