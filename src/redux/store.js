import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import { logger } from "redux-logger";
import promiseMiddleware from "redux-promise-middleware";
import { thunk } from "redux-thunk";
import Immutable from "seamless-immutable";

import { currentLang } from "../i18n";
import {
  CHANGE_BURGER_VISIBILITY,
  CHANGE_CURRENT_SERVICE,
  CHANGE_LANG,
  CHANGE_SIDEBAR_VISIBILITY,
  CHANGE_USER_INFO,
  CONTACTS_FETCH,
  FETCH_ACCOUNTS_DATA,
  FETCH_LOCATION_DATA,
  FETCH_SERVICE_VERSION_DATA,
  FULFILLED,
  PENDING,
  REJECTED,
  // SET_AVAILABLE_SERVICES,
  SET_REMOTES,
  UPDATE_TOKEN_INFO,
  UPDATE_USER,
  defaultLocationData,
} from "./constants";

const initialState = Immutable({
  user: {},
  lang: currentLang(),
  // servicesAvailability: null,
  remotes: {},
  remotesFetchStatus: PENDING,
  fullAccountsInfo: {},
  baseUrls: {},
  uniqueInternalServices: {},
  accountsDataFetchStatus: PENDING,
  username: "",
  email: "",
  isSideBarVisible: true,
  isBurgerVisible: true,
  serviceVersion: "",
  serviceVersionFetchStatus: PENDING,
  currentService: window.location.pathname.split("/")[1],
  locationData: defaultLocationData,
  token: "",
  userInfo: null,
  accountsDataFetchErrorStatus: 0,
  contacts: [],
  contactsFetchStatus: "",
});

const hostReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return state.set("user", action.payload);

    case CHANGE_LANG:
      return state.set("lang", action.payload);

    // case SET_AVAILABLE_SERVICES:
    //   return state.set("servicesAvailability", action.payload);

    case CHANGE_SIDEBAR_VISIBILITY:
      return state.set("isSideBarVisible", action.payload);

    case CHANGE_BURGER_VISIBILITY:
      return state.set("isBurgerVisible", action.payload);

    case CHANGE_CURRENT_SERVICE:
      return state.set("currentService", action.payload);

    case CHANGE_USER_INFO:
      return state.set("user", action.payload);

    case `${SET_REMOTES}_PENDING`:
      return state.set("remotesFetchStatus", PENDING);
    case `${SET_REMOTES}_REJECTED`:
      return state.set("remotesFetchStatus", REJECTED);
    case `${SET_REMOTES}_FULFILLED`:
      return state.merge({
        remotesFetchStatus: FULFILLED,
        remotes: action.payload,
      });

    case `${FETCH_ACCOUNTS_DATA}_PENDING`:
      return state.set("accountsDataFetchStatus", PENDING);
    case `${FETCH_ACCOUNTS_DATA}_REJECTED`: {
      const errorStatus = action.payload?.response?.status;
      return state.merge({
        accountsDataFetchStatus: REJECTED,
        accountsDataFetchErrorStatus:
          errorStatus || state.accountsDataFetchErrorStatus,
      });
    }
    case `${FETCH_ACCOUNTS_DATA}_FULFILLED`:
      return state.merge({
        accountsDataFetchStatus: FULFILLED,
        accountsDataFetchErrorStatus: 0,
        ...action.payload,
      });

    case `${FETCH_SERVICE_VERSION_DATA}_PENDING`:
      return state.set("serviceVersionFetchStatus", PENDING);
    case `${FETCH_SERVICE_VERSION_DATA}_REJECTED`:
      return state.set("serviceVersionFetchStatus", REJECTED);
    case `${FETCH_SERVICE_VERSION_DATA}_FULFILLED`:
      return state.merge({
        serviceVersionFetchStatus: FULFILLED,
        serviceVersion: action.payload,
      });

    case `${FETCH_LOCATION_DATA}_REJECTED`:
      return state.set("locationData", defaultLocationData);
    case `${FETCH_LOCATION_DATA}_FULFILLED`:
      return state.set("locationData", action.payload);

    case UPDATE_TOKEN_INFO: {
      return state.merge({
        token: action.payload.token,
        userInfo: action.payload.userInfo,
      });
    }

    case `${CONTACTS_FETCH}_PENDING`:
      return state.set("contactsFetchStatus", "pending");
    case `${CONTACTS_FETCH}_REJECTED`:
      return state.set("contactsFetchStatus", "rejected");
    case `${CONTACTS_FETCH}_FULFILLED`:
      return Immutable.merge(state, {
        contacts: action.payload,
        contactsFetchStatus: "fulfilled",
      });

    default:
      return state;
  }
};

const staticReducers = {
  host: hostReducer,
};

function createReducer(asyncReducers) {
  return combineReducers({
    ...staticReducers,
    // form: reduxFormReducer,
    ...asyncReducers,
  });
}

export default function configureStore() {
  const composeEnhancers =
    typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
      : compose;

  const middlewareList = [promiseMiddleware, thunk];

  if (process.env.NODE_ENV === "development") {
    middlewareList.push(logger);
  }

  const enhancer = composeEnhancers(applyMiddleware(...middlewareList));

  const store = createStore(createReducer(), enhancer);

  store.asyncReducers = {};

  store.injectReducer = (key, asyncReducer) => {
    store.asyncReducers[key] = asyncReducer;
    store.replaceReducer(createReducer(store.asyncReducers));
  };

  return store;
}

export const store = configureStore();
