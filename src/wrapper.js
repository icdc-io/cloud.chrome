import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './RenderSidebar';
import Header from './Header';
import './wrapper.scss';
import PropTypes from 'prop-types';
import auth from './auth';
import { errorTranslations, langs, servicesImages } from './constants/viewConstants';
import { CP_VENDOR } from './constants/consts';
import {filterAndSort} from './utils/roleUtils';
// import Skeleton from './Skeleton';
// import Keycloak from 'keycloak-js';

const libjwt = auth();

// const initOptions = {
//     url: 'https://login.scdc.io/auth',
//     realm: 'master',
//     clientId: 'insights'
// };

const Wrapper = ({
  id,
  changeAccounts,
  changeUser,
  getAppInfo = null,
  setBaseUrls = null,
  getServicesInfo,
  language,
  routes = [],
  children,
  changeApp = () => {},
  openHelpdesk = false,
  changeLang,
  getPublicLocationData,
  getCpVendor
}) => {
    const initialUser = {
        location: '',
        account: '',
        role: ''
    };
    const apiUrl = process.env.API_GATEWAY ? `${process.env.API_GATEWAY}/api` : 'https://api-gw.icdc.d3.zby.icdc.io/api';

    const [user, setUser] = useState(initialUser);
    const [availableAccounts, setAvailableAccounts] = useState({});
    const [isSideBarVisible, setIsSideBarVisible] = useState(true);
    const [accountsDropdown, setAccountsDropdown] = useState([]);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const [serviceAvailability, setServiceAvailability] = useState({});
    const [servicesInLocations, setServicesInLocations] = useState({});
    const [isError, setIsError] = useState('');

    const [currentService, setCurrentService] = useState({});
    const [locale, setLocale] = useState(language);
    const [locationPublicData, setLocationPublicData] = useState({});

    const isNoAccess = {
        admin: (groups) => !groups.some(group => /.cloud$/.test(group)),
        devops: (groups) => /*['member'].some(role => tokenData.external.accounts[user.account].roles.indexOf(role) !== -1)*/false
    };

    const checkError = (available) => available || id === 'home' ? '' : 'notAvailable';

    useEffect(async() => {
        getCpVendor && getCpVendor(CP_VENDOR);
        getAppInfo && getAppInfo({
            amazon: true,
            iscsi: true,
            projects: true,
            balancer: true,
            vpc: true,
            firewall: true,
            dns: true,
            vpn: true,
            quotas: true,
            info: true,
            users: true,
            reports: true,
            billing: true,
            general: true,
            accounts: true,
            clusters: true,
            quotas: true,
            payment: true,
            invoices: true,
            delivery: true
        });
        // let keycloak = new Keycloak(initOptions);
        // keycloak.init({ onLoad: 'check-sso' }).then(auth => console.log(auth)).catch(e => console.log(e))
        try {
            const isAuthSuccess = await libjwt.initPromise;
            if (!email && isAuthSuccess) {
                const headers = new Headers();
                headers.append('Authorization', `Bearer ${libjwt.jwt.getEncodedToken()}`);
                const response = await fetch(apiUrl + '/accounts/v1/accounts', { method: 'GET', headers });
                const data = await response.json();
                const fullAccountsInfo = {};
                const accountsArray = [];
                const serviceAvailabilityInfo = {};
                const servicesInLocationsInfo = {};
                let currentServiceInfo;
                const locationsNumber = Object.keys(serviceAvailabilityInfo).length;
                const userInfo = await libjwt.jwt.getUserInfo();
                const { accounts, locations } = userInfo.external;

                const userParsed = JSON.parse(localStorage.getItem('user')) || initialUser;

                setBaseUrls && setBaseUrls(locations);
                changeUser(userParsed);
                setUser(userParsed);

                for (const obj of data) {
                    if (accounts[obj.name] && accounts[obj.name].roles.length && accounts[obj.name].locations.length) {
                        fullAccountsInfo[obj.name] = {
                            ...accounts[obj.name],
                            display_name: obj.display_name
                        };
                        for (const currentLocation of obj.locations) {
                            if (locationsNumber === locations.length) break;
                            if (!serviceAvailabilityInfo[currentLocation.name]) {
                                serviceAvailabilityInfo[currentLocation.name] = currentLocation.services.some(service => service.name === id);
                                servicesInLocationsInfo[currentLocation.name] = currentLocation.services;
                            }
                        }
                        accountsArray.push({
                            key: obj.name,
                            text: obj.display_name,
                            value: obj.name
                        });
                    }
                }
                changeAccounts && changeAccounts(fullAccountsInfo);
                for (let location in serviceAvailabilityInfo) {
                    if (serviceAvailabilityInfo[location]) {
                        currentServiceInfo = servicesInLocationsInfo[location].find(service => service.name === id);
                        break;
                    }
                };

                getServicesInfo && getServicesInfo(servicesInLocationsInfo);

                setUsername(userInfo.name);
                setEmail(userInfo.email);
                setAccountsDropdown(accountsArray);
                setAvailableAccounts(fullAccountsInfo);
                setIsError(isNoAccess[id] && isNoAccess[id](userInfo.groups) ? 'noAccess' : checkError(serviceAvailabilityInfo[userParsed.location]));
                setServiceAvailability(serviceAvailabilityInfo);
                setServicesInLocations(servicesInLocationsInfo);
                setCurrentService(currentServiceInfo);
            }
        } catch(_e) {
            console.log(_e)
            libjwt.jwt.getEncodedToken() && setIsError('wrong');
        }
    }, []);

    useEffect(() => {
        if (user.location) {
            const headers = new Headers();
            headers.append('Authorization', `Bearer ${libjwt.jwt.getEncodedToken()}`);
            fetch(`${apiUrl}/accounts/v1/locations/${user.location}`, { method: 'GET', headers })
                .then(response => response.json())
                .then(locationData => {
                    setLocationPublicData(locationData);
                    getPublicLocationData && getPublicLocationData(locationData)
                })
                .catch(e => console.log(e))
        }
    }, [user.location]);

    const getFirstAvailableLocation = (locations, serviceAvailability, currentLocation) => {
        if (locations.includes(currentLocation)) {
            return currentLocation;
        }
        for (const loc of locations) {
            if (serviceAvailability[loc]) {
                return loc;
            }
        }
        return locations[0];
    };

    useEffect(() => {
      const { account, location } = user;

      if (availableAccounts[account]) {
        const newLocation = getFirstAvailableLocation(availableAccounts[account].locations, serviceAvailability, location);
        const newRole = filterAndSort(availableAccounts[account].roles)[0];

        setUser(prevState => ({ ...prevState, location: newLocation, role: newRole }));
        isError != 'noAccess' && setIsError(checkError(serviceAvailability[newLocation]));

        changeUser({ account, location: newLocation, role: newRole });

        localStorage.setItem('user', JSON.stringify({ account, location: newLocation, role: newRole, email }));
      }
    }, [user.account]);

    const changeUserInfo = (name, value) => {
        if (name === 'location' && isError != 'noAccess') setIsError(checkError(serviceAvailability[value]));

        setUser(prevState => ({ ...prevState, [name]: value }));

        changeUser({ ...user, [name]: value });

        localStorage.setItem('user', JSON.stringify({ ...user, [name]: value, email }));
    };

    const changeLocale = (newLocale) => {
        setLocale(newLocale);
        changeLang(newLocale);
    };

    const mapServicesInLocation = (servicesInfo) => {
        const servicesInfoSet = new Set(servicesInfo);

        if (!serviceAvailability[user.location]) {
            servicesInfoSet.add(currentService);
        }

        return [...servicesInfoSet]
            .filter(location => location?.displayName && location?.name)
            .map((location, key) => {
                const shortNameArray = location.displayName.split('IBACloud ');
                const isExternal = location.url.startsWith('http');
                const isCurrentService = id === location.name;
                const url = isCurrentService ? '' : isExternal ? location.url : window.location.origin + location.path;

                return {
                    key,
                    text: location.displayName.startsWith('IBACloud') ? shortNameArray[1] : shortNameArray[0],
                    value: location.name,
                    className: isExternal ? 'external' : isCurrentService ? 'current' : '',
                    image: {
                        src: servicesImages[location.name]
                    },
                    url
                };
            });
    };

    const isSidebarOpen = isSideBarVisible && id !== 'home';
    const contentPadding = isSidebarOpen ? 'calc(260px + 2%)' : '2%';

    if (isError === 'wrong') {
        return (
            <h2 className='unavailable'>
                {errorTranslations[locale][isError]}
            </h2>
        );
    }

    return <Router basename={process.env.NODE_ENV === 'production' ? `/${id}` : ''}>
        <Header 
            id={id}
            isBurgerMenyVisible={routes && id !== 'home'}
            user={user}
            changeUser={(name, value) => changeUserInfo(name, value)}
            locale={locale}
            changeLocale={newLocale => changeLocale(newLocale)}
            availableAccounts={availableAccounts}
            accountsDropdown={accountsDropdown}
            username={username}
            email={email}
            serviceAvailability={serviceAvailability}
            changeSidebarVisability={() => setIsSideBarVisible(prevState => !prevState)}
            logout={() => libjwt.jwt.logout(true, locationPublicData.back_to_url)}
        />
        { id !== 'home' && (
            <Sidebar
                name={id}
                routes={routes}
                visible={isSideBarVisible}
                changeApp={(newLocation) => changeApp(newLocation)}
                isAvailable={routes && !isError}
                servicesInLocations={servicesInLocations[user.location] ? mapServicesInLocation(servicesInLocations[user.location]) : null}
            />
        )}
        { isError ? (
            <h2 className={(isSidebarOpen ? 'sidebar-open' : 'sidebar-close') + ' unavailable'} style={{ paddingLeft: contentPadding }}>
                {errorTranslations[locale][isError]}
            </h2>

        ) : (
            <div className={(isSidebarOpen ? 'sidebar-open' : 'sidebar-close') + ' main-content'} style={{ paddingLeft: contentPadding }}>
                {children}
            </div>
            )
        }
    </Router>;
};

Wrapper.propTypes = {
    id: PropTypes.string,
    changeAccounts: PropTypes.func,
    routes: PropTypes.array,
    locale: PropTypes.string,
    changeLang: PropTypes.func
};

export default Wrapper;
