import React, { PureComponent } from 'react';
import { Dropdown, Loader, Segment, Icon, Popup } from 'semantic-ui-react';
import { BrowserRouter as Router } from 'react-router-dom';
import RenderSidebar from './RenderSidebar';
import ICDCLogo from './images/logo.svg';
import QuestionLogo from './images/question.svg';
import Burger from './images/burger.svg';
import './wrapper.scss';
import PropTypes from 'prop-types';
import auth from './auth';
import { errorTranslations, langs, servicesImages } from './constants/viewConstants';

class Wrapper extends PureComponent {
    constructor(props) {
        super(props);
        const userInfo = JSON.parse(localStorage.getItem('user'));

        this.state = {
            account: userInfo?.account,
            location: '',
            role: '',
            availableAccounts: {},
            isSideBarVisible: true,
            accountsDropdown: [],
            username: '',
            email: '',
            isUserDropdownOpen: false,
            accountFullName: '',
            serviceAvailability: {},
            servicesInLocations: {},
            isError: '',
            currentService: {},
            locale: this.props.language
        };
        this.ref = React.createRef();
        this.libjwt = auth();
    };

    isNoAccess = {
        admin: (groups) => !groups.some(group => /.admin$/.test(group)),
        devops: (groups) => /*['member'].some(role => tokenData.external.accounts[user.account].roles.indexOf(role) !== -1)*/false
    };

    handleClickOutside = (event) => {
        if (this.ref.current && !this.ref.current.contains(event.target)) {
          this.setState({ isUserDropdownOpen: false });
        }
    };

