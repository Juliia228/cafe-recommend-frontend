import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'reactstrap';
import { useNavigate } from 'react-router';

import AuthModal from '../AuthModal/AuthModal';
import ProfileModal from '../Profile/ProfileModal';
import { logout } from '../../entities/slice/authSlice';

const AuthButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAdmin } = useSelector((state) => state.auth);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    if (isAdmin) {
      navigate('/admin');
    }
  };

  if (isAdmin) {
    return (
      <NavLink className="link" onClick={handleLogout}>
        Выйти (Админ)
      </NavLink>
    );
  }

  return (
    <>
      {user ? (
        <NavLink className="link" onClick={() => setProfileModalOpen(true)}>
          Профиль
        </NavLink>
      ) : (
        <NavLink className="link" onClick={() => setAuthModalOpen(true)}>
          Войти
        </NavLink>
      )}

      <AuthModal
        isOpen={authModalOpen}
        toggle={() => setAuthModalOpen(false)}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        toggle={() => setProfileModalOpen(false)}
      />
    </>
  );
};

export default AuthButton;
