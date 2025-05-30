import React from 'react';
import { Nav, NavItem } from 'reactstrap';

import logo from '../../assets/logo.png';

function HeaderLogo() {
  return (
    <Nav justified className="Nav">
      <NavItem>
        <a className="navbar-brand" href="/">
          <img src={logo} alt="logo.png" style={{ height: '48px' }} />
        </a>
      </NavItem>
    </Nav>
  );
}

export default HeaderLogo;
