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
  FormText,
} from 'reactstrap';
import { getCategories, createDish } from '../../utils/dishesApi';
import { getIngredients } from '../../utils/ingredientsApi';

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
    name: '',
    price: '',
    category: '',
    ingredients: [],
    desc: '',
    season: 'default',
    enabled: true
  });

  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, ingredients] = await Promise.all([getCategories(), getIngredients()]);
        setCategories(categoriesData.categories);
        setIngredients(ingredients.ingredients);
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
    if (editModal) {
      setEditedItem({
        name: '',
        price: '',
        category: '',
        ingredients: [],
        desc: '',
        season: 'default',
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({
      ...editedItem,
      [name]: value,
    });
  };

  const handleIngredientChange = (ingredientId, isChecked) => {
    setEditedItem(prev => {
      if (isChecked) {
        // Добавляем ингредиент, если его еще нет в списке
        const ingredientToAdd = ingredients.find(ing => ing.id === ingredientId);
        if (!prev.ingredients.some(ing => ing.id === ingredientId) && ingredientToAdd) {
          return {
            ...prev,
            ingredients: [...prev.ingredients, { id: ingredientId, name: ingredientToAdd.name }]
          };
        }
      } else {
        // Удаляем ингредиент, если он есть в списке
        return {
          ...prev,
          ingredients: prev.ingredients.filter(ing => ing.id !== ingredientId)
        };
      }
      return prev;
    });
  };

  const handleSaveChanges = async () => {
    try {
      const result = await createDish(editedItem);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
    toggleEditModal();
  };

  return (
    <>
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
              <Label for="name">Название*</Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={editedItem.name}
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
              <Label>Ингредиенты*</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {ingredients?.map((ingredient) => (
                  <FormGroup check key={ingredient.id} style={{ minWidth: '120px' }}>
                    <Label check>
                      <Input
                        type="checkbox"
                        checked={editedItem.ingredients.some(ing => ing.id === ingredient.id)}
                        onChange={(e) => handleIngredientChange(ingredient.id, e.target.checked)}
                      />{' '}
                      {ingredient.name}
                    </Label>
                  </FormGroup>
                ))}
              </div>
              <FormText>Выберите один или несколько ингредиентов</FormText>
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
              !editedItem.name ||
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