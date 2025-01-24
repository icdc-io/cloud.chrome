import type { components } from "@/shared/schemas/account-api";
import type { KeycloakTokenParsed } from "keycloak-js";

export type User = {
	account: string;
	role: string;
	location: string;
};

export type List = {
	[key: string]: string;
};

export type UserType = User;

export type UserInfo =
	| ({
			"allowed-origins": string[];
			email: string;
			email_verified: boolean;
			external: External;
			family_name: string;
			given_name: string;
			groups: string[];
			jti: string;
			name: string;
			preferred_username: string;
			scope: string;
			sid: string;
			typ: string;
			user_id: string;
	  } & KeycloakTokenParsed)
	| null;

export type UpdateTokenInfoPayload = {
	token: string | undefined;
	userInfo: KeycloakTokenParsed | undefined;
};

export type RemoteApp = {
	name: string;
	route: string;
	url: string;
};

type RemoteApps = {
	[key: string]: RemoteApp[];
};

export type Remotes = {
	[key: string]: RemoteApps;
} | null;

export type Service = components["schemas"]["Service"];

export type BaseUrls = {
	[key: string]: string;
} | null;

type ExternalAccountInfo = {
	locations: string[];
	roles: string[];
};

type ExternalAccounts = {
	[key: string]: ExternalAccountInfo;
};

type ExternalLocation = {
	[key: string]: string;
};

export type External = {
	accounts: ExternalAccounts;
	locations: ExternalLocation;
};

export type ServiceInLocation = {
	[key: string]: Service;
};

export type ServicesInLocations = {
	[key: string]: ServiceInLocation | undefined;
};

export type FullAccountInfo = {
	display_name: string | undefined;
	name: string;
	locations: string[];
	roles: string[];
	servicesInLocations: ServicesInLocations | undefined;
} | null;

export type FullAccountsInfo = {
	[key: string]: FullAccountInfo;
};
export type FullAccountsInfoType = FullAccountsInfo | null;

export type UniqueInternalServices = {
	[key: string]: string | undefined;
};

export type UniqueInternalServicesType = UniqueInternalServices | null;
