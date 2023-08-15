import React, { useEffect, useRef, useState } from 'react';
import { Dropdown, Icon } from 'semantic-ui-react';
import QuestionLogo from './images/question.svg';
import Burger from './images/burger.svg';
import './wrapper.scss';
import PropTypes from 'prop-types';
import { langs } from './constants/viewConstants';
import Skeleton from './Skeleton';
import LocationsDropdown from './LocationsDropdown';

const Wrapper = ({
  id,
  isBurgerMenyVisible,
  user,
  changeUser,
  locale,
  changeLocale,
  availableAccounts,
  accountsDropdown,
  username,
  email,
  serviceAvailability,
  changeSidebarVisability,
  logout
}) => {
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

    const ref = useRef();

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsUserDropdownOpen(false);
        }
    };

    const DropdownIcon = (value) => (
        <div style={{ display: 'inline-block', float: 'right' }}>
            <span style={{ marginRight: '4px', color: 'gray' }}>{value.toUpperCase()}</span>
            <Icon style={{ float: 'right', margin: 0, marginRight: '-8px' }} name="angle right"/>
        </div>
    );

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
  
        return () => document.removeEventListener('click', handleClickOutside, true);
    }, []);

    const changeUserInfo = (name, value) => {
        if (user[name] !== value) {
            changeUser(name, value);
            setIsUserDropdownOpen(false);
        }
    };

    const { account, role, location } = user;

    const currentAccountInfo = availableAccounts[account];
    console.log('currentAccountInfo',currentAccountInfo)

    const roles = currentAccountInfo?.roles.map(role => {
        let order = null;
        switch (role.toLowerCase()) {
            case 'admin':
                order = 0; break;
            case 'billing':
                order = 1; break;
            case 'member':
                order = 2; break;
            default:
                order = null; break;
        }

        return {
            key: role,
            text: `${role}`,
            value: `${role}`,
            sortOrder: order,
        }
    })
    .filter(x => x.sortOrder !== null)
    .sort((a, b) => a.sortOrder - b.sortOrder);

    console.log(roles)

    const userDropdownClasses = ['ui', 'active', 'dropdown', 'user-dropdown'];
    const firstLevelMenuClasses = ['menu', 'transition', 'first-level'];

    if (isUserDropdownOpen) {
        userDropdownClasses.push('visible');
        firstLevelMenuClasses.push('visible');
    }

    const dynamicfilename = process.env.CP_VENDOR || 'icdc';
    const helpBaseUrl = `https://help.${process.env.CP_VENDOR || 'icdc'}.io`;
    const helpPath = id === 'home' ? '' : `/${id}/${locale}/Welcome.html`

    return (
      <header className='chrome-header'>
        { isBurgerMenyVisible && <img src={Burger}
                        style={{ color: 'white', cursor: 'pointer' }}
                        onClick={() => changeSidebarVisability()}
                        alt='Burger menu' /> }
        <a href={`${window.location.origin}/`} className='header-logo'>
            <img src={ require(`./images/${dynamicfilename}.svg`) } alt="ICDCLogo"/>
        </a>
        <div className='info-section'>
            <Dropdown className='question-dropdown' icon={<img src={QuestionLogo} />}>
                <Dropdown.Menu>
                    <Dropdown.Item>
                        <a href={helpBaseUrl + helpPath} target='_blank' style={{ color: 'black' }}>
                            Help & Asistance
                        </a>
                    </Dropdown.Item>
                    {/* { openHelpdesk && <Dropdown.Item onClick={() => openHelpdesk()}>Support</Dropdown.Item> } */}
                </Dropdown.Menu>
            </Dropdown>

            {
                currentAccountInfo ? <>
                    <LocationsDropdown
                        location={location}
                        currentAccountInfo={currentAccountInfo}
                        serviceAvailability={serviceAvailability}
                        changeUserInfo={(newLocation) => changeUserInfo('location', newLocation)}
                    />
                    <div ref={ref}
                        onClick={() => setIsUserDropdownOpen(prevState => !prevState)}
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
                                icon={DropdownIcon(account)}
                                closeOnChange
                            >
                                <Dropdown.Menu className='second-level'>
                                    { accountsDropdown.map(currentAccount => (
                                        <Dropdown.Item key={currentAccount.key}
                                            className={currentAccount.value === account ? 'current' : ''}
                                            onClick={() => changeUserInfo('account', currentAccount.value)}
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
                                icon={DropdownIcon(role)}
                                closeOnChange
                            >
                                <Dropdown.Menu className='second-level'>
                                    {
                                    (roles || []).map(currentRole => (
                                        <Dropdown.Item key={currentRole.value}
                                            className={currentRole.value === role ? 'current' : ''}
                                            onClick={() => changeUserInfo('role', currentRole.value)}>
                                                {currentRole.text}
                                        </Dropdown.Item>
                                    ))
                                    }
                                </Dropdown.Menu>
                            </Dropdown> }
                            <Dropdown.Divider />
                            <Dropdown text='Language'
                                pointing='right'
                                simple
                                className='link item lang'
                                icon={DropdownIcon(locale)}
                                closeOnChange
                            >
                                <Dropdown.Menu className='second-level'>
                                    {langs.map(lang => (
                                        <Dropdown.Item key={lang.value}
                                            className={lang.value === locale ? 'current' : ''}
                                            onClick={() => lang.value !== locale && changeLocale(lang.value)}>
                                                {lang.text}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
                        </div>
                    </div>
                </> : <Skeleton width='200px' />
            }
        </div>
      </header>
    );
};

Wrapper.propTypes = {
    id: PropTypes.string,
    changeAccounts: PropTypes.func,
    routes: PropTypes.array,
    locale: PropTypes.string,
    changeLang: PropTypes.func
};

export default Wrapper;
