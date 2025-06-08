import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardText,
  Alert,
  ListGroupItem,
  Collapse,
} from 'reactstrap';

import { getRecomendations } from '../../utils/recomendApi';

const menu = [
  {
    id: 1,
    title: 'Мозайка заливная',
    price: 250,
    category: 'Салаты и Холодные закуски',
    img: '',
    desc: 'ветчина, курица, мясо 35/50/5',
    inrgediens: [
      {
        label: 'ветчина',
        size: 35,
      },
      {
        label: 'курица',
        size: 50,
      },
      {
        label: 'мясо',
        size: 5,
      },
    ],
  },
  {
    id: 2,
    title: "Салат 'Новый'",
    price: 240,
    category: 'Салаты и Холодные закуски',
    img: '',
    desc: 'язык, ветчина, колбаса п/к, огурец св,маслины 125/10',
    inrgediens: [
      {
        label: 'язык',
        size: 125,
      },
      {
        label: 'ветчина',
        size: 20,
      },
      {
        label: 'колбаса п/к',
        size: 50,
      },
      {
        label: 'огурец',
        size: 15,
      },
      {
        label: 'маслины',
        size: 10,
      },
    ],
  },
  {
    id: 3,
    title: 'Бульон с фрикадельками',
    price: 140,
    category: 'Первые блюда',
    img: '',
    desc: 'фрикадельками, овощи',
    inrgediens: [
      {
        label: 'фрикадельками',
        size: 125,
      },
      {
        label: 'овощи',
        size: 20,
      },
    ],
  },
];

export default function Recomend() {
  const { user, isAdmin } = useSelector((state) => state.auth);

  const [recomend, setRecomend] = useState(menu);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openCategory, setOpenCategory] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Параллельная загрузка блюд
        const [dishesData] = await Promise.all([getRecomendations()]);

        setRecomend(dishesData?.recommendations);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка загрузки:', err);
      } finally {
        setLoading(false);
      }
    };

    user && fetchData();
  }, [user]);

  if (!user || isAdmin) {
    return null;
  }

  return (
    <div style={{ backgroundColor: 'white' }}>
      {loading && (
        <Alert color="info">
          <div className="loading">Загрузка рекомендаций...</div>
        </Alert>
      )}

      {/* {error && <Alert  color="danger">
      <div className="error">Ошибка: {error}</div>
    </Alert>}   */}

      <ListGroupItem className="p-0 border-0 mb-3">
        <div
          className="d-flex justify-content-between align-dishes-center p-3 category-header"
          style={{
            cursor: 'pointer',
            borderBottom: '1px solid #dee2e6',
          }}
          onClick={() => setOpenCategory(!openCategory)}
        >
          <h5 className="mb-0" style={{ color: '#5d1700', fontWeight: 'bold' }}>
            {'Рекомендованные блюда'}
          </h5>
          <span>{openCategory ? '−' : '+'}</span>
        </div>
        <Collapse isOpen={openCategory}>
          <div className="d-flex flex-wrap p-3">
            {recomend.map((c) => {
              const { id, name, price, ingredients } = c;
              const inrgedien = ingredients?.map((el) => el.name).join(', ');

              return (
                <Card
                  key={id}
                  style={{
                    width: '18rem',
                    position: 'relative',
                    margin: '0.5rem',
                    backgroundColor: '#FDEFD5',
                  }}
                  body
                  className="Card"
                >
                  <CardBody className="CardBody">
                    <CardTitle
                      tag="h4"
                      className="text"
                      style={{ color: '#5d1700' }}
                    >
                      {name}
                    </CardTitle>
                    <CardText style={{ color: '#5d1700' }}>
                      {inrgedien}
                    </CardText>
                    <CardSubtitle
                      className="text-muted"
                      style={{ color: '#5d1700' }}
                    >
                      {price} р
                    </CardSubtitle>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </Collapse>
      </ListGroupItem>
    </div>
  );
}
