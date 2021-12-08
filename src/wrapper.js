import React, { PureComponent } from 'react';
import { Dropdown, Loader, Segment, Icon } from 'semantic-ui-react';
import { BrowserRouter as Router } from 'react-router-dom';
import RenderSidebar from './RenderSidebar';
import ICDCLogo from './logo.svg';
import QuestionLogo from './question.svg';
import Burger from './burger.svg';
import './wrapper.scss';
import PropTypes from 'prop-types';
import auth from './auth';

class Wrapper extends PureComponent {
    constructor() {
        super();
        this.state = {
            account: '',
            location: '',
            role: '',
            availableAccounts: null,
            visible: true,
            accountsDropdown: [],
            userInfo: null
        };
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

    DropdownIcon = (value) => (
        <div style={{ display: 'inline-block', float: 'right' }}>
            <Icon style={{ float: 'right', margin: 0, marginRight: '-8px' }} name="angle right"/>
            <span style={{ marginRight: '4px', color: 'gray' }}>{value.toUpperCase()}</span>
        </div>
    );

    componentDidMount() {
        const { availableAccounts } = this.state;
        const { id, changeAccounts, changeUser } = this.props;
        const libjwt = auth();
        libjwt.initPromise.then(() => {
            const { account, location, role } = JSON.parse(localStorage.getItem('user'));
            changeUser({ account, location, role });
            window.insights = {
                getToken: () => libjwt.jwt.getEncodedToken(),
                getUserInfo: () => libjwt.jwt.getUserInfo()
            }
            if (!availableAccounts) {
                const h = new Headers();
                h.append('Authorization', `Bearer ${libjwt.jwt.getEncodedToken()}`);
                fetch('https://api.zby.icdc.io/api/accounts/v1/accounts', {
                  method: 'GET',
                  headers: h
                }).
                then(response => response.json()
                .then(data => {
                    let newAccounts = {};
                    let accountsArray = [];
                    const userInfo = libjwt.jwt.getUserInfo();
                    const { accounts } = userInfo.external;
                    this.setState({ userInfo });
                    for (let obj in accounts) {
                        if (accounts[obj].locations.length && accounts[obj].roles.length) {
                            newAccounts[obj] = { ...accounts[obj] };
                        }
    
                    };

                    if (id === 'home') {
                        for (let obj in newAccounts) {
                            data.forEach(acc => {
                                if (obj === acc.name) {
                                    newAccounts[obj].locations = acc.locations;
                                    newAccounts[obj].display_name = acc.display_name;
                                    accountsArray.push({
                                        key: acc.name,
                                        text: acc.display_name,
                                        value: acc.name
                                    });
                                }
                            })
                        };
                    } else {
                        data.forEach(acc => {
                            acc.locations.forEach((location => {
                                location.services = location.services.filter(service => service.name === id);
                            }));
                            acc.locations = acc.locations.filter((location => location.services.length !== 0));
                        });
                        for (let obj in newAccounts) {
                            data
                            .filter(acc => acc.locations.length !== 0)
                            .forEach(acc => {
                                if (obj === acc.name) {
                                    newAccounts[obj].locations = acc.locations;
                                    newAccounts[obj].display_name = acc.display_name;
                                    accountsArray.push({
                                        key: acc.name,
                                        text: acc.display_name,
                                        value: acc.name
                                    });
                                }
                            });
                        };
                    }
                    changeAccounts(newAccounts);
                    this.setState({
                        accountsDropdown: accountsArray,
                        availableAccounts: newAccounts,
                        account,
                        location,
                        role
                    });
                }));
            }
        });
    };

    componentDidUpdate(_prevProps, prevState) {
        const { account, availableAccounts, userInfo } = this.state;
        if (account && availableAccounts && prevState.account !== account) {
            this.setState({
                location: availableAccounts[account].locations[0].name,
                role: availableAccounts[account].roles[0]
            });
            localStorage.setItem('user', JSON.stringify({
                account,
                location: availableAccounts[account].locations[0].name,
                role: availableAccounts[account].roles[0],
                email: userInfo.email
            }));
        };
    };

    changeUserInfo = (name, value) => {
        const { account, location, role, userInfo } = this.state;
        const { changeUser } = this.props;
        this.setState({ [name]: value });
        changeUser({ account, location, role, [name]: value });
        localStorage.setItem('user', JSON.stringify({
            account, location, role, [name]: value, email: userInfo.email
        }))
    };

    render() {
        const {
            availableAccounts,
            account,
            accountsDropdown,
            role,
            location,
            userInfo,
            visible,
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

        const roles = availableAccounts ? availableAccounts[account].roles.map(role => ({
            key: role,
            text: `${role}`,
            value: `${role}`
        })) : [];

        const locations = availableAccounts ? availableAccounts[account].locations.map(location => ({
            key: location.name,
            text: `${location.name}`,
            value: `${location.name}`
        })) : [];

        const isServiceAvailableInCurrantLocation = availableAccounts && Boolean([...locations].filter(currentLocation => currentLocation.value === location).length);

        const content = availableAccounts ? <>
            <header>
                { routes && <img src={Burger}
                                style={{ color: 'white', cursor: 'pointer' }}
                                onClick={ () => this.setState(prevState => ({ visible: !prevState.visible }))}
                                alt='Burger menu' /> }
                <img src={ ICDCLogo } alt="ICDCLogo"/>
                <div className='info-section'>
                    <Dropdown className='question-dropdown' icon={<img src={QuestionLogo} />}>
                        <Dropdown.Menu>
                            <Dropdown.Item >
                                <a href={`https://help.icdc.io/devops/${locale}/Welcome.html`} target='_blank' style={{ color: 'black' }}>
                                    Help & Asistance
                                </a>
                            </Dropdown.Item>
                            <Dropdown.Item>Support</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    { id !== 'devops' && <label>
                        Role:
                        <Dropdown
                            fluid
                            selection
                            value={role}
                            onChange={(_e, data) => this.changeUserInfo('role', data.value)}
                            options={roles}
                        />
                    </label>}

                    <label>
                        Location:
                        <Dropdown
                            fluid
                            selection
                            value={location}
                            onChange={(_e, data) => this.changeUserInfo('location', data.value)}
                            options={locations}
                        />
                    </label>
                    <Dropdown
                        text={userInfo.name}
                        className='user-dropdown'
                    >
                        <Dropdown.Menu className='first-level'>
                            <Dropdown.Header>Username: <br />{userInfo.email}</Dropdown.Header>
                            <Dropdown text='Accounts'
                                pointing='right'
                                className='link item accounts'
                                icon={this.DropdownIcon(account)}
                            >
                                <Dropdown.Menu className='second-level'>
                                    { accountsDropdown.map(account => (
                                        <Dropdown.Item key={account.key} onClick={() => this.setState({ account: account.value })}>
                                            {account.text}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown text='Language' pointing='right' className='link item'
                            icon={this.DropdownIcon(locale)} 
                            >
                                <Dropdown.Menu className='second-level' >
                                {this.langs.map(lang => (
                                    <Dropdown.Item key={lang.value} onClick={(_e, data) => changeLang(lang.value)}>{lang.text}</Dropdown.Item>))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => logout(true)}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </header>
            <div>
                { routes && isServiceAvailableInCurrantLocation && <RenderSidebar name={name}
                                                                        routes={routes}
                                                                        visible={visible}
                                                                        changeApp={(newLocation) => changeApp(newLocation)}
                                                                    /> }
                { isServiceAvailableInCurrantLocation ? (
                <div className='main-content' style={{ paddingLeft: visible ? '290px' : '40px' }}>
                    {children}
                </div>) : <h2 className='unavailable'>{this.errorTranslations[locale]}</h2> } 
            </div>
        </> : <Segment className='start-loader'>
        <Loader active inline='centered' />
    </Segment>;

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
