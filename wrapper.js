import './wrapper.scss';
import { Link, useLocation } from 'react-router-dom';
import { memo, useEffect, useState } from 'react';
import { Dropdown, Sidebar, Loader, Segment, Menu, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { changeLang } from '../redux/actions';
import ICDCLogo from './logo.svg';

/*eslint-disable*/
function Wrapper({ children, id, routes, token, tokenData, changeAccounts, changeUser, logout, locale }) {
    const userInfo = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(userInfo);
    const [accounts, setAccounts] = useState(null);
    const [accountsDropdown, setAccountsDropdown] = useState([]);
    const [visible, setVisible] = useState(true);

    const location = useLocation();
    const currentUrl = location.pathname.split('/')[1];
    const [activeItem, setActiveItem] = useState(currentUrl);

    const errorTranslations = {
        ru: 'Сервис недоступен в этой локации. Пожалуйста, выберите другую.',
        en: 'The service is not available in this location. Please choose another location.'
    };

    const roles = accounts && accounts[user.account].roles.map(role => ({
        key: role,
        text: `${role}`,
        value: `${role}`
    }));

    const locations = accounts && accounts[user.account].locations.map(location => ({
        key: location.name,
        text: `${location.name}`,
        value: `${location.name}`
    }));

    const isServiceAvailableInCurrantLocation = accounts && Boolean([...locations].filter(location => location.value === user.location).length);

    useEffect(() => {
        setActiveItem(currentUrl);
    }, [currentUrl]);

    const dispatch = useDispatch();

    const langs = [{
        text: 'Русский',
        value: 'ru'
     },
     {
        text: 'English',
        value: 'en'
    }];

    const lang = useSelector(state => state.rootReducer.lang);

    useEffect(() => {
        if (tokenData && !accounts) {
            const h = new Headers();
            h.append('Authorization', `Bearer ${token}`);
            fetch('https://api.zby.icdc.io/api/accounts/v1/accounts', {
              method: 'GET',
              headers: h
            }).
            then(response => response.json()
            .then(data => {
                let newAccounts = {};
                let accountsArray = [];
                for (let obj in tokenData.external.accounts) {
                    if (tokenData.external.accounts[obj].locations.length && tokenData.external.accounts[obj].roles.length) {
                        newAccounts[obj] = { ...tokenData.external.accounts[obj] };
                    }

                };

                if (id === 'home') {
                    console.log('home')
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
                setAccountsDropdown(accountsArray);
                setAccounts(newAccounts);
            }));
        }
    }, []);

    useEffect(() => {
        if (user.account && accounts) {
            setUser(prevState =>({ ...prevState, location: accounts[user.account].locations[0].name, role: accounts[user.account].roles[0] }));
        }
    }, [user.account]);

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user));
        changeUser(user);
    }, [user]);

    const handleItemClick = (url) => setActiveItem(url);

    const DropdownIcon = (value) => (
        <div style={{ display: 'inline-block', float: 'right' }}>
            <Icon style={{ float: 'right', margin: 0, marginRight: '-8px' }} name="angle right"/>
            <span style={{ marginRight: '4px', color: 'gray' }}>{value.toUpperCase()}</span>
        </div>
    );

    return accounts ? <div className='wrapper'>
            <header>
                { routes && <Icon name='bars' size='big' style={{ color: 'white', cursor: 'pointer' }}
                    onClick={ () => setVisible(!visible)}/> }
                <img src={ ICDCLogo } alt="ICDCLogo"/>
                <div className='info-section'>
                        <Dropdown  text={<Icon name='question circle' style={{ color: 'white'}}/>}>
                            <Dropdown.Menu>
                            <Dropdown.Item >
                                <Link to={{ pathname:`https://help.icdc.io/devops/${lang}/Welcome.html`}} target='_blank' style={{ color: 'black' }}>
                                    Help & Asistance
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item>Support</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    
                    { id !== 'devops' && <label>
                        Role:
                        <Dropdown
                            fluid
                            selection
                            value={user.role}
                            onChange={(_e, data) => setUser(prevState => ({ ...prevState, role: data.value }))}
                            options={roles}
                        />
                    </label>}

                    <label>
                        Location:
                        <Dropdown
                            fluid
                            selection
                            value={user.location}
                            onChange={(_e, data) => setUser(prevState => ({ ...prevState, location: data.value }))}
                            options={locations}
                        />
                    </label>
                    <Dropdown
                        text={`${tokenData.given_name} ${tokenData.family_name}`}
                        className='user-dropdown'
                    >
                        <Dropdown.Menu className='first-level'>
                            <Dropdown.Header>Username: <br />{tokenData.email}</Dropdown.Header>
                            <Dropdown text='Accounts'
                                    pointing='right'
                                    className='link item accounts'
                                    icon={DropdownIcon(user.account)} 
                                    >
                                <Dropdown.Menu className='second-level'>
                                    { accountsDropdown.map(account => (
                                    <Dropdown.Item key={account.key} onClick={() => setUser(prevState => ({ ...prevState, account: account.value }))}>
                                        {account.text}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown text='Language' pointing='right' className='link item'
                            icon={DropdownIcon(lang)} 
                            >
                                <Dropdown.Menu className='second-level' >
                                {langs.map(lang => (
                                    <Dropdown.Item key={lang.value} onClick={() => dispatch(changeLang(lang.value))}>{lang.text}</Dropdown.Item>))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={() => logout(true)}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </header>
            { routes && isServiceAvailableInCurrantLocation &&
                <Sidebar as={Menu} visible={ visible } animation='overlay' vertical inverted style={{ overflow: 'hidden' }}>
                    <Menu inverted className='sidebar_top'>
                        <Menu.Item className='sidebar_home_link'>
                            <Link to={{ pathname: 'https://icdc.io/'}} target='_blank'>
                                <Icon name='home' size='large' />
                            </Link>
                        </Menu.Item>
                        <Menu.Item className='sidebar_logo_text' style={{ color: 'white' }}>
                            ICDC DevOps
                        </Menu.Item>
                    </Menu>
                    { routes.map((route, key) =>
                        <Link
                            key={key}
                            to={route.url}
                            className={ (activeItem === route.url ? 'active ' : '') + 'item'}
                            style={{ fontSize: '15px'}}>
                            {route.text}
                        </Link>
                    )}
                </Sidebar>
            }
            { isServiceAvailableInCurrantLocation ? <div className='main-content' style={{ paddingLeft: visible ? '320px' : '40px' }}>
                    {children}
                </div> : <h2 className='unavailable'>{errorTranslations[locale]}</h2>
            }
        </div> : <Segment className='start-loader'>
        <Loader active inline='centered' />
    </Segment>;
};

Wrapper.propTypes = {
    children: PropTypes.object,
    id: PropTypes.string,
    routes: PropTypes.array,
    token: PropTypes.string,
    tokenData: PropTypes.object,
    changeAccounts: PropTypes.func,
    changeUser: PropTypes.func
};

export default memo(Wrapper);
