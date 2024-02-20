import promiseMiddleware from "redux-promise-middleware";
import { compose, createStore, applyMiddleware, combineReducers } from "redux";
import { thunk } from "redux-thunk";
import { logger } from "redux-logger";
import Immutable from "seamless-immutable";
// import { reducer as reduxFormReducer } from "redux-form";
import {
  CHANGE_BURGER_VISIBILITY,
  CHANGE_CURRENT_SERVICE,
  CHANGE_LANG,
  CHANGE_SIDEBAR_VISIBILITY,
  CHANGE_USER_INFO,
  FETCH_ACCOUNTS_DATA,
  FETCH_SERVICE_VERSION_DATA,
  FULFILLED,
  PENDING,
  REJECTED,
  SET_AVAILABLE_SERVICES,
  SET_REMOTES,
  UPDATE_USER,
} from "./constants";
import { currentLang } from "../i18n";

const initialState = Immutable({
  user: {},
  lang: currentLang(),
  servicesAvailability: null,
  remotes: {},
  remotesFetchStatus: PENDING,
  fullAccountsInfo: null,
  baseUrls: {},
  uniqueInternalServices: {},
  accountsDataFetchStatus: PENDING,
  username: "",
  email: "",
  isSideBarVisible: true,
  isBurgerVisible: true,
  serviceVersion: "",
  serviceVersionFetchStatus: PENDING,
  currentService: "",
});

const hostReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return state.set("user", action.payload);

    case CHANGE_LANG:
      return state.set("lang", action.payload);

    case SET_AVAILABLE_SERVICES:
      return state.set("servicesAvailability", action.payload);

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
    case `${FETCH_ACCOUNTS_DATA}_REJECTED`:
      return state.set("accountsDataFetchStatus", REJECTED);
    case `${FETCH_ACCOUNTS_DATA}_FULFILLED`:
      return state.merge({
        accountsDataFetchStatus: FULFILLED,
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
