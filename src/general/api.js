// import axios from "axios";

// const API = {
//   get(url, headers = {}, params = {}) {
//     return axios.get(url, {
//       headers,
//       params,
//     });
//   },
//   patch(url, data = {}, headers = {}) {
//     return axios.patch(url, data, {
//       headers,
//     });
//   },
//   put(url, data = {}, headers = {}) {
//     return axios.put(url, data, {
//       headers,
//     });
//   },
//   post(url, headers = {}, data = {}) {
//     return axios.post(url, data, {
//       headers,
//     });
//   },
//   delete(url, headers = {}) {
//     return axios.delete(url, {
//       headers,
//     });
//   },
// };

export const getInfoForRequest = () => {
  return new Promise((resolve, reject) => {
    try {
      window.dispatchEvent(
        new CustomEvent("requestInfo", {
          detail: {
            getUserInfo: ({ token, user, baseUrl }) =>
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

const getFullUrl = (initialUrl, baseUrl) =>
  initialUrl.startsWith("http") ? initialUrl : baseUrl + initialUrl;

const getHeaders = (token, user, initialHeaders) => ({
  ...initialHeaders,
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
  "x-auth-group": `${user.account}.${user.role}`,
  "x-icdc-account": user.account,
  "x-icdc-role": user.role,
  "x-icdc-location": user.location,
});

const request = async (config) => {
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

    const responseError = await response.json();
    throw { response: { data: responseError } };
  }
  if (response.status === 204) return;
  if (response.headers.get("Content-Type").includes("application/json"))
    return await response.json();
  return response;
};

export const fetchData = async (initialUrl, initialHeaders = {}, options) => {
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

export const updateData = async (initialUrl, data, initialHeaders = {}) => {
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

export const patchData = async (initialUrl, data, initialHeaders = {}) => {
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

export const createData = async (initialUrl, data, initialHeaders = {}) => {
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

export const deleteData = async (initialUrl, params, initialHeaders = {}) => {
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
  });
};

export const exportData = async (initialUrl, initialHeaders = {}, params) => {
  const { token, user } = await getInfoForRequest();
  const headers = getHeaders(token, user, initialHeaders);
  const fullUrl = params
    ? initialUrl + "?" + new URLSearchParams(params).toString()
    : initialUrl;
  return fetch(fullUrl, { headers });
};
// {
//   "route": "instances",
//   "name": "Instances",
//   "url": "http://localhost:8004"
// },
