import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaPlus } from 'react-icons/fa';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import { getCategories, updateDish } from '../../utils/dishesApi';

const seasons = [
  { _id: 'default', name: 'Любой' },
  { _id: 'winter', name: 'Зима' },
  { _id: 'spring', name: 'Весна' },
  { _id: 'summer', name: 'Лето' },
  { _id: 'autumn', name: 'Осень' },
];

export default function MenuItemCreate() {
  const [editModal, setEditModal] = useState(false);
  const [editedItem, setEditedItem] = useState({
    title: '',
    price: '',
    category: '',
    ingredients: [],
    desc: '',
    season: 'default',
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Параллельная загрузка блюд и категорий
        const [categoriesData] = await Promise.all([getCategories()]);
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

  const toggleEditModal = () => {
    setEditModal(!editModal);
    // Сброс формы при закрытии
    if (editModal) {
      setEditedItem({
        title: '',
        price: '',
        category: '',
        ingredients: [],
        desc: '',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({
      ...editedItem,
      [name]:
        name === 'ingredients'
          ? value.split(',').map((item) => ({ label: item.trim() }))
          : value,
    });
  };

  const handleSaveChanges = async () => {
    // Здесь должна быть логика сохранения нового блюда
    // Например: dispatch(createMenuItem(editedItem));
    console.log('New dish data:', editedItem);

    try {
      const result = await updateDish(editedItem);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    // После успешного сохранения можно закрыть модальное окно
    toggleEditModal();
  };

  return (
    <>
      {/* Кнопка для создания нового блюда */}
      <Button color="primary" onClick={toggleEditModal} className="col">
        <FaPlus className="mr-2" /> Добавить новое блюдо
      </Button>

      <Modal isOpen={editModal} toggle={toggleEditModal} size="lg">
        <ModalHeader toggle={toggleEditModal}>
          Создание нового блюда
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="title">Название*</Label>
              <Input
                type="text"
                name="title"
                id="title"
                value={editedItem.title}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="price">Цена*</Label>
              <Input
                type="number"
                name="price"
                id="price"
                value={editedItem.price}
                onChange={handleInputChange}
                required
                min="0"
              />
            </FormGroup>
            <FormGroup>
              <Label for="category">Категория*</Label>
              <Input
                type="select"
                name="category"
                id="category"
                value={editedItem.category}
                onChange={handleInputChange}
                required
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
              <Label for="season">Сезон*</Label>
              <Input
                type="select"
                name="season"
                id="season"
                value={editedItem.season}
                onChange={handleInputChange}
                required
              >
                <option value="">Выберите категорию</option>
                {seasons?.map((season) => (
                  <option key={season._id} value={season._id}>
                    {season.name}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="ingredients">Ингредиенты (через запятую)*</Label>
              <Input
                type="text"
                name="ingredients"
                id="ingredients"
                value={editedItem.ingredients.map((el) => el.label).join(', ')}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="desc">Описание</Label>
              <Input
                type="textarea"
                name="desc"
                id="desc"
                value={editedItem.desc}
                onChange={handleInputChange}
                rows={4}
              />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={handleSaveChanges}
            disabled={
              loading ||
              !editedItem.title ||
              !editedItem.price ||
              !editedItem.category ||
              !editedItem.ingredients.length
            }
          >
            {loading ? 'Сохранение...' : 'Создать блюдо'}
          </Button>{' '}
          <Button color="secondary" onClick={toggleEditModal}>
            Отмена
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
