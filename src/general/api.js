import axios from "axios";
import { kc } from "../keycloak";

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

const getLocationApiUrl = (location) => {
  const data = kc.getUserInfo();
  return data.external.locations[location];
};

const processRequest = (url, initialHeaders) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const headers = {
    ...initialHeaders,
    Authorization: `Bearer ${kc.getToken()}`,
    "x-icdc-account": user?.account || "",
    "x-icdc-role": user?.role || "",
    "x-icdc-location": user?.location || "",
  };

  return {
    url: url.startsWith("http") ? url : getLocationApiUrl(user.location) + url,
    headers,
  };
};

// const handleUrl = (url) => url.startsWith('http') ? url : getLocationApiUrl(user.location) + url;

export const fetchData = async (url, headers = {}, options = {}) => {
  const request = await processRequest(url, headers);
  const response = await API.get(request.url, request.headers, options);
  return response.data;
};

export const updateData = async (url, data, headers = {}) => {
  const request = await processRequest(url, headers);
  const response = await API.put(request.url, data, request.headers);
  return response.data;
};

export const createData = async (url, data, headers = {}) => {
  const request = await processRequest(url, headers);
  const response = await API.post(request.url, request.headers, data);
  return response.data;
};

export const deleteData = async (url, params, headers = {}) => {
  const request = await processRequest(url, headers);
  const response = await API.delete(request.url, request.headers, params);
  return response.data;
};

export const exportData = async (initialUrl, initialHeaders = {}, params) => {
  const { url, headers } = await processRequest(initialUrl, initialHeaders);
  const fullUrl = params
    ? url + "?" + new URLSearchParams(params).toString()
    : url;
  return fetch(fullUrl, { headers });
};

// const useRequest = () => {
//   const [error, setError] = useState(null);
//   const [status, setStatus] = useState(STATUSES.IDLE);
//   const token = useAuthStore((state) => state.token);

//   const requestHandler = useCallback(
//     async (configData, onSuccess, onError) => {
//       setStatus(STATUSES.PENDING);
//       setError(null);

//       try {
//         const headers = new Headers();
//         headers.append('Content-Type', 'application/json');

//         if (configData.headers) {
//           Object.entries(configData.headers).forEach((header) => {
//             headers.append(header[0], header[1]);
//           });
//         }
//         if (!configData.unprotected) {
//           headers.append('Access-Control-Request-Headers', 'authorization');
//           headers.append('Authorization', `Bearer ${token}`);
//         }

//         const url = configData.url.includes('http') ? configData.url : BASE_URL + configData.url;

//         const request = fetch(url, {
//           method: configData.method || 'GET',
//           body: configData.body ? JSON.stringify(configData.body) : null,
//           headers,
//           credentials: 'include'
//         });

//         const response = await request;

//         if (!response.ok) {
//           throw new Error(response.statusText || 'Something went Wrong', {
//             cause: response.status
//           });
//         }

//         const result = await response.json();
//         setStatus(STATUSES.SUCCESS);
//         onSuccess(result);
//       } catch (e) {
//         const errorInfo = {
//           message: e.message,
//           status: e.cause || Number(navigator.onLine)
//         };
//         setStatus(STATUSES.ERROR);
//         setError(errorInfo);
//         onError && onError(errorInfo);
//       }
//     },
//     [token]
//   );

//   return [requestHandler, status, error];
// };

// export default useRequest;
export const initGeneralUtils = () => {
  window.chrome = {
    fetchData,
    updateData,
    createData,
    deleteData,
    exportData
  };
};
