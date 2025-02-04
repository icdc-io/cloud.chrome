declare global {
	namespace NodeJS {
		interface ProcessEnv {
			REACT_APP_KEYCLOAK_REALM: string;
			REACT_APP_KEYCLOAK_CLIENTID: string;
			REACT_APP_DEFAULT_COOKIE_NAME: string;
			REACT_APP_API_GATEWAY: string;
			REACT_APP_CP_VENDOR: string;
			REACT_APP_LOGOUT_URL: string;
			REACT_APP_KEYCLOAK_URL: string;
			REACT_APP_CENTRAL_LOCATION_URL: string;
			REACT_APP_HOME_REMOTE_APP_URL: string;
		}
	}
}

export {};
