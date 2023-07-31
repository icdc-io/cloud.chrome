const obj = {
  noAuthParam: 'noauth',
  offlineToken: '2402500adeacc30eb5c5a8a5e2e0ec1f',
};

export const ACCOUNT_REQUEST_TIMEOUT = 'chrome:cross-account-requests:request-timeout';
export const CROSS_ACCESS_ACCOUNT_NUMBER = 'cross_access_account_number';
export const ACTIVE_REMOTE_REQUEST = 'chrome/active-remote-request';
export const CP_VENDOR = process.env.CP_VENDOR || 'icdc';

export default Object.freeze(obj);
