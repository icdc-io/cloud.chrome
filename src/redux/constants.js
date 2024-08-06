export const PENDING = "pending";
export const REJECTED = "rejected";
export const FULFILLED = "fulfilled";
export const UPDATE_USER = "UPDATE_USER";
export const CHANGE_LANG = "CHANGE_LANG";
// export const SET_AVAILABLE_SERVICES = "SET_AVAILABLE_SERVICES";
export const SET_REMOTES = "SET_REMOTES";
export const FETCH_ACCOUNTS_DATA = "FETCH_ACCOUNTS_DATA";
export const CHANGE_SIDEBAR_VISIBILITY = "CHANGE_SIDEBAR_VISIBILITY";
export const CHANGE_BURGER_VISIBILITY = "CHANGE_BURGER_VISIBILITY";
export const FETCH_SERVICE_VERSION_DATA = "FETCH_SERVICE_VERSION_DATA";
export const CHANGE_CURRENT_SERVICE = "CHANGE_CURRENT_SERVICE";
export const CHANGE_USER_INFO = "CHANGE_USER_INFO";
export const FETCH_LOCATION_DATA = "FETCH_LOCATION_DATA";
export const UPDATE_TOKEN_INFO = "UPDATE_TOKEN_INFO";
export const CONTACTS_FETCH = "CONTACTS_FETCH";
export const CONTACTS_FETCH_URL = (lang) =>
  `/api/helpdesk/v1/contacts?lang=${lang}`;

export const defaultLocationData = {
  footer_message: "IBA IT Park. All rights reserved.",
  privacy_policy_url: "https://ibacloud.by/privacy-policy-en",
  cookies_policy_url: "https://ibacloud.by/cookies-policy-en",
  status_page_url: "https://status.ibacloud.by",
  back_to_url: "https://ibacloud.by",
};
