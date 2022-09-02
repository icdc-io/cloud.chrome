import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Sidebar, Menu, Dropdown } from 'semantic-ui-react';
import Home from './images/home.svg';
import Homepage from './images/homepage.svg';
import Skeleton from './Skeleton';
import External from './images/external.svg';

const RenderSidebar = ({
    routes,
    changeApp,
    name,
    visible,
    isAvailable,
    servicesInLocations,
    history
}) => {
    const splitAndGet = (string) => string.split('/')[1];

    const [activeItem, setActiveItem] = useState(splitAndGet(history.location.pathname));

    const changeItem = (route) => {
        setActiveItem(splitAndGet(route));
        changeApp(route);
    };

    const findActiveItem = (routes) => routes.find(route => route.to ? splitAndGet(route.to) === activeItem : findActiveItem(route.routes));

    useEffect(() => {
        if (!findActiveItem(routes)) {
            setActiveItem(splitAndGet(routes[0].to || routes[0].routes[0].to));
        }
    }, []);

    const renderSidebarItem = (route, key) => {
        if (!servicesInLocations) return <Skeleton key={key} className='aside-skeleton' width='200px' />;

        const isExternalLink = route.to.startsWith('http');

        if (isExternalLink) {
            return <a key={key} href={route.to} target='_blank' className='item'>
                <span>{route.title}</span>
                <img src={External} alt="External link" />
            </a>
        }

        return <div
            key={key}
            onClick={() => changeItem(route.to)}
            className={ (activeItem === splitAndGet(route.to) ? 'active ' : '') + 'item'}>
                { route.title }
        </div>
    };

    const homepage = {
        text: 'Home',
        value: 'home',
        image: {
            src: Homepage
        }
    };

    return (
        <Sidebar as={Menu} visible={visible} animation='overlay' vertical inverted style={{ overflow: 'hidden' }}>
            <Menu inverted className='sidebar_top'>
                <Menu.Item className='sidebar_home_link'>
                    <div onClick={() => changeItem(routes[0].to || routes[0].routes[0].to)}>
                        <img src={Home} alt='Home' />
                    </div>
                </Menu.Item>
                <Menu.Item className='sidebar_logo_text' style={{ color: 'white' }}>
                    { servicesInLocations ? <Dropdown
                        value={name}
                        options={servicesInLocations}
                        className='services'
                        // scrolling
                    >
                        <Dropdown.Menu>
                            {servicesInLocations.map(service => <a key={service.key} href={service.url || '#'} className={service.className} target={service.className === 'external' ? '_blank' : '_self'}>
                                    <Dropdown.Item {...service} />
                                </a>)}
                            <Dropdown.Divider />
                            <a href={`${window.location.origin}/`}>
                                <Dropdown.Item {...homepage} />
                            </a>
                        </Dropdown.Menu>
                    </Dropdown> : <Skeleton width='160px' /> }
                </Menu.Item>
            </Menu>
            <div className='remote-app-routes'>
                { isAvailable && routes.map((route, key) => route.to ? renderSidebarItem(route, key) : <div key={key}>
                    {route.title}
                    {route.routes.map((child, index) => renderSidebarItem(child, index))}
                </div>)}
            </div>
        </Sidebar>
    );
};

export default withRouter(RenderSidebar);
