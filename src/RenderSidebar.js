import React from 'react';
import { withRouter } from 'react-router-dom';
import { Sidebar, Menu, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Home from './home.svg';

class RenderSidebar extends React.Component {
  render() {
    const { routes, history, visible } = this.props;

    const activeItem = history.location.pathname.split('/')[1];

    return (
      <Sidebar as={Menu} visible={visible} animation='overlay' vertical inverted style={{ overflow: 'hidden' }}>
          <Menu inverted className='sidebar_top'>
              <Menu.Item className='sidebar_home_link'>
                  <a href='https://icdc.io/' target='_blank'>
                      <img src={Home} alt='Home' />
                  </a>
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
    )
  }
};

export default withRouter(RenderSidebar);