    DropdownIcon = (value, isPopup) => (
        <div style={{ display: 'inline-block', float: 'right' }}>
            <span style={{ marginRight: '4px', color: 'gray' }}>{value.toUpperCase()}</span>
            { isPopup ? (
                <Popup
                    content={this.state.accountFullName}
                    position='bottom left'
                    trigger={<Icon name='attention' className='location-popup' />}
                />
            ) : <Icon style={{ float: 'right', margin: 0, marginRight: '-8px' }} name="angle right"/> }
        </div>
    );

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);

        const { email } = this.state;
        const { id, changeAccounts, changeUser, getAppInfo = null, setBaseUrls = null, getServicesInfo = null } = this.props;
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
        this.libjwt.initPromise.then(() => {
            const user = JSON.parse(localStorage.getItem('user')) || {
                location: '',
                account: '',
                role: ''
            };
            changeUser(user);
            window.insights = {
                getToken: () => this.libjwt.jwt.getEncodedToken(),
                getUserInfo: () => this.libjwt.jwt.getUserInfo(),
                getLocation: () => this.state.location,
                getAccount: () => this.state.account,
                getRole: () => this.state.role
            };

            if (!email) {
                const h = new Headers();
                h.append('Authorization', `Bearer ${this.libjwt.jwt.getEncodedToken()}`);
                const apiUrl = process.env.API_GATEWAY ? `${process.env.API_GATEWAY}/api` : 'https://api.icdc.d3.zby.icdc.io/api';
                fetch(apiUrl + '/accounts/v1/accounts', {
                    method: 'GET',
                    headers: h
                })
                .then(response => response.json()
                .then(async data => {
                    const fullAccountsInfo = {};
                    const accountsArray = [];
                    const serviceAvailability = {};
                    const servicesInLocations = {};
                    let currentService;
                    const locationsNumber = Object.keys(serviceAvailability).length;
                    const userInfo = await this.libjwt.jwt.getUserInfo();
                    const { accounts, locations } = userInfo.external;
                    setBaseUrls && setBaseUrls(locations);
                    for (const obj of data) {
                        if (accounts[obj.name] && accounts[obj.name].roles.length && accounts[obj.name].locations.length) {
                            fullAccountsInfo[obj.name] = {
                                ...accounts[obj.name],
                                display_name: obj.display_name
                            };
                            for (const currentLocation of obj.locations) {
                                if (locationsNumber === locations.length) break;
                                if (!serviceAvailability[currentLocation.name]) {
                                    serviceAvailability[currentLocation.name] = currentLocation.services.some(service => service.name === id);
                                    servicesInLocations[currentLocation.name] = currentLocation.services;
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
                    for (let location in serviceAvailability) {
                        if (serviceAvailability[location]) {
                            currentService = servicesInLocations[location].find(service => service.name === id);
                            break;
                        }
                    };

                    getServicesInfo && getServicesInfo(servicesInLocations);

                    this.setState({
                        username: userInfo.name,
                        email: userInfo.email,
                        locations,
                        isError: this.isNoAccess[id] && this.isNoAccess[id](userInfo.groups) ? 'noAccess' : !serviceAvailability[user.location] && id !== 'home' ? 'notAvailable' : '',
                        accountsDropdown: accountsArray,
                        availableAccounts: fullAccountsInfo,
                        account: user.account,
                        location: user.location,
                        role: user.role,
                        accountFullName: fullAccountsInfo[user.account].display_name,
                        serviceAvailability,
                        servicesInLocations,
                        currentService
                    });
                })
                .catch((_e) => {
                    console.log('_e')
                    console.log(_e)
                    console.log('_e')
                    this.setState({ isError: 'wrong' })
                }));
            }
        });
    };

    // initHelpDesk = () => {
    //     localStorage.setItem('support-token', this.libjwt.jwt.getEncodedToken());
    //     window.icdcHelpdeskWidget.reloadIframe();
    // }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    };

    getFirstAvailableLocation = (locations, serviceAvailability, currentLocation) => {
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

    componentDidUpdate(_prevProps, prevState) {
        const { account, availableAccounts, email, serviceAvailability, location, isError } = this.state;
        const { changeUser, id } = this.props;

        if (isError != 'noAccess' && account && availableAccounts && prevState.account !== account) {
            const newLocation = this.getFirstAvailableLocation(availableAccounts[account].locations, serviceAvailability, location);
            this.setState({
                location: newLocation,
                role: availableAccounts[account].roles[0],
                isError: !serviceAvailability[newLocation] && id !== 'home' ? 'notAvailable' : ''
            });
            changeUser({ account, location: newLocation, role: availableAccounts[account].roles[0] });
            localStorage.setItem('user', JSON.stringify({
                account,
                location: availableAccounts[account].locations[0],
                role: availableAccounts[account].roles[0],
                email
            }));
        };
    };

    changeUserInfo = (name, value) => {
        if (this.state.isError != 'noAccess' && this.state[name] !== value) {
            const { account, location, role, email, serviceAvailability } = this.state;
            const { changeUser, id } = this.props;
            this.setState({
                [name]: value,
                isUserDropdownOpen: false,
                isError: name !== 'location' || serviceAvailability[value] || id === 'home' ? '' : 'notAvailable'
            });
            changeUser({ account, location, role, [name]: value });
            localStorage.setItem('user', JSON.stringify({
                account, location, role, [name]: value, email
            }))
        }
    };

    getLocationsAvailability = (locations, serviceAvailability) => {
        const availableLocations = [], notAvailableLocations = [];

        for (const loc of locations) {
            if (serviceAvailability[loc]) {
                availableLocations.push({
                    key: loc,
                    text: loc,
                    value: loc
                });
            } else {
                notAvailableLocations.push({
                    key: loc,
                    text: loc,
                    value: loc,
                    disabled: true
                });
            }
        }

        return { availableLocations, notAvailableLocations };
    };

    mapServicesInLocation = (servicesInfo) => {
        const {
            location,
            serviceAvailability,
            currentService
        } = this.state;

        const servicesInfoSet = new Set(servicesInfo);

        if (!serviceAvailability[location]) {
            servicesInfoSet.add(currentService);
        }

        return [...servicesInfoSet].map((location, key) => {
            const shortNameArray = location.displayName.split('IBACloud ');
            const isExternal = location.url.startsWith('http');
            const isCurrentService = this.props.id === location.name;
            const url = isCurrentService ? '' : isExternal ? location.url : 'https://cloud.icdc.io' + location.path;

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

    setLang = (newLang) => {
        this.props.changeLang(newLang);
        this.setState({ isUserDropdownOpen: false, locale: newLang });
        localStorage.setItem('icdc-lang', newLang);
    };

    changeAccount = (currentAccount) => {
        if (this.state.isError != 'noAccess') {
            this.setState({
                account: currentAccount.value,
                accountFullName: currentAccount.text,
                isUserDropdownOpen: false
            });
        }
    };

    render() {
        const {
            availableAccounts,
            account,
            accountsDropdown,
            role,
            location,
            username,
            email,
            isSideBarVisible,
            isUserDropdownOpen,
            serviceAvailability,
            servicesInLocations,
            isError,
            currentService,
            locale
        } = this.state;
        const {
            routes = [],
            id,
            children,
            changeApp = () => {},
            openHelpdesk = false
        } = this.props;

        const currentAccountInfo = availableAccounts[account];

        if (isError === 'wrong') {
            return (
                <h2 className='unavailable' style={{ paddingLeft: contentPadding }}>
                    {errorTranslations[locale][isError]}
                </h2>
            );
        }

        if (!currentAccountInfo) {
            return (
                <Segment className='start-loader'>
                    <Loader active inline='centered' />
                </Segment>
            );
        }

        const roles = currentAccountInfo.roles.map(role => ({
            key: role,
            text: `${role}`,
            value: `${role}`
        }));

        const { availableLocations, notAvailableLocations } = this.getLocationsAvailability(currentAccountInfo.locations, serviceAvailability);

        const userDropdownClasses = ['ui', 'active', 'dropdown', 'user-dropdown'];
        const firstLevelMenuClasses = ['menu', 'transition', 'first-level'];
        const isSidebarOpen = isSideBarVisible && id !== 'home';
        const contentPadding = isSidebarOpen ? 'calc(260px + 2%)' : '2%';

        if (isUserDropdownOpen) {
            userDropdownClasses.push('visible');
            firstLevelMenuClasses.push('visible');
        }

        const content = (
            <>
                <header className='chrome-header'>
                    { routes && id !== 'home' && <img src={Burger}
                                    style={{ color: 'white', cursor: 'pointer' }}
                                    onClick={ () => this.setState(prevState => ({ isSideBarVisible: !prevState.isSideBarVisible }))}
                                    alt='Burger menu' /> }
                    <img src={ ICDCLogo } alt="ICDCLogo"/>
                    <div className='info-section'>
                        <Dropdown className='question-dropdown' icon={<img src={QuestionLogo} />}>
                            <Dropdown.Menu>
                                <Dropdown.Item>
                                    <a href={`https://help.icdc.io/devops/${locale}/Welcome.html`} target='_blank' style={{ color: 'black' }}>
                                        Help & Asistance
                                    </a>
                                </Dropdown.Item>
                                { openHelpdesk && <Dropdown.Item onClick={() => openHelpdesk()}>Support</Dropdown.Item> }
                            </Dropdown.Menu>
                        </Dropdown>

                        <label>
                            Location:
                            <Dropdown fluid
                                selection
                                value={location}
                                options={[...availableLocations, ...notAvailableLocations]}
                                scrolling={false}
                                className='locations'
                            >
                                <Dropdown.Menu>
                                        { availableLocations.map(currentLocation => (
                                        <Dropdown.Item key={currentLocation.key}
                                            className={(currentLocation.value === location ? 'current' : '') + ' available'}
                                            onClick={() => this.changeUserInfo('location', currentLocation.value)}
                                            active={currentLocation.value === location}
                                            selected={currentLocation.value === location}
                                        >
                                            {currentLocation.text}
                                        </Dropdown.Item>
                                        ))}
                                        <Dropdown.Divider />
                                        { notAvailableLocations.map(currentLocation => (
                                        <Dropdown.Item key={currentLocation.key}
                                            onClick={() => this.changeUserInfo('location', currentLocation.value)}
                                            active={currentLocation.value === location}
                                            selected={currentLocation.value === location}
                                        >
                                            {currentLocation.text}
                                        </Dropdown.Item>
                                        ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </label>
                        <div ref={this.ref}
                            onClick={() => this.setState((prevState) => ({ isUserDropdownOpen: !prevState.isUserDropdownOpen }))}
                            role="listbox"
                            aria-expanded={isUserDropdownOpen}
                            className={userDropdownClasses.join(' ')}
                            tabIndex="0"
                        >
                            <div aria-atomic="true"
                                aria-live="polite"
                                role="alert"
                                className="divider text"
                            >
                                {username}
                            </div>
                            <i aria-hidden="true" className="dropdown icon"></i>
                            <div className={firstLevelMenuClasses.join(' ')}>
                                <Dropdown.Header>{email}</Dropdown.Header>
                                <Dropdown.Divider />
                                <Dropdown text='Accounts'
                                    pointing='right'
                                    simple
                                    className='link item accounts'
                                    icon={this.DropdownIcon(account, true)}
                                    closeOnChange
                                >
                                    <Dropdown.Menu className='second-level'>
                                        { accountsDropdown.map(currentAccount => (
                                            <Dropdown.Item key={currentAccount.key}
                                                className={currentAccount.value === account ? 'current' : ''}
                                                onClick={() => this.changeAccount(currentAccount)}
                                            >
                                                {currentAccount.text}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                                { id !== 'devops' && <Dropdown text='Role'
                                    pointing='right'
                                    simple
                                    className='link item role'
                                    icon={this.DropdownIcon(role)}
                                    closeOnChange
                                >
                                    <Dropdown.Menu className='second-level'>
                                        {roles.map(currentRole => (
                                            <Dropdown.Item key={currentRole.value}
                                                className={currentRole.value === role ? 'current' : ''}
                                                onClick={() => this.changeUserInfo('role', currentRole.value)}>
                                                    {currentRole.text}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown> }
                                <Dropdown.Divider />
                                <Dropdown text='Language'
                                    pointing='right'
                                    simple
                                    className='link item lang'
                                    icon={this.DropdownIcon(locale)}
                                    closeOnChange
                                >
                                    <Dropdown.Menu className='second-level'>
                                        {langs.map(lang => (
                                            <Dropdown.Item key={lang.value}
                                                className={lang.value === locale ? 'current' : ''}
                                                onClick={() => lang.value !== locale && this.setLang(lang.value)}>
                                                    {lang.text}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                                <Dropdown.Item onClick={() => this.libjwt.jwt.logout(true)}>Logout</Dropdown.Item>
                            </div>
                        </div>
                    </div>
                </header>
                { id !== 'home' && <RenderSidebar name={id}
                    routes={routes}
                    visible={isSideBarVisible}
                    changeApp={(newLocation) => changeApp(newLocation)}
                    isAvailable={routes && !isError}
                    servicesInLocations={this.mapServicesInLocation(servicesInLocations[location])}
                    currentService={currentService}
                /> }
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
            </>
        );

        return <Router>{content}</Router>;
    }
};

Wrapper.propTypes = {
    id: PropTypes.string,
    changeAccounts: PropTypes.func,
    routes: PropTypes.array,
    locale: PropTypes.string,
    changeLang: PropTypes.func
};

export default Wrapper;
