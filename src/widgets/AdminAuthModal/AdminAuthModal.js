import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
} from 'reactstrap';

import { setAuthSuccess } from '../../entities/slice/authSlice';
import { login } from '../../utils/adminApi';

const AdminAuthModal = ({ isOpen, toggle }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login({login: phone, password});

      dispatch(
        setAuthSuccess({
          user: result.user,
          token: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
          },
          isAdmin: result.user?.role?.find((el)=>el === 'ADMIN'),
        })
      );
      toggle();
      setPassword('');
      setPhone('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Вход Администратора</ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="phone">Номер телефона</Label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Введите номер телефона"
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">пароль</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </FormGroup>
          <Button color="primary" block disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" /> Загрузка...
              </>
            ) : (
              'Войти'
            )}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AdminAuthModal;
