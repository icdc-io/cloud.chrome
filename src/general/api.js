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

const processRequestInfo = (url, initialHeaders) => {
  return new Promise((resolve, reject) => {
    try {
      let getUserInfo = ({ token, user, baseUrl }) => {
        resolve({
          url: url.startsWith("http") ? url : baseUrl + url,
          headers: {
            ...initialHeaders,
            Authorization: `Bearer ${token}`,
            "x-icdc-account": user?.account || "",
            "x-icdc-role": user?.role || "",
            "x-icdc-location": user?.location || "",
          },
        });
      };

      window.dispatchEvent(
        new CustomEvent("requestInfo", {
          detail: {
            getUserInfo,
          },
        }),
      );
      getUserInfo = null;
    } catch (e) {
      reject(e.message);
    }
  });
};

export const fetchData = async (url, headers = {}, options = {}) => {
  const aa = await processRequestInfo(url, headers);
  console.log(aa);
  const response = await API.get(aa.url, aa.headers, options);
  return response.data;
};

export const updateData = async (url, data, headers = {}) => {
  const request = await processRequestInfo(url, headers);
  const response = await API.put(request.url, data, request.headers);
  return response.data;
};

export const createData = async (url, data, headers = {}) => {
  const request = await processRequestInfo(url, headers);
  const response = await API.post(request.url, request.headers, data);
  return response.data;
};

export const deleteData = async (url, params, headers = {}) => {
  const request = await processRequestInfo(url, headers);
  const response = await API.delete(request.url, request.headers, params);
  return response.data;
};

export const exportData = async (initialUrl, initialHeaders = {}, params) => {
  const { url, headers } = await processRequestInfo(initialUrl, initialHeaders);
  const fullUrl = params
    ? url + "?" + new URLSearchParams(params).toString()
    : url;
  return fetch(fullUrl, { headers });
};

export const initGeneralUtils = () => {
  window.chrome = {
    fetchData,
    updateData,
    createData,
    deleteData,
    exportData,
  };
};
