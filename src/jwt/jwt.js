// Imports
import Keycloak from '@redhat-cloud-services/keycloak-js';
import { BroadcastChannel } from 'broadcast-channel';
import cookie from 'js-cookie';
import * as Sentry from '@sentry/browser';
import logger from './logger';

// Insights Specific
import insightsUrl from './insights/url';
import urijs from 'urijs';
import { DEFAULT_ROUTES, options as defaultOptions } from './constants';
import Priv from './Priv';

export const GLOBAL_FILTER_KEY = 'chrome:global-filter';

const log = logger('jwt.js');
const DEFAULT_COOKIE_NAME = 'cs_jwt';

const priv = new Priv();

// Broadcast Channel
const authChannel = new BroadcastChannel('auth');
authChannel.onmessage = (e) => {
  if (e && e.data && e.data.type) {
    log(`BroadcastChannel, Received event : ${e.data.type}`);

    switch (e.data.type) {
      case 'logout':
        return logout();
      case 'login':
        return login();
      case 'refresh':
        return updateToken();
    }
  }
};

export function decodeToken(str) {
  str = str.split('.')[1];
  str = str.replace('/-/g', '+');
  str = str.replace('/_/g', '/');
  switch (str.length % 4) {
    case 0:
      break;
    case 2:
      str += '==';
      break;
    case 3:
      str += '=';
      break;
    default:
      throw 'Invalid token';
  }

  str = (str + '===').slice(0, str.length + (str.length % 4));
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  str = decodeURIComponent(escape(atob(str)));
  str = JSON.parse(str);

  return str;
}

export const doOffline = (key, val) => {
  console.log('doOffline')
  const url = urijs(window.location.href);
  url.removeSearch(key);
  url.addSearch(key, val);

  const options = {
    ...defaultOptions,
    promiseType: 'native',
    redirectUri: url.toString(),
    url: insightsUrl(DEFAULT_ROUTES),
  };

  const kc = Keycloak(options);
  kc.init(options).then(() => {
    console.log('kc.init')
    kc.login({
      scope: 'offline_access',
    });
  });
};

/*** Initialization ***/
export const init = (options) => {
  log('Initializing');
  console.log('init')

  const cookieName = options.cookieName ? options.cookieName : DEFAULT_COOKIE_NAME;

  priv.setCookie({ cookieName });
  //constructor for new Keycloak Object?
  options.url = insightsUrl(options.routes ? options.routes : DEFAULT_ROUTES);
  // Take from constants.js:
  //options.clientId = 'insights';
  //options.realm = 'master';

  //options for keycloak.init method
  options.promiseType = 'native';
  options.onLoad = 'check-sso';
  options.checkLoginIframe = false;

  if (process.env.NODE_ENV === 'production') {
    options.silentCheckSsoRedirectUri = `https://${window.location.host}/cloud/silent-check-sso.html`;
  }

  if (window.localStorage && window.localStorage.getItem('chrome:jwt:shortSession') === 'true') {
    options.realm = 'short-session';
  }

  //priv.keycloak = Keycloak(options);
  console.log('setKeycloak')
  console.log(options)
  console.log('setKeycloak')
  priv.setKeycloak(options, updateToken, loginAllTabs, refreshTokens);

  if (options.token) {
    if (isExistingValid(options.token)) {
      console.log('isExistingValid')

      // we still need to init async
      // so that the renewal times and such fire
      priv.initializeKeycloak(options);
      return new Promise((resolve) => {
        // Here we have an existing key
        // We need to set up some of the keycloak state
        // so that the reset of the methods that Chrome uses
        // to check if things are good get faked out
        // TODO reafctor the direct access to priv.keycloak
        // away from the users
        console.log('options')
        console.log(options)
        console.log('options')
        priv.setToken(options.token);
        resolve();
      });
    } else {
      delete options.token;
    }
  }

  return priv.initialize(options).then(initSuccess).catch(initError);
};

function isExistingValid(token) {
  log('Checking validity of existing JWT');
  try {
    if (!token) {
      return false;
    }

    const parsed = decodeToken(token);
    if (!parsed.exp) {
      return false;
    }

    // Date.now() has extra precision...
    // it includes milis
    // we need to trim it down to valid seconds from epoch
    // because we compare to KC's exp which is seconds from epoch
    const now = Date.now().toString().substr(0, 10);
    const exp = parsed.exp - now;

    log(`Token expires in ${exp}`);

    // We want to invalidate tokens if they are getting close
    // to the expiry time
    // So that we can be someone safe from time skew
    // issues on our APIs
    // i.e. the client could have a slight time skew
    // and the API is true (because NTP) and we could send down
    // a JWT that is actually exipred
    if (exp > 90) {
      priv.setTokenParsed(parsed);
      return true;
    } else {
      if (exp > 0) {
        log('token is expiring in < 90 seconds');
      } else {
        log('token is expired');
      }

      return false;
    }
  } catch (e) {
    log(e);
    return false;
  }
}

