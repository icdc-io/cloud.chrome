import React, { PureComponent } from 'react';
import { Dropdown, Loader, Segment, Icon, Popup } from 'semantic-ui-react';
import { BrowserRouter as Router } from 'react-router-dom';
import RenderSidebar from './RenderSidebar';
import ICDCLogo from './logo.svg';
import QuestionLogo from './question.svg';
import Burger from './burger.svg';
import './wrapper.scss';
import PropTypes from 'prop-types';
import auth from './auth';

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
            email: '',
            isUserDropdownOpen: false,
            accountFullName: '',
            serviceAvailability: {}
        };
        this.ref = React.createRef();
    }

    errorTranslations = {
        ru: 'Сервис недоступен в этой локации. Пожалуйста, выберите другую.',
        en: 'The service is not available in this location. Please choose another location.'
    };

    langs = [{
        text: 'Русский',
        value: 'ru'
     },
     {
        text: 'English',
        value: 'en'
    }];

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
        const { id, changeAccounts, changeUser } = this.props;
        const libjwt = auth();
        libjwt.initPromise.then(() => {
            const { account, location, role } = JSON.parse(localStorage.getItem('user'));
            changeUser({ account, location, role });
            window.insights = {
                getToken: () => libjwt.jwt.getEncodedToken(),
                getUserInfo: () => libjwt.jwt.getUserInfo()
            }
            if (!email) {
                const h = new Headers();
                h.append('Authorization', `Bearer ${libjwt.jwt.getEncodedToken()}`);
                fetch('https://api.zby.icdc.io/api/accounts/v1/accounts', {
                  method: 'GET',
                  headers: h
                }).
                then(response => response.json()
                .then(data => {
                    const fullAccountsInfo = {};
                    const accountsArray = [];
                    const serviceAvailability = {};
                    const locationsNumber = Object.keys(serviceAvailability).length;
                    const userInfo = libjwt.jwt.getUserInfo();
                    const { accounts, locations } = userInfo.external;
                    this.setState({ email: userInfo.email, locations });
                    for (let obj of data) {
                        if (accounts[obj.name] && accounts[obj.name].roles.length && accounts[obj.name].locations.length) {
                            fullAccountsInfo[obj.name] = {
                                ...accounts[obj.name],
                                display_name: obj.display_name
                            };
                            for (let currentLocation of obj.locations) {
                                if (locationsNumber === locations.length) break;
                                if (!serviceAvailability[currentLocation.name]) {
                                    serviceAvailability[currentLocation.name] = currentLocation.services.some(service => service.name === id);
                                }
                            }
                            accountsArray.push({
                                key: obj.name,
                                text: obj.display_name,
                                value: obj.name
                            });
                        }
                    }
                    changeAccounts(fullAccountsInfo);
                    this.setState({
                        accountsDropdown: accountsArray,
                        availableAccounts: fullAccountsInfo,
                        account,
                        location,
                        role,
                        accountFullName: fullAccountsInfo[account].display_name,
                        serviceAvailability
                    });
                }));
            }
        });
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    };

    getFirstAvailableLocation = (locations, serviceAvailability) => {
        for (let loc of locations) {
            if (serviceAvailability[loc]) {
                return loc;
            }
        }
    };

    componentDidUpdate(_prevProps, prevState) {
        const { account, availableAccounts, email, serviceAvailability } = this.state;
        if (account && availableAccounts && prevState.account !== account) {
            this.setState({
                location: this.getFirstAvailableLocation(availableAccounts[account].locations, serviceAvailability),
                role: availableAccounts[account].roles[0]
            });
            localStorage.setItem('user', JSON.stringify({
                account,
                location: availableAccounts[account].locations[0],
                role: availableAccounts[account].roles[0],
                email
            }));
        };
    };

    changeUserInfo = (name, value) => {
        const { account, location, role, email } = this.state;
        const { changeUser } = this.props;
        this.setState({ [name]: value, isUserDropdownOpen: false });
        changeUser({ account, location, role, [name]: value });
        localStorage.setItem('user', JSON.stringify({
            account, location, role, [name]: value, email
        }))
    };

    getLocationsAvailability = (locations, serviceAvailability) => {
        const availableLocations = [], notAvailableLocations = [];

        for (let loc of locations) {
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

    render() {
        const {
            availableAccounts,
            account,
            accountsDropdown,
            role,
            location,
            email,
            isSideBarVisible,
            isUserDropdownOpen,
            serviceAvailability
        } = this.state;
        const {
            name,
            routes,
            locale,
            id,
            logout,
            changeLang,
            children,
            changeApp
        } = this.props;

        const currentAccountInfo = availableAccounts[account];

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

        // const locations = currentAccountInfo.locations.map(location => ({
        //     key: location,
        //     text: location,
        //     value: location
        // }));

        const { availableLocations, notAvailableLocations } = this.getLocationsAvailability(currentAccountInfo.locations, serviceAvailability);

        const userDropdownClasses = ['ui', 'active', 'dropdown', 'user-dropdown'];
        const firstLevelMenuClasses = ['menu', 'transition', 'first-level'];

        if (isUserDropdownOpen) {
            userDropdownClasses.push('visible');
            firstLevelMenuClasses.push('visible');
        }

        const content = <>
            <header>
                { routes && <img src={Burger}
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
                            <Dropdown.Item>Support</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <label>
                        Location:
                        {/* <Dropdown
                            fluid
                            selection
                            value={location}
                            onChange={(_e, data) => this.changeUserInfo('location', data.value)}
                            options={[...availableLocations, ...notAvailableLocations]}
                            className='locations'
                        >
                        </Dropdown> */}
                        <Dropdown fluid
                            selection
                            value={location}
                            options={[...availableLocations, ...notAvailableLocations]}
                            scrolling={false}
                            className='locations'>
                        <Dropdown.Menu>
                                { availableLocations.map(currentLocation => (
                                <Dropdown.Item key={currentLocation.key}
                                    className={currentLocation.value === location ? 'current' : ''}
                                    onClick={() => this.changeUserInfo('location', currentLocation.value)}
                                    active={currentLocation.value === location}
                                    selected={currentLocation.value === location}
                                >
                                    {currentLocation.text}
                                </Dropdown.Item>
                                ))}
                                                            <Dropdown.Divider />
                            <Dropdown.Header>Not available</Dropdown.Header>
                                { notAvailableLocations.map(currentLocation => (
                                <Dropdown.Item key={currentLocation.key}
                                    active={currentLocation.value === location}
                                    selected={currentLocation.value === location}
                                    disabled
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
                            Dzmitry Valashchuk
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
                                            onClick={() => this.setState({
                                                account: currentAccount.value,
                                                accountFullName: currentAccount.text,
                                                isUserDropdownOpen: false
                                            })}
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
                                    {this.langs.map(lang => (
                                        <Dropdown.Item key={lang.value}
                                            className={lang.value === locale ? 'current' : ''}
                                            onClick={() => { changeLang(lang.value); this.setState({ isUserDropdownOpen: false }) }}>
                                                {lang.text}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown.Item onClick={() => logout(true)}>Logout</Dropdown.Item>
                        </div>
                    </div>
                </div>
            </header>
                { routes && serviceAvailability[location] && (
                    <RenderSidebar name={name}
                        routes={routes}
                        visible={isSideBarVisible}
                        changeApp={(newLocation) => changeApp(newLocation)}
                    />
                )}
                { serviceAvailability[location] ? (
                    <div className='main-content' style={{ paddingLeft: isSideBarVisible ? 'calc(260px + 2%)' : '2%' }}>
                        {children}
                    </div>
                ) : <h2 className='unavailable'>{this.errorTranslations[locale]}</h2>
                } 
        </>;

    return <Router>{content}</Router>;
    }
};

Wrapper.propTypes = {
    id: PropTypes.string,
    changeAccounts: PropTypes.func,
    routes: PropTypes.array,
    locale: PropTypes.string,
    logout: PropTypes.func,
    changeLang: PropTypes.func
};

export default Wrapper;
