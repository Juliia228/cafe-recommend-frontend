import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
  Nav,
  NavItem,
  NavLink,
  Alert,
  Spinner,
  FormText,
} from 'reactstrap';

import { setAuthSuccess } from '../../entities/slice/authSlice';
import { forgotPassword, login, register } from './../../utils/authApi';

const AuthModal = ({ isOpen, toggle }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('login');
  const [consentChecked, setConsentChecked] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    firstName: '',
    lastName: '',
    code: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConsentChange = (e) => {
    setConsentChecked(e.target.checked);
  };

  const validateForm = () => {
    if (activeTab === 'login') {
      if (!formData.phone || !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
        setError('Введите корректный номер телефона');
        return false;
      }
      if (!formData.password || formData.password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        return false;
      }
      if (!consentChecked) {
        setError('Необходимо согласие на обработку данных');
        return false;
      }
    } else if (activeTab === 'register') {
      if (!formData.phone || !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
        setError('Введите корректный номер телефона');
        return false;
      }
      if (!formData.firstName || formData.firstName.length < 2) {
        setError('Имя должно содержать минимум 2 символа');
        return false;
      }
      if (!formData.lastName || formData.lastName.length < 2) {
        setError('Фамилия должна содержать минимум 2 символа');
        return false;
      }
      if (!formData.code || formData.code.length < 4) {
        setError('Код должен содержать 4 цифры');
        return false;
      }
      if (!formData.password || formData.password.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        return false;
      }
    } else if (activeTab === 'forgot') {
      if (!formData.phone || !/^\+?[0-9]{10,15}$/.test(formData.phone)) {
        setError('Введите корректный номер телефона');
        return false;
      }

      if (!formData.code || formData.code.length < 4) {
        setError('Код должен содержать 4 цифры');
        return false;
      }
      if (!formData.newPassword || formData.newPassword.length < 6) {
        setError('Пароль должен содержать минимум 6 символов');
        return false;
      }
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);
    try {
      let response;
      if (activeTab === 'login') {
        response = await login({
          login: formData.phone,
          password: formData.password,
        });
      } else if (activeTab === 'register') {
        response = await register({
          phone: formData.phone,
          firstName: formData.firstName,
          lastName: formData.lastName,
          keyWord: formData.code,
          password: formData.password,
        });
      } else if (activeTab === 'forgot') {
        response = await forgotPassword({
          phone: formData.phone,
          code: formData.code,
          newPassword: formData.newPassword,
        });
      }

      dispatch(
        setAuthSuccess({
          user: {
            phone: '123456789',
            firstName: 'firstName',
            lastName: 'lastName',
            sale: '15%',
          },
          token: {
            accessToken: 'accessToken',
            refreshToken: 'refreshToken',
          },
        })
      );
      toggle();
      setFormData({
        phone: '',
        password: '',
        firstName: '',
        lastName: '',
        code: '',
        newPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setConsentChecked(false);
      setFormData({
        phone: '',
        password: '',
        firstName: '',
        lastName: '',
        code: '',
        newPassword: '',
      });
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        <Nav tabs>
          <NavItem>
            <NavLink
              active={activeTab === 'login'}
              onClick={() => toggleTab('login')}
            >
              Вход
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={activeTab === 'register'}
              onClick={() => toggleTab('register')}
            >
              Регистрация
            </NavLink>
          </NavItem>
        </Nav>
      </ModalHeader>
      <Form onSubmit={onSubmit}>
        <ModalBody>
          {error && <Alert color="danger">{error}</Alert>}

          {activeTab === 'login' && (
            <>
              <FormGroup>
                <Label for="loginPhone">Номер телефона</Label>
                <Input
                  id="loginPhone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (999) 999-99-99"
                />
              </FormGroup>
              <FormGroup>
                <Label for="loginPassword">Пароль</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Пароль"
                />
              </FormGroup>
              <div className="text-right mb-3">
                <Button
                  color="link"
                  onClick={() => toggleTab('forgot')}
                  className="p-0"
                >
                  Забыли пароль?
                </Button>
              </div>

              <FormGroup check>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Input
                    type="checkbox"
                    id="consentCheckbox"
                    checked={consentChecked}
                    onChange={handleConsentChange}
                    style={{ marginRight: '16px' }}
                  />
                  <Label for="consentCheckbox" check>
                    Я согласен на обработку персональных данных
                  </Label>
                </div>
                <div>
                  {' '}
                  {/* 32px = ширина чекбокса + его отступ */}
                  <small className="text-muted">
                    Нажимая кнопку "Войти", вы даёте согласие на обработку ваших
                    персональных данных в соответствии с нашей{' '}
                    <a
                      href="/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Политикой конфиденциальности
                    </a>
                  </small>
                </div>
              </FormGroup>
            </>
          )}

          {activeTab === 'register' && (
            <>
              <FormGroup>
                <Label for="registerPhone">Номер телефона</Label>
                <Input
                  id="registerPhone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (999) 999-99-99"
                />
              </FormGroup>
              <FormGroup>
                <Label for="firstName">Имя</Label>
                <Input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Имя"
                />
              </FormGroup>
              <FormGroup>
                <Label for="lastName">Фамилия</Label>
                <Input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Фамилия"
                />
              </FormGroup>
              <FormGroup>
                <Label for="registerCode">Кодовое слово</Label>
                <Input
                  id="registerCode"
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Придумайте кодовое слово для восстановления пароля"
                />
              </FormGroup>
              <FormGroup>
                <Label for="registerPassword">Пароль</Label>
                <Input
                  id="registerPassword"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Пароль"
                />
              </FormGroup>
            </>
          )}

          {activeTab === 'forgot' && (
            <>
              <FormGroup>
                <Label for="forgotPhone">Номер телефона</Label>
                <Input
                  id="forgotPhone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+7 (999) 999-99-99"
                />
              </FormGroup>
              {
                <>
                  <FormGroup>
                    <Label for="forgotCode">Кодовое слово</Label>
                    <Input
                      id="forgotCode"
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder="Кодовое слово"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="newPassword">Новый пароль</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Новый пароль"
                    />
                  </FormGroup>
                </>
              }
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Отмена
          </Button>
          <Button color="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <Spinner size="sm" />
            ) : activeTab === 'login' ? (
              'Войти'
            ) : activeTab === 'register' ? (
              'Зарегистрироваться'
            ) : (
              'Сменить пароль'
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AuthModal;
