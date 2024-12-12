import type { Langs } from "@/i18n";
import type { DEFAULT_LOCATION_DATA, STATUSES_TYPES } from "./constants";
import type { KeycloakTokenParsed } from "keycloak-js";
import type { components } from "@/schemas/account-api";
import type Immutable from "seamless-immutable";
import type { Store } from "redux";
import type { components as helpdeskComponents } from "@/schemas/helpdesk-api";
import type { FluxStandardAction } from "redux-promise-middleware";
import type { ImmutableObject, ImmutableObjectMixin } from "seamless-immutable";

export type User = {
  account: string;
  role: string;
  location: string;
};

type UserType = User;

export type RemoteApp = {
  name: string;
  route: string;
  url: string;
};

type RemoteApps = {
  [key: string]: RemoteApp[];
};

type Remotes = {
  [key: string]: RemoteApps;
} | null;

type BaseUrls = {
  [key: string]: string;
} | null;

type ExternalAccountInfo = {
  locations: string[];
  roles: string[];
};

type ExternalAccounts = {
  [key: string]: ExternalAccountInfo;
};

type ExternalLocation = {
  [key: string]: string;
};

export type External = {
  accounts: ExternalAccounts;
  locations: ExternalLocation;
};

export type UserInfo =
  | ({
      "allowed-origins": string[];
      email: string;
      email_verified: boolean;
      external: External;
      family_name: string;
      given_name: string;
      groups: string[];
      jti: string;
      name: string;
      preferred_username: string;
      scope: string;
      sid: string;
      typ: string;
      user_id: string;
    } & KeycloakTokenParsed)
  | null;

export type Service = components["schemas"]["Service"];

export type ServiceInLocation = {
  [key: string]: Service;
};

export type ServicesInLocations = {
  [key: string]: ServiceInLocation | undefined;
};

export type FullAccountInfo = {
  display_name: string | undefined;
  name: string;
  locations: string[];
  roles: string[];
  servicesInLocations: ServicesInLocations | undefined;
} | null;

export type FullAccountsInfo = {
  [key: string]: FullAccountInfo;
};
export type FullAccountsInfoType = FullAccountsInfo | null;

export type UniqueInternalServices = {
  [key: string]: string | undefined;
};

type UniqueInternalServicesType = UniqueInternalServices | null;

export type UpdateTokenInfoPayload = {
  token: string | undefined;
  userInfo: KeycloakTokenParsed | undefined;
};

type StoreType = {
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
