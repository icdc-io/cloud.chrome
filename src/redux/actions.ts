import {
	CHANGE_BURGER_VISIBILITY,
	CHANGE_CURRENT_SERVICE,
	CHANGE_LANG,
	CHANGE_SIDEBAR_VISIBILITY,
	CHANGE_USER_INFO,
	CONTACTS_FETCH,
	CONTACTS_FETCH_URL,
	FETCH_ACCOUNTS_DATA,
	FETCH_LOCATION_DATA,
	FETCH_SERVICES_STATUSES,
	SERVICES_STATUSES_URL,
	SET_REMOTES,
	UPDATE_TOKEN_INFO,
	UPDATE_USER,
} from "../redux/constants";
import { fetchData, fetchJsonData } from "../shared/api/shared";
import type { components } from "../shared/schemas/account-api";
import type { Langs } from "../shared/translations/langs";
import type { BaseUrls, Remote, User, UserInfo } from "../types/entities";

function infernalLiteral<U, T extends U>(arg: T): T {
	return arg;
}

function inferStringLiteral<T extends string>(arg: T): T {
	return infernalLiteral<string, T>(arg);
}

export const updateUser = (newUser: User) =>
	({
		type: inferStringLiteral(UPDATE_USER),
		payload: newUser,
	}) as const;
export const changeLang = (newLang: Langs) =>
	({
		type: inferStringLiteral(CHANGE_LANG),
		payload: newLang,
	}) as const;

const formatRemotes = (remotesPromise: Promise<Remote[]>) => {
	return remotesPromise.then((remotes) => remotes);
};

export const fetchAppsData = () =>
	({
		type: inferStringLiteral(SET_REMOTES),
		payload: formatRemotes(
			fetchJsonData({ url: "/api/delivery/v1/services/apps" }),
		),
	}) as const;

export const fetchServicesStatuses = () =>
	({
		type: inferStringLiteral(FETCH_SERVICES_STATUSES),
		payload: fetchData(SERVICES_STATUSES_URL),
	}) as const;

export const fetchRemotes = () =>
	({
		type: inferStringLiteral(SET_REMOTES),
		payload: fetch("/remotes.json").then((response) => response.json()),
	}) as const;
export const changeSidebarVisibility = (state: boolean) =>
	({
		type: inferStringLiteral(CHANGE_SIDEBAR_VISIBILITY),
		payload: state,
	}) as const;
export const changeBurgerVisibility = (isOpen: boolean) =>
	({
		type: inferStringLiteral(CHANGE_BURGER_VISIBILITY),
		payload: isOpen,
	}) as const;
export const changeCurrentService = (service: string) =>
	({
		type: inferStringLiteral(CHANGE_CURRENT_SERVICE),
		payload: service,
	}) as const;
export const changeUserInfo = (newInfo: User) =>
	({
		type: inferStringLiteral(CHANGE_USER_INFO),
		payload: newInfo,
	}) as const;
export const fetchLocationData = (currentLocation: string) =>
	({
		type: inferStringLiteral(FETCH_LOCATION_DATA),
		payload: fetchData(
			`${import.meta.env.REACT_APP_API_GATEWAY}/api/accounts/v1/locations/${currentLocation}`,
		) as Promise<components["schemas"]["Location"]>,
	}) as const;

export const updateTokenInfo = (tokenInfo: UserInfo) =>
	({
		type: inferStringLiteral(UPDATE_TOKEN_INFO),
		payload: tokenInfo,
	}) as const;

export const fetchContacts = (lang: Langs) => ({
	type: inferStringLiteral(CONTACTS_FETCH),
	payload: fetchData(CONTACTS_FETCH_URL(lang)),
});

export const setRemoteAppInfo = (payload: Remote[]) =>
	({
		type: inferStringLiteral(SET_REMOTES),
		payload: payload,
	}) as const;

export const setUserInfo = (payload: {
	user: User;
	baseUrls: BaseUrls;
	username: string;
	email: string;
}) =>
	({
		type: inferStringLiteral(FETCH_ACCOUNTS_DATA),
		payload,
	}) as const;
