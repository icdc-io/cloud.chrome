import type { Langs } from "@/shared/translations/i18n";
import type { DEFAULT_LOCATION_DATA, STATUSES_TYPES } from "@/redux/constants";
import type Immutable from "seamless-immutable";
import type { Store } from "redux";
import type { components as helpdeskComponents } from "@/shared/schemas/helpdesk-api";
import type { FluxStandardAction } from "redux-promise-middleware";
import type { ImmutableObject, ImmutableObjectMixin } from "seamless-immutable";
import type {
  BaseUrls,
  FullAccountsInfoType,
  Remotes,
  Service,
  UniqueInternalServicesType,
  UserInfo,
  UserType,
} from "@/types/entities";

export type StoreType = {
  user: UserType;
  lang: Langs;
  remotes: Remotes;
  remotesFetchStatus: STATUSES_TYPES[number];
  fullAccountsInfo: FullAccountsInfoType;
  baseUrls: BaseUrls;
  uniqueInternalServices: UniqueInternalServicesType;
  accountsDataFetchStatus: STATUSES_TYPES[number];
  username: string;
  email: string;
  isSideBarVisible: boolean;
  isBurgerVisible: boolean;
  serviceVersion: string;
  serviceVersionFetchStatus: STATUSES_TYPES[number];
  currentService: string | undefined;
  locationData: DEFAULT_LOCATION_DATA;
  token: string;
  userInfo: UserInfo;
  accountsDataFetchErrorStatus: number;
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
  injectReducer?: (
    key: string,
    asyncReducer: <T>(
      state: ImmutableObjectMixin<T> | undefined,
      action: FluxStandardAction,
    ) => ImmutableObjectMixin<T>,
  ) => void;
};
