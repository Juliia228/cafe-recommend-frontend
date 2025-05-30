import { useNavigate } from 'react-router';
import { Button, Container } from 'reactstrap';

export default function PageNotFound() {
  const navigate = useNavigate();

  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: '80vh' }}
    >
      <h1 className="display-1 text-muted">404</h1>
      <h2 className="mb-4">Страница не найдена</h2>
      <p className="lead text-center mb-4">
        Запрашиваемая страница не существует или была перемещена
      </p>
      <Button color="primary" onClick={() => navigate('/')}>
        Вернуться на главную
      </Button>
    </Container>
  );
}
