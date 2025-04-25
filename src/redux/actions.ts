import type { AsyncAction } from "redux-promise-middleware";
import type { ThunkAction } from "redux-thunk";
import { kc } from "../entities/keycloak";
import {
	CHANGE_BURGER_VISIBILITY,
	CHANGE_CURRENT_SERVICE,
	CHANGE_LANG,
	CHANGE_SIDEBAR_VISIBILITY,
	CHANGE_USER_INFO,
	// CONTACTS_FETCH,
	// CONTACTS_FETCH_URL,
	FETCH_ACCOUNTS_DATA,
	FETCH_APPS_DATA,
	FETCH_LOCATION_DATA,
	FETCH_SERVICE_VERSION_DATA,
	// SET_AVAILABLE_SERVICES,
	SET_REMOTES,
	UPDATE_TOKEN_INFO,
	UPDATE_USER,
} from "../redux/constants";
import {
	CONTACTS_FETCH,
	CONTACTS_FETCH_URL,
	DEFAULT_LOCATION_DATA,
	FETCH_SERVICES_STATUSES,
	SERVICES_STATUSES_URL,
} from "../redux/constants";
import { fetchData, fetchJsonData } from "../shared/api/shared";
import { parseLocalStorage } from "../shared/lib/parseLocalStorage";
import { availableRoles } from "../shared/lib/roleUtils";
import type { components } from "../shared/schemas/account-api";
import type { Langs } from "../shared/translations/langs";
import type {
	External,
	FullAccountsInfo,
	ServiceInLocation,
	ServicesInLocations,
	UniqueInternalServices,
	User,
	UserInfo,
} from "../types/entities";
import type { HostReducerType } from "./types";

function infernalLiteral<U, T extends U>(arg: T): T {
	return arg;
}

function inferStringLiteral<T extends string>(arg: T): T {
	return infernalLiteral<string, T>(arg);
}

const parseAccountsData = async (
	accountsDataPromise: Promise<components["schemas"]["Account_Locations"][]>,
) => {
	const accountsData = await accountsDataPromise;
	if (!accountsData) return {};

	const parsedToken = kc.getUserInfo();

	if (!parsedToken) return {};

	const { accounts, locations } = parsedToken.external as External;

	const filteredAccounts = accountsData
		.map((account) => ({
			...account,
			name: account.name || "",
		}))
		.filter(
			//filter accounts that contain at least 1 role and 1 location
			(account) =>
				accounts[account.name] &&
				accounts[account.name].roles.length &&
				accounts[account.name].locations.length,
		);

	if (!filteredAccounts.length) return {};

	const userInfo = parseLocalStorage("user");

	const isUserInfoInvalid = !userInfo;

	const user: User = {
		//initial object user that will contain data about current account, role, location
		account:
			isUserInfoInvalid || !accounts[userInfo.account]
				? filteredAccounts[0]?.name
				: userInfo.account,
		role: "",
		location: "",
	};

	const currentAccountInfo = accounts[user.account];
	const currentAccountRoles = accounts[user.account].roles.filter((role) =>
		availableRoles.includes(role),
	);

	user.location =
		isUserInfoInvalid ||
		!currentAccountInfo.locations.includes(userInfo.location)
			? currentAccountInfo.locations[0]
			: userInfo.location; //check if location from localStorage is valid, otherwise set first available location
	user.role =
		isUserInfoInvalid || !currentAccountRoles.includes(userInfo.role)
			? currentAccountRoles[0]
			: userInfo.role; //check if role from localStorage is valid, otherwise set first available role

	localStorage.setItem("user", JSON.stringify(user));
	localStorage.setItem("baseUrls", JSON.stringify(locations));

	const uniqueInternalServices: UniqueInternalServices = {};

	const fullAccountsInfo = filteredAccounts.reduce(
		(allAccountsData: FullAccountsInfo, currentAccountData) => {
			allAccountsData[currentAccountData.name] = {
				...accounts[currentAccountData.name],
				display_name: currentAccountData.display_name,
				name: currentAccountData.name,
				servicesInLocations: currentAccountData.locations?.reduce(
					(allLocationsData: ServicesInLocations, currentLocationData) => {
						allLocationsData[currentLocationData.name || ""] =
							currentLocationData.services?.reduce(
								(allServicesData: ServiceInLocation, currentServiceData) => {
									if (currentServiceData.path) {
										allServicesData[currentServiceData.path.split("/")[1]] =
											currentServiceData;
										uniqueInternalServices[currentServiceData.path] =
											currentServiceData.name;
									} else {
										allServicesData[currentServiceData.name || ""] =
											currentServiceData;
									}
									return allServicesData;
								},
								{},
							);
						return allLocationsData;
					},
					{},
				),
			};
			return allAccountsData;
		},
		{},
	);

	return {
		fullAccountsInfo,
		user,
		baseUrls: locations,
		uniqueInternalServices,
		username: `${parsedToken.given_name} ${parsedToken.family_name}`,
		email: parsedToken.email,
	};
};

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
export const fetchAccountsData = () =>
	({
		type: inferStringLiteral(FETCH_ACCOUNTS_DATA),
		payload: parseAccountsData(
			fetchJsonData(
				`${process.env.REACT_APP_API_GATEWAY}/api/accounts/v1/accounts`,
			),
		),
	}) as const;

export const fetchAppsData = () =>
	({
		type: inferStringLiteral(FETCH_APPS_DATA),
		payload: parseAccountsData(fetchJsonData("/api/delivery/v1/services/apps")),
	}) as const;

export const fetchServicesStatuses = () =>
	({
		type: inferStringLiteral(FETCH_SERVICES_STATUSES),
		payload: fetchData(SERVICES_STATUSES_URL),
	}) as const;

export const fetchAccountsAndFetchServicesStatus = (): ThunkAction<
	void,
	HostReducerType,
	unknown,
	AsyncAction
> => {
	return async (dispatch) => {
		try {
			await dispatch(fetchAccountsData());
			dispatch(fetchServicesStatuses());
		} catch (error) {
			console.error(error);
		}
	};
};
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
export const fetchServiceVersion = () =>
	({
		type: inferStringLiteral(FETCH_SERVICE_VERSION_DATA),
		payload: fetchData(
			`${process.env.REACT_APP_CENTRAL_LOCATION_URL}/api/delivery/v1/service/networking/install`,
		).then(() => "3.0.2") as Promise<string>,
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
export const fetchRemotesApps = () =>
	({
		type: inferStringLiteral(SET_REMOTES),
		payload: fetchData(
			`${process.env.REACT_APP_CENTRAL_LOCATION_URL}/api/delivery/v1/service/networking/version`,
		),
	}) as const;
export const fetchLocationData = (currentLocation: string) =>
	({
		type: inferStringLiteral(FETCH_LOCATION_DATA),
		payload: fetchData(
			`${process.env.REACT_APP_API_GATEWAY}/api/accounts/v1/locations/${currentLocation}`,
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
