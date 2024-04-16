import axios from "axios";

const API = {
  get(url, headers = {}, params = {}) {
    return axios.get(url, {
      headers,
      params,
    });
  },
  put(url, data = {}, headers = {}) {
    return axios.put(url, data, {
      headers,
    });
  },
  post(url, headers = {}, data = {}) {
    return axios.post(url, data, {
      headers,
    });
  },
  delete(url, headers = {}) {
    return axios.delete(url, {
      headers,
    });
  },
};

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
  "x-auth-group": `${user.account}.${user.role}`,
  "x-icdc-account": user.account,
  "x-icdc-role": user.role,
  "x-icdc-location": user.location,
});

export const fetchData = async (
  initialUrl,
  initialHeaders = {},
  options = {},
) => {
  const { token, user, baseUrl } = await getInfoForRequest();
  const url = getFullUrl(
    initialUrl.replace("{account}", user.account),
    baseUrl,
  );
  const headers = getHeaders(token, user, initialHeaders);
  const response = await API.get(url, headers, options);
  return response.data;
};

export const updateData = async (initialUrl, data, initialHeaders = {}) => {
  const { token, user, baseUrl } = await getInfoForRequest();
  const url = getFullUrl(
    initialUrl.replace("{account}", user.account),
    baseUrl,
  );
  const headers = getHeaders(token, user, initialHeaders);
  const response = await API.put(url, data, headers);
  return response.data;
};

export const createData = async (initialUrl, data, initialHeaders = {}) => {
  const { token, user, baseUrl } = await getInfoForRequest();
  const url = getFullUrl(
    initialUrl.replace("{account}", user.account),
    baseUrl,
  );
  const headers = getHeaders(token, user, initialHeaders);
  const response = await API.post(url, headers, data);
  return response.data;
};

export const deleteData = async (initialUrl, params, initialHeaders = {}) => {
  const { token, user, baseUrl } = await getInfoForRequest();
  const url = getFullUrl(
    initialUrl.replace("{account}", user.account),
    baseUrl,
  );
  const headers = getHeaders(token, user, initialHeaders);
  const response = await API.delete(url, headers, params);
  return response.data;
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
