import Keycloak from "keycloak-js";

export const onLoad = "check-sso";

const keycloakOptions = {
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENTID,
  onLoad,
};

export const kc = (function (options) {
  const kc = new Keycloak(options);

  function init(options) {
    return kc.init(options);
  }

  function updateTokenb() {
    kc.token = '1';
  }

  function logout() {
    return kc.logout({
      redirectUri: process.env.REACT_APP_LOGOUT_URL,
    });
  }

  function login() {
    return kc.login({
      redirectUri: window.location.href,
    });
  }

  function updateToken() {
    return kc
      .updateToken()
      .then(() => {
        // Important! after we update the token
        // we have to again populate the Cookie!
        // Otherwise we just update and dont send
        // the updated token down stream... and things 401
        // if (refreshed) {
        //   log('Token was successfully refreshed');
        // } else {
        //   log('Token is still valid, not updating');
        // }
      })
      .catch(() => {
        // log(err);
        // // Sentry.captureException(err);
        // log('Token updated failed, trying to reauth');
        login();
      });
  }

  function isTokenValid() {
    console.log("Checking validity of existing JWT");
    try {
      // console.log(kc.isTokenExpired())
      // console.log(kc.token)
      // console.log(kc.tokenParsed.exp)
      if (kc.isTokenExpired() || !kc.tokenParsed || !kc.tokenParsed.exp) {
        return false;
      }

      // Date.now() has extra precision...
      // it includes milis
      // we need to trim it down to valid seconds from epoch
      // because we compare to KC's exp which is seconds from epoch
      const now = Date.now().toString().substr(0, 10);
      const exp = kc.tokenParsed.exp - now;

      console.log(`Token expires in ${exp}`);

      // We want to invalidate tokens if they are getting close
      // to the expiry time
      // So that we can be someone safe from time skew
      // issues on our APIs
      // i.e. the client could have a slight time skew
      // and the API is true (because NTP) and we could send down
      // a JWT that is actually exipred
      if (exp > 90) return true;

      if (exp > 0) {
        kc.updateToken();
        return true;
      }

      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  function getToken() {
    if (isTokenValid()) {
      return kc.token;
    }

    // kc.logout();
    return "";
  }

  function getUserInfo() {
    console.log(kc.isTokenExpired);
    console.log(updateToken());
    console.log(isTokenValid());
    if (isTokenValid()) {
      return kc.tokenParsed;
    }

    // return logout();
  }

  function returnKc() {
    return kc;
  }

  return {
    init,
    returnKc,
    getToken,
    getUserInfo,
    login,
    logout,
    updateTokenb
  };
})(keycloakOptions);

export const initOptions = {
  onLoad,
  // KeycloakResponseType: 'code',
  silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
  checkLoginIframe: false,
  // pkceMethod: 'S256'
};
