import cookie from 'js-cookie';
import flatten from 'lodash/flatten';
import { store } from '../redux/store';
import { updateTokenAction, updateDecodeTokenAction } from '../redux/actions';
import Keycloak from '@redhat-cloud-services/keycloak-js';
import BroadcastChannel from 'broadcast-channel';
import * as Sentry from '@sentry/browser';
const urijs = require('urijs');
const log = require('./logger')('auth.js');
/*eslint-disable*/
export const auth = (function () {
    const consts =  {
        noAuthParam: 'noauth',
        offlineToken: '2402500adeacc30eb5c5a8a5e2e0ec1f',
        allowedUnauthedPaths: ['/', '/logout', '/beta']
    };

    const defaultOptions = {
        realm: 'master',
        clientId: 'insights',
        cookieName: 'cs_jwt'
    };
    
    const TIMER_STR = '[JWT][jwt.js] Auth time';
    
    const priv = {};

    const DEFAULT_COOKIE_NAME = 'cs_jwt';

    let instance;

    const authChannel = new BroadcastChannel('auth');

    function decodeToken (str) {
        console.log('decodeToken')
        str = str.split('.')[1];
        str = str.replace('/-/g', '+');
        str = str.replace('/_/g', '/');
        switch (str.length % 4)
        {
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
    };

    const login = () => {
        log('Logging in');
        cookie.set('cs_loggedOut', 'false');
        return priv.keycloak.login({ redirectUri: window.location.href });
    };

    function logout(bounce) {
        console.log('logout')
        log('Logging out');

        priv.keycloak.clearToken();
        cookie.remove(priv.cookie.cookieName);
        window.localStorage.removeItem('userRole');

        if (bounce) {
            let eightSeconds = new Date(new Date().getTime() + 8 * 1000);
            cookie.set('cs_loggedOut', 'true', {
                expires: eightSeconds
            });
            priv.keycloak.logout({
                redirectUri: 'https://icdc.io'
            });
        }
    };

    function updateToken() {
        console.log('updateToken')
        return priv.keycloak.updateToken().then(refreshed => {
            setCookie(priv.keycloak.token);
            store.dispatch(updateTokenAction(priv.keycloak.token));
            store.dispatch(updateDecodeTokenAction(priv.keycloak.tokenParsed));

            if (refreshed) {
                log('Token was successfully refreshed');
            } else {
                log('Token is still valid');
            }
        });
    };

    authChannel.onmessage = (e) => {
        if (e && e.data && e.data.type) {
            log(`BroadcastChannel, Received event : ${e.data.type}`);

            switch (e.data.type) {
                case 'logout':
                    logout();
                    break;
                case 'login':
                    login();
                    break;
                case 'refresh':
                    updateToken();
                    break;
            }
        }
    };

    const init = (options) => {
        console.log('init')
        log('Initializing');

        const cookieName = ((options.cookieName) ? options.cookieName : DEFAULT_COOKIE_NAME);

        priv.cookie = {
            cookieName
        };

        options.url = 'https://login.icdc.io/auth';
        options.clientId = 'insights';
        options.realm = 'master';

        options.promiseType = 'native';
        options.onLoad = 'check-sso';
        options.checkLoginIframe = false;

        if (window.localStorage && window.localStorage.getItem('chrome:jwt:shortSession') === 'true') {
            options.realm = 'short-session';
        }

        priv.keycloak = Keycloak(options);
        priv.keycloak.onTokenExpired = updateToken;
        priv.keycloak.onAuthSuccess = loginAllTabs;
        priv.keycloak.onAuthRefreshSuccess = refreshTokens;

        if (options.token) {
            if (isExistingValid(options.token)) {
                priv.keycloak.init(options);

                return new Promise((resolve) => {
                    priv.keycloak.authenticated = true;
                    priv.keycloak.token = options.token;
                    store.dispatch(updateTokenAction(priv.keycloak.token));
                    store.dispatch(updateDecodeTokenAction(priv.keycloak.tokenParsed));
                    resolve();
                });
            } else {
                delete options.token;
            }
        }

        return priv.keycloak
        .init(options)
        .then(initSuccess)
        .catch(initError);
    };

    function isExistingValid(token) {
        console.log('isExistingValid')
        log('Checking validity of existing JWT');
        try {
            if (!token) {
                store.dispatch(updateTokenAction(''));
                store.dispatch(updateDecodeTokenAction(null));
                return false;
            }

            const parsed = decodeToken(token);
            if (!parsed.exp) {
                store.dispatch(updateTokenAction(''));
                store.dispatch(updateDecodeTokenAction(null));
                return false;
            }

            const now = Date.now().toString().substr(0, 10);
            const exp = parsed.exp - now;

            log(`expires in ${exp}`);

            if (exp > 50) {
                priv.keycloak.tokenParsed = parsed;
                return true;
            } else {
                log('token expired');
                store.dispatch(updateTokenAction(''));
                store.dispatch(updateDecodeTokenAction(null));
                return false;
            }
        } catch (e) {
            store.dispatch(updateTokenAction(''));
            store.dispatch(updateDecodeTokenAction(null));
            return false;
        }
    };

    function initSuccess() {
        console.log('initSuccess')
        log('JWT Initialized');
        setCookie(priv.keycloak.token);
        localStorage.setItem('userRole', priv.keycloak.realmAccess.roles.find(role => role === 'storage_admin') ? 'admin' : 'member');
        window.localStorage.setItem(priv.cookie.cookieName, priv.keycloak.refreshToken);
        window.localStorage.setItem('loc_map', JSON.stringify(priv.keycloak.tokenParsed.locations));
        window.localStorage.setItem('location', Object.keys(JSON.parse(localStorage.getItem('loc_map')))[0]);
        let newTokens = {};
        for (let obj in priv.keycloak.tokenParsed.external.accounts) {
            if (priv.keycloak.tokenParsed.external.accounts[obj].locations.length && priv.keycloak.tokenParsed.external.accounts[obj].roles.length) {
                newTokens[obj]= priv.keycloak.tokenParsed.external.accounts[obj];
            }
        };
        console.log('vvvvvvvvvvvvvvvvvvvvvvvvvv')
        window.localStorage.setItem('user', Object.keys(newTokens).length ? JSON.stringify({
            account: Object.keys(newTokens)[0],
            location: newTokens[Object.keys(newTokens)[0]].locations[0],
            role: newTokens[Object.keys(newTokens)[0]].roles[0],
            email: priv.keycloak.tokenParsed.email
        }) : null);
        store.dispatch(updateTokenAction(priv.keycloak.token));
        store.dispatch(updateDecodeTokenAction(priv.keycloak.tokenParsed));
    };

    function initError() {
        console.log('initError')
        log('JWT init error');
        logout();
    };

    const logoutAllTabs = (bounce) => {
        console.log('logoutAllTabs')
        authChannel.postMessage({ type: 'logout' });
        logout(bounce);
    };

    function loginAllTabs() {
        console.log('loginAllTabs')
        authChannel.postMessage({ type: 'login' });
    };

    const getUserInfo = () => {
        console.log('getUserInfo')
        log('Getting User Information');
        const jwtCookie = cookie.get(DEFAULT_COOKIE_NAME);

        if (jwtCookie && isExistingValid(jwtCookie) && isExistingValid(priv.keycloak.token)) {
            return priv.keycloak.tokenParsed;
        }

        return updateToken()
        .then(() => {
            return priv.keycloak.tokenParsed;
        })
        .catch(() => {
            return login();
        });
    };

    const isAuthenticated = () => {
        console.log('isAuthenticated')
        log(`User Ready: ${priv.keycloak.authenticated}`);
        return priv.keycloak.authenticated;
    };

    const expiredToken = () => logout();

    function refreshTokens() {
        console.log('refreshTokens')
        authChannel.postMessage({ type: 'refresh' });
    };

    function getCookieExpires(exp) {
        console.log('getCookieExpires')
        const date = new Date(0);
        date.setUTCSeconds(exp);
        return date.toGMTString();
    };

    function setCookie(token) {
        console.log('setCookie')
        if (token && token.length > 10) {
            setCookieWrapper(`${priv.cookie.cookieName}=${token};` +
                            `path=/;` +
                            `secure=true;` +
                            `expires=${getCookieExpires(decodeToken(token).exp)}`);
        }
    };

    function setCookieWrapper(str) {
        document.cookie = str;
    };

    const getEncodedToken = () => {
        console.log('getEncodedToken')
        log('Getting encoded token');

        if (!isExistingValid(priv.keycloak.token)) {
            Sentry.captureException(new Error('Fetching token failed - expired token'));
        }

        return (priv.keycloak.token);
    };

    function wipePostbackParamsThatAreNotForUs() {
        console.log('wipePostbackParamsThatAreNotForUs')
        if (getWindow().location.href.indexOf(consts.offlineToken) !== -1) {
            priv.postbackUrl = getWindow().location.href;

            getWindow().location.hash = '';

            const url = urijs(getWindow().location.href);
            url.removeQuery(consts.noAuthParam);
            getWindow().history.pushState('offlinePostback', '', url.toString());
        }
    };

    function getWindow() {
        return window;
    };

    function bouncer() {
        console.log('bouncer')
        if (allowUnauthed()) { return; }

        if (!isAuthenticated()) {
            cookie.remove(defaultOptions.cookieName);
            store.dispatch(updateTokenAction(''));
            store.dispatch(updateDecodeTokenAction(''));
            login();
        }

        store.dispatch(updateTokenAction(priv.keycloak.token));
        store.dispatch(updateDecodeTokenAction(priv.keycloak.tokenParsed));

        console.timeEnd(TIMER_STR); // eslint-disable-line no-console
    };

    function getAllowedUnauthedPaths() {
        console.log('getAllowedUnauthedPaths')
        return flatten(consts.allowedUnauthedPaths.map(e => ([e, e + '/'])));
    };

    function allowUnauthed() {
        console.log('allowUnauthed')
        if (getAllowedUnauthedPaths().includes(getWindow().location.pathname)) {
            return true;
        }

        return false;
    };

    const createInstance = function () {
        console.log('createInstance')
        let options = {
            ...defaultOptions
        };

        wipePostbackParamsThatAreNotForUs();
        const token = cookie.get(options.cookieName);

        console.log(token)

        if (token && token.length > 10) {
            options.token = token;
            options.refreshToken = getWindow().localStorage.getItem(options.cookieName);
        }

        init(options).then(bouncer).then(() => {
            if (!token) {
                getUserInfo();
                store.dispatch(updateTokenAction(priv.keycloak.token));
                store.dispatch(updateDecodeTokenAction(priv.keycloak.tokenParsed));
            } 
        });

        return {
            expiredToken: expiredToken,
            getEncodedToken: getEncodedToken,
            getUserInfo: getUserInfo,
            isAuthenticated: isAuthenticated,
            login: login,
            logoutAllTabs: logoutAllTabs
        }
    }

    return {
      getInstance: function () {
        return instance || (instance = createInstance());
      }
    };
})();
