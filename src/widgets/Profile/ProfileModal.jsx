import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
} from 'reactstrap';
import { updateProfile } from '../../utils/authApi';
import {
  setLoading,
  setAuthSuccess,
  setAuthFailure,
  logout,
} from '../../entities/slice/authSlice';

const ProfileModal = ({ isOpen, toggle }) => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    phone: user?.phone || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    sale: user?.sale || '15%',
  });

  useEffect(() => {
    setFormData({
      phone: user?.phone || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      sale: user?.sale || '15%',
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.phone || !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
      dispatch(setAuthFailure('Введите корректный номер телефона'));
      return false;
    }
    if (!formData.firstName || formData.firstName.length < 2) {
      dispatch(setAuthFailure('Имя должно содержать минимум 2 символа'));
      return false;
    }
    if (!formData.lastName || formData.lastName.length < 2) {
      dispatch(setAuthFailure('Фамилия должна содержать минимум 2 символа'));
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(setAuthFailure(null));

    if (!validateForm()) return;

    dispatch(setLoading(true));
    try {
      const response = await updateProfile({
        userData: formData,
        token,
      });

      dispatch(
        setAuthSuccess({
          user: response.user,
        })
      );
      toggle();
    } catch (err) {
      dispatch(
        setAuthFailure(err.response?.data?.message || 'Произошла ошибка')
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    toggle();
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Профиль</ModalHeader>
      <Form onSubmit={onSubmit}>
        <ModalBody>
          {error && <Alert color="danger">{error}</Alert>}

          <FormGroup>
            <Label for="profilePhone">Номер телефона</Label>
            <Input
              id="profilePhone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+7 (999) 999-99-99"
            />
          </FormGroup>
          <FormGroup>
            <Label for="profileFirstName">Имя</Label>
            <Input
              id="profileFirstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Имя"
            />
          </FormGroup>
          <FormGroup>
            <Label for="profileLastName">Фамилия</Label>
            <Input
              id="profileLastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Фамилия"
            />
          </FormGroup>
          <FormGroup>
            <Label for="profileSale">Размер скидки</Label>
            <Input
              id="profileSale"
              type="text"
              name="Sale"
              value={formData.sale}
              onChange={handleChange}
              placeholder="Размер скидки"
              disabled
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleLogout}>
            Выйти
          </Button>
          <Button color="secondary" onClick={toggle}>
            Отмена
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner size="sm" /> : 'Сохранить'}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ProfileModal;
