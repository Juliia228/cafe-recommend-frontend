import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Button, Alert } from 'reactstrap';
import { useNavigate } from 'react-router';

import AdminAuthModal from '../../../widgets/AdminAuthModal/AdminAuthModal';
import Header from '../../../widgets/Header/Header';
import Menu from '../../../widgets/Menu/Menu';
import MenuItemCreate from './../../../widgets/MenuItemCreate/MenuItemCreate';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useSelector((state) => state.auth);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <div>Загрузка...</div>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <div>
        <Header isAdmin />

        <AdminAuthModal
          isOpen={authModalOpen}
          toggle={() => setAuthModalOpen(false)}
        />

        <Alert color="danger" className="text-center mt-3">
          У вас нет прав доступа к этой странице
        </Alert>
        <div className="text-center mt-3">
          <Button color="primary" onClick={() => navigate('/')}>
            На главную
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header isAdmin />
      <Alert color="info" className="mt-1">
        Это панель администратора. Здесь вы можете управлять системой.
      </Alert>

      <div className="p-4">
        <h3>
          Добро пожаловать, {user.firstName} {user.lastName}
        </h3>
        <p className="text-muted">Телефон: {user.phone}</p>
      </div>

      <div className="admin-content">
        <div className="container">
          <div className="row gap-3">
            <Button
              className="col"
              color="secondary"
              onClick={() => navigate('/discount')}
            >
              Проверка скидки
            </Button>

            <Button
              className="col"
              color="secondary"
              onClick={() => navigate('/admin/ingredients')}
            >
              Изменение ингредиентов
            </Button>
            <Button
              onClick={() => navigate('/admin/loyalty')}
              className="col"
              color="secondary"
            >
              Система лояльности
            </Button>
            <MenuItemCreate />
          </div>
        </div>
        <div className="mt-3">
          <Menu />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
