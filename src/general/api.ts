import type { User } from "@/redux/types";

type ObjectRecord =
  | {
      [key: string]: string;
    }
  | undefined;

type UserInfoParams = {
  token: string;
  user: User;
  baseUrl: string;
};

type RequestParamsType = {
  url: string;
  headers: ObjectRecord;
  method?: "PUT" | "POST" | "GET" | "PATCH" | "DELETE";
  body?: unknown;
  options?: ObjectRecord;
};

export const getInfoForRequest = (): Promise<UserInfoParams> => {
  return new Promise((resolve, reject) => {
    try {
      window.dispatchEvent(
        new CustomEvent("requestInfo", {
          detail: {
            getUserInfo: ({ token, user, baseUrl }: UserInfoParams) =>
              resolve({ token, user, baseUrl }),
          },
        }),
      );
    } catch (e) {
      reject({
        token: "",
        user: {},
        baseUrl: "",
      });
    }
  });
};

const getFullUrl = (initialUrl: string, baseUrl: string) =>
  initialUrl.startsWith("http") ? initialUrl : baseUrl + initialUrl;

const getHeaders = (token: string, user: User, initialHeaders = {}) => ({
  ...initialHeaders,
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "x-auth-group": `${user.account}.${user.role}`,
  "x-icdc-account": user.account,
  "x-icdc-role": user.role,
  "x-icdc-location": user.location,
});

const request = async (config: RequestParamsType) => {
  if (!navigator.onLine)
    throw {
      response: {
        data: "No internet connection",
        statusText: "No internet connection",
      },
    };

  let url = config.url;
  if (config.options)
    url += `?${new URLSearchParams(config.options || {}).toString()}`;
  const response = await fetch(url, {
    ...config,
    body: config.body ? JSON.stringify(config.body) : undefined,
  });
  if (!response.ok) {
    if (!response.body && !response.statusText)
      throw { response: response.status };

    if (!response.body)
      throw {
        response: { statusText: response.statusText },
      };

    if (response.headers.get("Content-Type")?.includes("text/html")) {
      throw { response: { data: response.statusText } };
    }

    const responseError = await response.json();
    throw { response: { data: responseError } };
  }
  if (response.status === 204) return;
  if (
    response.headers.get("Content-Type")?.includes("application/json") &&
    response.body
  ) {
    return await response.json().catch((e) => console.log(e));
  }
  return response;
};

export const fetchData = async (
  initialUrl: string,
  initialHeaders?: ObjectRecord,
  options?: ObjectRecord,
) => {
  const { token, user, baseUrl } = await getInfoForRequest();
  const url = getFullUrl(
    initialUrl.replace("{account}", user.account),
    baseUrl,
  );
  const headers = getHeaders(token, user, initialHeaders);
  return await request({
    url,
    headers,
    options,
  });
};

export const updateData = async (
  initialUrl: string,
  data: unknown,
  initialHeaders = {},
) => {
  const { token, user, baseUrl } = await getInfoForRequest();
  const url = getFullUrl(
    initialUrl.replace("{account}", user.account),
    baseUrl,
  );
  const headers = getHeaders(token, user, initialHeaders);
  return await request({
    url,
    headers,
    method: "PUT",
    body: data,
  });
};

export const patchData = async (
  initialUrl: string,
  data: unknown,
  initialHeaders = {},
) => {
  const { token, user, baseUrl } = await getInfoForRequest();
  const url = getFullUrl(
    initialUrl.replace("{account}", user.account),
    baseUrl,
  );
  const headers = getHeaders(token, user, initialHeaders);
  return await request({
    url,
    headers,
    method: "PATCH",
    body: data,
  });
};

export const createData = async (
  initialUrl: string,
  data: unknown,
  initialHeaders = {},
) => {
  const { token, user, baseUrl } = await getInfoForRequest();
  const url = getFullUrl(
    initialUrl.replace("{account}", user.account),
    baseUrl,
  );
  const headers = getHeaders(token, user, initialHeaders);
  return await request({
    url,
    headers,
    method: "POST",
    body: data,
  });
};

export const deleteData = async (
  initialUrl: string,
  params = {},
  initialHeaders = {},
) => {
  const { token, user, baseUrl } = await getInfoForRequest();
  const url = getFullUrl(
    initialUrl.replace("{account}", user.account),
    baseUrl,
  );
  const headers = getHeaders(token, user, initialHeaders);
  return await request({
    url,
    headers,
    method: "DELETE",
    options: params,
  });
};
