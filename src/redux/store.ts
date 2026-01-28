import {
	applyMiddleware,
	combineReducers,
	compose,
	legacy_createStore as createStore,
	type Dispatch,
	type Middleware,
} from "redux";
import { logger } from "redux-logger";
import promiseMiddleware, {
	type AsyncAction,
	type FluxStandardAction,
} from "redux-promise-middleware";
import { thunk } from "redux-thunk";
import Immutable from "seamless-immutable";
import {
	CHANGE_CURRENT_SERVICE,
	CHANGE_LANG,
	CHANGE_USER_INFO,
	CONTACTS_FETCH,
	defaultLocationData,
	emptyLocationData,
	FETCH_ACCOUNTS_DATA,
	FETCH_LOCATION_DATA,
	FULFILLED,
	PENDING,
	REJECTED,
	SET_REMOTES,
	UPDATE_TOKEN_INFO,
	UPDATE_USER,
} from "../redux/constants";
import type { CustomStore, HostReducerType } from "../redux/types";
import { servicesWithCompletedStatus } from "../shared/constants/servicesWithCompletedStatus";
import { currentLang } from "../shared/translations/i18n";

const initialState: HostReducerType = Immutable({
	user: {
		account: "",
		role: "",
		location: "",
	},
	lang: currentLang(),
	remotes: null,
	remotesFetchStatus: PENDING,
	fullAccountsInfo: null,
	baseUrls: null,
	accountsDataFetchStatus: PENDING,
	username: "",
	email: "",
	currentService: window.location.pathname.split("/")[1],
	locationData: emptyLocationData,
	userInfo: null,
	contacts: null,
	contactsFetchStatus: PENDING,
	servicesWithCompletedStatus: new Set(servicesWithCompletedStatus),
	servicesWithCompletedStatusFetchStatus: PENDING,
});

const hostReducer = (state = initialState, action: FluxStandardAction) => {
	switch (action.type) {
		case UPDATE_USER:
			return state.set("user", action.payload);

		case CHANGE_LANG:
			return state.set("lang", action.payload);

		case CHANGE_CURRENT_SERVICE:
			return state.set("currentService", action.payload);

		case CHANGE_USER_INFO:
			return state.set("user", action.payload);

		case `${SET_REMOTES}_PENDING`:
			return state.set("remotesFetchStatus", PENDING);
		case `${SET_REMOTES}_REJECTED`:
			return state.set("remotesFetchStatus", REJECTED);
		case `${SET_REMOTES}_FULFILLED`: {
			return state.merge({
				remotesFetchStatus: FULFILLED,
				remotes: action.payload,
			});
		}

		case `${FETCH_ACCOUNTS_DATA}_PENDING`:
			return state.set("accountsDataFetchStatus", PENDING);
		case `${FETCH_ACCOUNTS_DATA}_REJECTED`: {
			return state.merge({
				accountsDataFetchStatus: REJECTED,
			});
		}
		case `${FETCH_ACCOUNTS_DATA}_FULFILLED`:
			return state.merge({
				accountsDataFetchStatus: FULFILLED,
				...action.payload,
			});

		case `${FETCH_LOCATION_DATA}_FULFILLED`:
			return state.set("locationData", action.payload);
		case `${FETCH_LOCATION_DATA}_REJECTED`:
			return state.set("locationData", defaultLocationData);

		case UPDATE_TOKEN_INFO: {
			return state.merge({
				userInfo: action.payload,
			});
		}

		case `${CONTACTS_FETCH}_PENDING`:
			return state.set("contactsFetchStatus", "pending");
		case `${CONTACTS_FETCH}_REJECTED`:
			return state.set("contactsFetchStatus", "rejected");
		case `${CONTACTS_FETCH}_FULFILLED`:
			return state.merge({
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

function createReducer(asyncReducers: unknown) {
	if (asyncReducers instanceof Object) {
		return combineReducers({
			...staticReducers,
			...asyncReducers,
		});
	}
	return combineReducers({
		...staticReducers,
	});
}

declare global {
	interface Window {
		__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
	}
}

export default function configureStore() {
	const composeEnhancers = compose;

	const middlewareList = [
		promiseMiddleware as Middleware<
			HostReducerType,
			FluxStandardAction,
			Dispatch<AsyncAction>
		>,
		thunk,
	];

	if (process.env.NODE_ENV === "development") {
		middlewareList.push(logger);
	}

	const enhancer = composeEnhancers(applyMiddleware(...middlewareList));

	const store = createStore(createReducer({}), enhancer) as CustomStore;

	store.asyncReducers = {};
	store.getState();

	store.injectReducer = (key, asyncReducer) => {
		if (store.asyncReducers) {
			store.asyncReducers[key] = asyncReducer;
		}
		store.replaceReducer(createReducer(store.asyncReducers));
	};

	return store;
}

export const store = configureStore();

export type RootState = ReturnType<typeof store.getState>;
