import React from 'react';
import { withRouter } from 'react-router-dom';
import { Sidebar, Menu, Dropdown } from 'semantic-ui-react';
import Home from './images/home.svg';
import Homepage from './images/homepage.svg';

class RenderSidebar extends React.Component {
    splitAndGet = (string) => string.split('/')[1];

    state = {
        activeItem: this.splitAndGet(this.props.history.location.pathname)
    };

    changeItem = (route) => {
        const { changeApp } = this.props;
        this.setState({ activeItem: this.splitAndGet(route) });
        changeApp(route);
    };

    findActiveItem = (routes) => routes.find(route => route.to ? this.splitAndGet(route.to) === this.state.activeItem : this.findActiveItem(route.routes));

    componentDidMount() {
        const { routes } = this.props;
        if (!this.findActiveItem(routes)) {
            this.setState({ activeItem: this.splitAndGet(routes[0].to || routes[0].routes[0].to) });
        }
    };

    renderSidebarItem = (route, key) => {
        const { activeItem } = this.state;

        return <div
            key={key}
            onClick={() => this.changeItem(route.to)}
            className={ (activeItem === this.splitAndGet(route.to) ? 'active ' : '') + 'item'}
            style={{ fontSize: '15px', cursor: 'pointer' }}>
            {route.title}
        </div>;
    };

    render() {
        const { name, routes, visible, isAvailable, servicesInLocations } = this.props;

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
                        <div onClick={() => this.changeItem(routes[0].to || routes[0].routes[0].to)}>
                            <img src={Home} alt='Home' />
                        </div>
                    </Menu.Item>
                    <Menu.Item className='sidebar_logo_text' style={{ color: 'white' }}>
                        <Dropdown
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
                                <a href='https://cloud.icdc.io/home'>
                                    <Dropdown.Item {...homepage} />
                                </a>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                </Menu>
                { isAvailable && routes.map((route, key) => route.to ? this.renderSidebarItem(route, key) : <div key={key}>
                    {route.title}
                    {route.routes.map((child, index) => this.renderSidebarItem(child, index))}
                </div>)}
            </Sidebar>
        );
    };
};

export default withRouter(RenderSidebar);
