import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaEdit, FaBan } from 'react-icons/fa';
import {
  Card,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardText,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  ListGroup,
  ListGroupItem,
  Collapse,
  Alert,
} from 'reactstrap';

import {
  getDishes,
  getCategories,
  createDish,
  updateDish,
  deleteDish,
} from '../../utils/dishesApi';
import Recomend from '../Recomend/Recomend';

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

export default function MenuItems() {
  const { isAdmin } = useSelector((state) => state.auth);

  const [editModal, setEditModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [editedItem, setEditedItem] = useState(null);
  const [openCategories, setOpenCategories] = useState({});

  const [dishes, setDishes] = useState(menu);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Параллельная загрузка блюд и категорий
        const [dishesData, categoriesData] = await Promise.all([
          getDishes(),
          getCategories(),
        ]);
console.log('dishesData',dishesData)
        setDishes(dishesData.dishes);
        setCategories(categoriesData.categories);
      } catch (err) {
        setError(err.message);
        console.error('Ошибка загрузки:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleEditModal = () => setEditModal(!editModal);
  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  // Группируем элементы по категориям
  const groupedItems = dishes.reduce((acc, item) => {
    const category = item.category || 'Без категории';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);

    return acc;
  }, {});

  console.log('groupedItems',groupedItems)

  const handleEditClick = (item) => {
    setCurrentItem(item);
    setEditedItem({ ...item });
    toggleEditModal();
  };

  const handleRemoveClick = async (item) => {
    setLoading(true);
    setError(null);

    try {
      const response = await deleteDish(item.id);
      setDishes(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({
      ...editedItem,
      [name]:
        name === 'inrgediens'
          ? value.split(',').map((item) => ({ label: item.trim() }))
          : value,
    });
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await updateDish(editedItem.id, { ...editedItem });
      setDishes(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    toggleEditModal();
  };

  return (
    <div className="shopping-cart" id={'Menu'}>
      {loading && (
        <Alert color="info">
          <div className="loading">Загрузка меню...</div>
        </Alert>
      )}

      {error && (
        <Alert color="danger">
          <div className="error">Ошибка: {error}</div>
        </Alert>
      )}

      <Recomend />

      {Object.keys(groupedItems).length ? (
        <ListGroup>
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <ListGroupItem key={category} className="p-0 border-0 mb-3">
              <div
                className="d-flex justify-content-between align-dishes-center p-3 category-header"
                style={{
                  // backgroundColor: "#f8f9fa",
                  cursor: 'pointer',
                  borderBottom: '1px solid #dee2e6',
                }}
                onClick={() => toggleCategory(category)}
              >
                <h5
                  className="mb-0"
                  style={{ color: '#5d1700', fontWeight: 'bold' }}
                >
                  {category}
                </h5>
                <span>{openCategories[category] ? '+' : '-'}</span>
              </div>
              <Collapse isOpen={!openCategories[category]}>
                <div className="d-flex flex-wrap p-3">
                  {categoryItems.map((c) => {
                    const { id, title, price, inrgediens, img, desc } = c;
                    const inrgedien = inrgediens
                      .map((el) => el.label)
                      .join(', ');

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
                        {isAdmin && (
                          <>
                            <FaEdit
                              style={{
                                position: 'absolute',
                                bottom: '15px',
                                right: '15px',
                                cursor: 'pointer',
                                color: '#007bff',
                                fontSize: '1.5rem',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                zIndex: 5,
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = 'scale(1.1)')
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = 'scale(1)')
                              }
                              onClick={() => handleEditClick(c)}
                            />

                            <FaBan
                              style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                cursor: 'pointer',
                                color: 'red',
                                fontSize: '1.5rem',
                                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                zIndex: 5,
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = 'scale(1.1)')
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = 'scale(1)')
                              }
                              onClick={() => handleRemoveClick(c)}
                            />
                          </>
                        )}
                        <CardBody className="CardBody">
                          {img && (
                            <img
                              src={img}
                              alt={title}
                              style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover',
                                marginBottom: '1rem',
                                borderRadius: '4px',
                              }}
                            />
                          )}
                          <CardTitle
                            tag="h4"
                            className="text"
                            style={{ color: '#5d1700' }}
                          >
                            {title}
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
          ))}
        </ListGroup>
      ) : (
        <div style={{ margin: '2rem auto' }}>
          Что-то пошло не так. \n Перезагрузите страницу
        </div>
      )}

      {/* Модальное окно редактирования */}
      <Modal isOpen={editModal} toggle={toggleEditModal} size="lg">
        <ModalHeader toggle={toggleEditModal}>Редактирование блюда</ModalHeader>
        <ModalBody>
          {currentItem && (
            <Form>
              <FormGroup>
                <Label for="title">Название</Label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={editedItem?.title || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="price">Цена</Label>
                <Input
                  type="number"
                  name="price"
                  id="price"
                  value={editedItem?.price || ''}
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="category">Категория</Label>
                <Input
                  type="select"
                  name="category"
                  id="category"
                  value={editedItem?.category || ''}
                  onChange={handleInputChange}
                >
                  <option value="">Выберите категорию</option>
                  {categories?.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="inrgediens">Ингредиенты (через запятую)</Label>
                <Input
                  type="text"
                  name="inrgediens"
                  id="inrgediens"
                  value={
                    editedItem?.inrgediens?.map((el) => el.label).join(', ') ||
                    ''
                  }
                  onChange={handleInputChange}
                />
              </FormGroup>
              <FormGroup>
                <Label for="desc">Описание</Label>
                <Input
                  type="textarea"
                  name="desc"
                  id="desc"
                  value={editedItem?.desc || ''}
                  onChange={handleInputChange}
                  rows={4}
                />
              </FormGroup>
            </Form>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSaveChanges}>
            Сохранить
          </Button>{' '}
          <Button color="secondary" onClick={toggleEditModal}>
            Отмена
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
