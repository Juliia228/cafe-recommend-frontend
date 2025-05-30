import React, { useState } from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { useSelector } from 'react-redux';

import AdminAuthModal from '../AdminAuthModal/AdminAuthModal';
import LoginButton from '../LoginButton/LoginButton';

import logo from '../../shared/assets/logo.png';

function Header({ isAdmin }) {
  const [showModal, setShowModal] = useState(false);

  const { isAdmin: isAdminState } = useSelector((state) => state.auth);

  const toggle = () => setShowModal(!showModal);

  return (
    <>
      <Nav justified className="Nav">
        <NavItem>
          <a href="/">
            <img src={logo} alt="logo.png" style={{ height: '48px' }} />
          </a>
        </NavItem>
        <NavItem>
          {isAdmin && !isAdminState ? (
            <NavLink className="link" onClick={toggle}>
              Войти (админ)
            </NavLink>
          ) : (
            <LoginButton />
          )}
        </NavItem>
      </Nav>

      {isAdmin ? <AdminAuthModal isOpen={showModal} toggle={toggle} /> : null}
    </>
  );
}

export default Header;
