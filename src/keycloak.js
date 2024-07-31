import Keycloak from "keycloak-js";
import { store } from "./redux/store";
import { updateTokenInfo } from "./redux/actions";
export const onLoad = "check-sso";

const keycloakOptions = {
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENTID,
  onLoad,
};

export const kc = (function (options) {
  const kc = new Keycloak(options);
  let refreshTokenInterval;

  function onGetToken(isSuccess) {
    if (isSuccess) {
      store.dispatch(
        updateTokenInfo({
          token: kc.token,
          userInfo: kc.tokenParsed,
        }),
      );
    }
    return isSuccess;
  }

  function init(options) {
    return kc
      .init(options)
      .then(onGetToken)
      .then((isSuccess) => {
        refreshTokenInterval = setInterval(
          () => {
            kc.updateToken(60).then(onGetToken).catch(logout);
          },
          30 * 60 * 1000,
        );
        return isSuccess;
      });
  }

  function logout() {
    return kc
      .logout({
        redirectUri: process.env.REACT_APP_LOGOUT_URL,
      })
      .then(onGetToken)
      .then((isSuccess) => {
        clearInterval(refreshTokenInterval);
        return isSuccess;
      });
  }

  function login() {
    return kc
      .login({
        redirectUri: window.location.href,
      })
      .then(onGetToken);
  }

  function getToken() {
    return kc.token;
  }

  function getUserInfo() {
    return kc.tokenParsed;
  }

  return {
    init,
    getToken,
    getUserInfo,
    login,
    logout,
  };
})(keycloakOptions);

export const initOptions = {
  onLoad,
  // KeycloakResponseType: 'code',
  silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
  checkLoginIframe: false,
  // pkceMethod: 'S256'
};
