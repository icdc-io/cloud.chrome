import {
	CHANGE_BURGER_VISIBILITY,
	CHANGE_CURRENT_SERVICE,
	CHANGE_LANG,
	CHANGE_SIDEBAR_VISIBILITY,
	CHANGE_USER_INFO,
	CONTACTS_FETCH,
	FETCH_ACCOUNTS_DATA,
	FETCH_LOCATION_DATA,
	FETCH_SERVICES_STATUSES,
	FETCH_SERVICE_VERSION_DATA,
	FULFILLED,
	PENDING,
	REJECTED,
	// SET_AVAILABLE_SERVICES,
	SET_REMOTES,
	UPDATE_TOKEN_INFO,
	UPDATE_USER,
	defaultLocationData,
} from "@/redux/constants";
import type { CustomStore, HostReducerType } from "@/redux/types";
import { servicesWithCompletedStatus } from "@/shared/constants/servicesWithCompletedStatus";
import { currentLang } from "@/shared/translations/i18n";
import {
	type TypedUseSelectorHook,
	useDispatch,
	useSelector,
} from "react-redux";
import {
	type Dispatch,
	type Middleware,
	applyMiddleware,
	combineReducers,
	compose,
	legacy_createStore as createStore,
} from "redux";
import { logger } from "redux-logger";
import promiseMiddleware, {
	type AsyncAction,
	// type AsyncAction,
	type FluxStandardAction,
} from "redux-promise-middleware";
import { type ThunkDispatch, thunk } from "redux-thunk";
import Immutable from "seamless-immutable";

const initialState: HostReducerType = Immutable({
	user: {
		account: "",
		role: "",
		location: "",
	},
	lang: currentLang(),
	// servicesAvailability: null,
	remotes: null,
	remotesFetchStatus: PENDING,
	fullAccountsInfo: null,
	baseUrls: null,
	uniqueInternalServices: null,
	accountsDataFetchStatus: PENDING,
	username: "",
	email: "",
	serviceVersion: "",
	serviceVersionFetchStatus: PENDING,
	currentService: window.location.pathname.split("/")[1],
	locationData: defaultLocationData,
	userInfo: null,
	accountsDataFetchErrorStatus: 0,
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
		case `${FETCH_LOCATION_DATA}`:
			return state.set("locationData", action.payload);

		case UPDATE_TOKEN_INFO: {
			return state.merge({
				userInfo: action.payload,
			});
		}

		// case `${FETCH_SERVICES_STATUSES}_PENDING`:
		// 	return state.set("servicesWithCompletedStatusFetchStatus", PENDING);
		// case `${FETCH_SERVICES_STATUSES}_REJECTED`:
		// 	return state.set("servicesWithCompletedStatusFetchStatus", REJECTED);
		// case `${FETCH_SERVICES_STATUSES}_FULFILLED`: {
		// 	const servicesWithCompletedStatus = action.payload.data.reduce(
		// 		(acc: Array<string>, curr: any) => {
		// 			if (curr.common_service_status === "Complete")
		// 				acc.push(curr.common_name);
		// 			return acc;
		// 		},
		// 		[],
		// 	);
		// 	return state.merge({
		// 		servicesWithCompletedStatusFetchStatus: FULFILLED,
		// 		servicesWithCompletedStatus: new Set([
		// 			state.servicesWithCompletedStatus,
		// 			...servicesWithCompletedStatus,
		// 		]),
		// 	});
		// }

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
			// form: reduxFormReducer,
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
	const composeEnhancers =
		typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
			? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()
			: compose;

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

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
