import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
  Row,
  Col,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import HeaderLogo from '../../shared/components/HeaderLogo/HeaderLogo';
import { loyaltyApi } from '../../utils/loyaltyService';

const LoyaltySystemPage = () => {
  const { isAdmin } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState({
    baseDiscount: 5,
    maxDiscount: 20,
    discountIncrement: 2,
    ordersThreshold: 3,
  });

  useEffect(() => {
    if (!isAdmin) return;

    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await loyaltyApi.getSettings();
        setSettings(data);
      } catch (err) {
        setError(err.message || 'Ошибка загрузки настроек');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
     const res = await loyaltyApi.updateSettings(settings);
    } catch (err) {
      setError(err.message || 'Ошибка сохранения настроек');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  if (!isAdmin) {
    return (
      <Container className="mt-5">
        <Alert color="danger" className="text-center">
          У вас нет прав доступа к этой странице
        </Alert>
        <div className="text-center mt-3">
          <Button color="primary" onClick={() => navigate('/')}>
            На главную
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <div>
      <HeaderLogo />
      <div className="m-4">
        <CardTitle tag="h4">Система лояльности</CardTitle>

        {error && <Alert color="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Начальная скидка (%)</Label>
            <Input
              type="number"
              name="baseDiscount"
              value={settings.baseDiscount}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </FormGroup>

          <FormGroup>
            <Label>Максимальная скидка (%)</Label>
            <Input
              type="number"
              name="maxDiscount"
              value={settings.maxDiscount}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </FormGroup>

          <FormGroup>
            <Label>Множитель скидки</Label>
            <Input
              type="number"
              name="discountIncrement"
              value={settings.discountIncrement}
              onChange={handleChange}
              min="0"
              step="0.1"
            />
          </FormGroup>

          <FormGroup>
            <Label>Порог заказов</Label>
            <Input
              type="number"
              name="ordersThreshold"
              value={settings.ordersThreshold}
              onChange={handleChange}
              min="1"
            />
          </FormGroup>
          <Row className="justify-content-center mt-4">
            <Col xs="auto">
              <Button color="primary" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </Col>
          </Row>

          <Row className="justify-content-center mt-4">
            <Col xs="auto">
              <Button
                color="light"
                onClick={() => navigate('/admin')}
                className="mb-4"
                style={{
                  color: '#5d1700',
                  fontWeight: 'bold',
                  padding: '10px 25px',
                }}
              >
                Вернуться в панель администратора
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default LoyaltySystemPage;
