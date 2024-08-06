import { fetchData } from "../general/api";
import { kc } from "../keycloak";
import { availableRoles } from "../utils/roleUtils";
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
  FETCH_SERVICE_VERSION_DATA,
  // SET_AVAILABLE_SERVICES,
  SET_REMOTES,
  UPDATE_TOKEN_INFO,
  UPDATE_USER,
} from "./constants";

const parseAccountsData = async (accountsDataPromise) => {
  const accountsData = await accountsDataPromise;
  if (!accountsData) return {};

  const parsedToken = kc.getUserInfo();

  if (!parsedToken) return {};

  const { accounts, locations } = parsedToken.external;

  const filteredAccounts = accountsData.filter(
    //filter accounts that contain at least 1 role and 1 location
    (account) =>
      accounts[account.name] &&
      accounts[account.name].roles.length &&
      accounts[account.name].locations.length,
  );

  if (!filteredAccounts.length) return {};

  const userInfo = JSON.parse(localStorage.getItem("user"));
  const isUserInfoInvalid = !userInfo || typeof userInfo !== "object";

  const user = {
    //initial object user that will contain data about current account, role, location
    account:
      isUserInfoInvalid || !accounts[userInfo.account]
        ? filteredAccounts[0].name
        : userInfo.account,
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

  const uniqueInternalServices = {};

  const fullAccountsInfo = filteredAccounts.reduce(
    (allAccountsData, currentAccountData) => {
      allAccountsData[currentAccountData.name] = {
        ...accounts[currentAccountData.name],
        display_name: currentAccountData.display_name,
        name: currentAccountData.name,
        servicesInLocations: currentAccountData.locations.reduce(
          (allLocationsData, currentLocationData) => {
            allLocationsData[currentLocationData.name] =
              currentLocationData.services.reduce(
                (allServicesData, currentServiceData) => {
                  if (currentServiceData.path) {
                    allServicesData[currentServiceData.path.split("/")[1]] =
                      currentServiceData;
                    uniqueInternalServices[currentServiceData.path] =
                      currentServiceData.name;
                  } else {
                    allServicesData[currentServiceData.name] =
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

export const updateUser = (newUser) => ({
  type: UPDATE_USER,
  payload: newUser,
});
export const changeLang = (newLang) => ({
  type: CHANGE_LANG,
  payload: newLang,
});
// export const setInfo = (info) => ({
//   type: SET_AVAILABLE_SERVICES,
//   payload: info,
// });
export const fetchAccountsData = () => ({
  type: FETCH_ACCOUNTS_DATA,
  payload: parseAccountsData(
    fetchData(
      `${process.env.REACT_APP_API_GATEWAY}/api/accounts/v1/accounts`,
      {},
      {},
    ),
  ),
});
export const fetchRemotes = () => ({
  type: SET_REMOTES,
  payload: fetch("/remotes.json").then((response) => response.json()),
});
export const changeSidebarVisibility = (state) => ({
  type: CHANGE_SIDEBAR_VISIBILITY,
  payload: state,
});
export const changeBurgerVisibility = (isOpen) => ({
  type: CHANGE_BURGER_VISIBILITY,
  payload: isOpen,
});
export const fetchServiceVersion = () => ({
  type: FETCH_SERVICE_VERSION_DATA,
  payload: fetch("/api/delivery/v1/service/networking/install").then(
    () => "3.0.2",
  ),
});
export const changeCurrentService = (service) => ({
  type: CHANGE_CURRENT_SERVICE,
  payload: service,
});
export const changeUserInfo = (newInfo) => ({
  type: CHANGE_USER_INFO,
  payload: newInfo,
});
export const fetchRemotesApps = () => {
  return fetchData(
    "https://api.dcz.lab.icdc.io/api/delivery/v1/service/networking/version",
  );
};
export const fetchLocationData = (currentLocation) => ({
  type: FETCH_LOCATION_DATA,
  payload: fetchData(
    `${process.env.REACT_APP_API_GATEWAY}/api/accounts/v1/locations/${currentLocation}`,
  ),
});
export const updateTokenInfo = (tokenInfo) => ({
  type: UPDATE_TOKEN_INFO,
  payload: tokenInfo,
});
export const fetchContacts = (lang) => ({
  type: CONTACTS_FETCH,
  payload: fetchData(CONTACTS_FETCH_URL(lang)),
});