// keycloak init successful
function initSuccess() {
  log('JWT Initialized');
  setCookie(priv.getToken());
  setRefresh(priv.getRefershToken());

  window.insights = {
    getToken: () => priv.getToken(),
    getUserInfo: () => priv.getTokenParsed()
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const userInfo = priv.getTokenParsed();
  const { accounts } = userInfo.external;
  const availableLangs = ['en', 'ru'];

  let accountInfo;

  if (!user ||
      !accounts[user.account] ||
      !accounts[user.account].locations.includes(user.location) ||
      !accounts[user.account].roles.includes(user.role)) {

    for (let account in accounts) {
      if (accounts[account].locations.length && accounts[account].roles.length) {
        accountInfo = {
          name: account,
          location: accounts[account].locations[0],
          role: accounts[account].roles[0]
        }
        break;
      }
    }

    if (accountInfo) {
      localStorage.setItem('user', JSON.stringify({
          account: accountInfo.name,
          location: accountInfo.location,
          role: accountInfo.role,
          email: userInfo.email
      }));
    }

    if (!availableLangs.includes(localStorage.getItem('icdc-lang'))) localStorage.setItem('icdc-lang', 'en');
  }
}

// keycloak init failed
function initError() {
  log('JWT init error');
  logout();
}

/*** Login/Logout ***/
export function login() {
  log('Logging in');
  console.log('login')
  // Redirect to login
  cookie.set('cs_loggedOut', 'false');
  return priv.login({ redirectUri: window.location.href });
}

export function logout(bounce, redirectUrl) {
  log('Logging out');

  // Clear cookies and tokens
  priv.clearToken();
  cookie.remove(priv.getCookie().cookieName);
  cookie.remove('cs_demo');

  localStorage.removeItem('user')
  // Redirect to logout
  if (bounce) {
    let eightSeconds = new Date(new Date().getTime() + 8 * 1000);
    cookie.set('cs_loggedOut', 'true', {
      expires: eightSeconds,
    });
    const logoutParams = {
      post_logout_redirect_uri: redirectUrl || process.env.LOGOUT_URL || `https://ibacloud.by`,
      id_token_hint: priv._tokenId
    };
    console.log('logoutParams')
    console.log(logoutParams)
    console.log(priv)
    console.log(priv._tokenId)
    console.log('logoutParams')
    priv.logout(logoutParams);
  }
}

export const logoutAllTabs = (bounce) => {
  authChannel.postMessage({ type: 'logout' });
  logout(bounce);
};

function loginAllTabs(data) {
  console.log('loginAllTabs')
  console.log(data)
  console.log(priv)
  console.log('loginAllTabs')
  priv.setTokenId(priv._keycloak.idToken);

  authChannel.postMessage({ type: 'login' });
}

/*** User Functions ***/
// Get user information
export const getUserInfo = () => {
  log('Getting User Information');
  const jwtCookie = cookie.get(DEFAULT_COOKIE_NAME);
  if (jwtCookie && isExistingValid(jwtCookie) && isExistingValid(priv.getToken())) {
    return priv.getTokenParsed();
  }
  console.log('getUserInfo')

  return updateToken()
    .then(() => {
      log('Successfully updated token');
      return priv.getTokenParsed();
    })
    .catch(() => {
        log('Trying to log in user to refresh token');
        return login();
    });
};

// Check to see if the user is loaded, this is what API calls should wait on
export const isAuthenticated = () => {
  log(`User Ready: ${priv.getAuthenticated()}`);
  return priv.getAuthenticated();
};

/*** Check Token Status ***/
// If a token is expired, logout of all tabs
export const expiredToken = () => {
  log('Token has expired, trying to log out');
  logout();
};

// Broadcast message to refresh tokens across tabs
function refreshTokens() {
  setCookie(priv.getToken());
  authChannel.postMessage({ type: 'refresh' });
}

// Actually update the token
function updateToken() {
  console.log('updateToken')
  return priv
    .updateToken()
    .then((refreshed) => {
      // Important! after we update the token
      // we have to again populate the Cookie!
      // Otherwise we just update and dont send
      // the updated token down stream... and things 401
      setCookie(priv.getToken());

      log('Attempting to update token');

      if (refreshed) {
        log('Token was successfully refreshed');
      } else {
        log('Token is still valid, not updating');
      }
    })
    .catch((err) => {
      log(err);
      Sentry.captureException(err);
      log('Token updated failed, trying to reauth');
      login();
    });
}

function getCookieExpires(exp) {
  // we want the cookie to expire at the same time as the JWT session
  // so we take the exp and get a new GTMString from that
  const date = new Date(0);
  date.setUTCSeconds(exp);
  return date.toGMTString();
}

// Set the cookie for 3scale
function setCookie(token) {
  log('Setting the cs_jwt cookie');
  if (token && token.length > 10) {
    setCookieWrapper(`${priv.getCookie().cookieName}=${token};` + `path=/;` + `secure=true;` + `expires=${getCookieExpires(decodeToken(token).exp)}`);
  }
}

function setRefresh(refreshToken) {
  log('Setting the refresh token');
  cookie.set('cs_jwt_refresh', refreshToken, { secure: true });
}

// do this so we can mock out for test
function setCookieWrapper(str) {
  document.cookie = str;
}

// Encoded WIP
export const getEncodedToken = () => {
  log('Trying to get the encoded token');

  if (!isExistingValid(priv.getToken())) {
    log('Failed to get encoded token, trying to update');
    updateToken();
  }

  return priv.getToken();
};

// Keycloak server URL
export const getUrl = () => {
  return insightsUrl(DEFAULT_ROUTES);
};
