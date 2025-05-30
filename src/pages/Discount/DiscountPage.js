import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Spinner,
  Row,
  Col,
  Container,
} from 'reactstrap';
import HeaderLogo from '../../shared/components/HeaderLogo/HeaderLogo';
import { checkDiscount } from './../../utils/checkDiscount';

const DiscountPage = () => {
  const [phone, setPhone] = useState('');
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { isAdmin } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await checkDiscount(phone);

      setDiscount(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  //Вернуться в панель администратора

  return (
    <>
      <HeaderLogo />
      <div
        style={{
          // backgroundColor: "#5d1700",
          minHeight: '100vh',
          padding: '2rem 0',
          color: '#fff',
        }}
      >
        <Container>
          <Row className="justify-content-center">
            <Col
              md="6"
              className="p-4"
              style={{
                //   backgroundColor: "#5d1700",
                backgroundColor: '#fbe9c6',
                borderRadius: '10px',
                backdropFilter: 'blur(5px)',
              }}
            >
              <h2 className="mb-4 text-center" style={{ color: '#5d1700' }}>
                Проверка скидки
              </h2>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="phone" style={{ color: '#5d1700' }}>
                    Введите номер телефона
                  </Label>
                  <Input
                    type="tel"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder=""
                    required
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      border: 'none',
                    }}
                  />
                </FormGroup>

                <Row className="justify-content-center mt-4">
                  <Col xs="auto">
                    <Button
                      disabled={loading}
                      style={{
                        fontWeight: 'bold',
                        padding: '10px 25px',
                        color: '#fff',
                        backgroundColor: '#5d1700',
                      }}
                    >
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Проверяем...
                        </>
                      ) : (
                        'Проверить скидку'
                      )}
                    </Button>
                  </Col>
                </Row>
              </Form>

              {error && (
                <Alert color="danger" className="mt-3">
                  {error}
                </Alert>
              )}

              {discount !== null && (
                <Alert color="success" className="mt-3 text-center">
                  Ваша скидка: <strong>{discount}%</strong>
                </Alert>
              )}
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
        </Container>
      </div>
    </>
  );
};

export default DiscountPage;
