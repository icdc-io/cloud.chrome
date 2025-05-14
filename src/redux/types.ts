import type { Store } from "redux";
import type { ImmutableObject } from "seamless-immutable";
import type Immutable from "seamless-immutable";
import type { DEFAULT_LOCATION_DATA, STATUSES_TYPES } from "../redux/constants";
import type { components as helpdeskComponents } from "../shared/schemas/helpdesk-api";
import type { Langs } from "../shared/translations/langs";
import type {
	BaseUrls,
	FullAccountsInfoType,
	Remote,
	UserInfo,
	UserType,
} from "../types/entities";

export type StoreType = {
	user: UserType;
	lang: Langs;
	remotes: Remote[] | null;
	remotesFetchStatus: STATUSES_TYPES[number];
	fullAccountsInfo: FullAccountsInfoType;
	baseUrls: BaseUrls;
	accountsDataFetchStatus: STATUSES_TYPES[number];
	username: string;
	email: string;
	// serviceVersion: string;
	// serviceVersionFetchStatus: STATUSES_TYPES[number];
	currentService: string | undefined;
	locationData: DEFAULT_LOCATION_DATA;
	userInfo: UserInfo;
	contacts: helpdeskComponents["schemas"]["Contact"][] | null;
	contactsFetchStatus: STATUSES_TYPES[number];
	servicesWithCompletedStatusFetchStatus: string;
	servicesWithCompletedStatus: Set<string>;
};

export type ReducerType<T> = Immutable.ImmutableObject<T>;
export type HostReducerType = ReducerType<StoreType>;

interface Action<T, P> {
	readonly type: T;
	readonly payload?: P;
}

// type AsyncReducerState<P extends Immutable.ImmutableObject<P>> = ReducerType<P> | undefined;

export type CustomStore = Store<
	{ host: HostReducerType },
	Action<string, unknown>,
	unknown
> & {
	dispatch: unknown;
	asyncReducers?: { [key: string]: unknown };
	injectReducer?: <TState, TAction>(
		key: string,
		asyncReducer: (
			state: ImmutableObject<TState> | undefined,
			action: TAction,
		) => ImmutableObject<TState>,
	) => void;
};
