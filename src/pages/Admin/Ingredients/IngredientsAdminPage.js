import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import {
  Container,
  Button,
  Table,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Alert,
  Spinner,
  Row,
  Col,
} from 'reactstrap';
import { useSelector } from 'react-redux';

import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from '../../../utils/ingredientsApi';

import HeaderLogo from '../../../widgets/Header/Header';

const IngredientsAdminPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useSelector((state) => state.auth);

  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [newIngredientLabel, setNewIngredientLabel] = useState('');
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [editLabel, setEditLabel] = useState('');
  const [modal, setModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
      return;
    }
    fetchIngredients();
  }, [isAdmin, navigate]);

  const fetchIngredients = async () => {
    setLoading(true);
    setError(null);
    try {
      const ingredients = await getIngredients();
      setIngredients(
        ingredients || [
          { id: 1, label: '1 ингридиент' },
          { id: 2, label: '2 ингридиент' },
        ]
      );
    } catch (err) {
      setError(
        err.response?.data?.message || 'Не удалось загрузить ингредиенты'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = async () => {
    if (!newIngredientLabel.trim()) return;

    try {
      setError(null);
      const response = await createIngredient(newIngredientLabel.trim());

      setIngredients(response.data);
      setNewIngredientLabel('');
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось добавить ингредиент');
    }
  };

  const startEditing = (ingredient) => {
    setEditingIngredient(ingredient);
    setEditLabel(ingredient.label);
  };

  const handleUpdateIngredient = async () => {
    if (!editingIngredient || !editLabel.trim()) return;

    try {
      setError(null);
      const response = await updateIngredient(
        editingIngredient.id,
        editLabel.trim()
      );

      setIngredients(response.data);
      setEditingIngredient(null);
      setEditLabel('');
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось обновить ингредиент');
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setModal(true);
  };

  const handleDeleteIngredient = async () => {
    try {
      setError(null);
      await deleteIngredient(deleteId);
      setIngredients(ingredients.filter((item) => item.id !== deleteId));
      setModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Не удалось удалить ингредиент');
      setModal(false);
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

  return (
    <Container>
      <HeaderLogo />

      <h2 className="my-4" style={{ color: '#5d1700' }}>
        Управление ингредиентами
      </h2>

      {error && <Alert color="danger">{error}</Alert>}

      <FormGroup>
        <Label for="newIngredient">Добавить новый ингредиент</Label>
        <div className="d-flex">
          <Input
            id="newIngredient"
            value={newIngredientLabel}
            onChange={(e) => setNewIngredientLabel(e.target.value)}
            placeholder="Название ингредиента"
          />
          <Button
            color="primary"
            onClick={handleAddIngredient}
            className="ms-2"
          >
            Добавить
          </Button>
        </div>
      </FormGroup>

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

      {loading ? (
        <div className="text-center">
          <Spinner color="primary" />
          <p>Загрузка ингредиентов...</p>
        </div>
      ) : (
        <Table striped>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  {editingIngredient?.id === item.id ? (
                    <Input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                    />
                  ) : (
                    item.label
                  )}
                </td>
                <td>
                  {editingIngredient?.id === item.id ? (
                    <>
                      <Button
                        color="success"
                        size="sm"
                        onClick={handleUpdateIngredient}
                      >
                        Сохранить
                      </Button>
                      <Button
                        color="secondary"
                        size="sm"
                        onClick={() => setEditingIngredient(null)}
                        className="ms-2"
                      >
                        Отмена
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        color="warning"
                        size="sm"
                        onClick={() => startEditing(item)}
                      >
                        Изменить
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onClick={() => confirmDelete(item.id)}
                        className="ms-2"
                      >
                        Удалить
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal isOpen={modal} toggle={() => setModal(false)}>
        <ModalHeader toggle={() => setModal(false)}>
          Подтверждение удаления
        </ModalHeader>
        <ModalBody>Вы уверены, что хотите удалить этот ингредиент?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={handleDeleteIngredient}>
            Удалить
          </Button>
          <Button color="secondary" onClick={() => setModal(false)}>
            Отмена
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

export default IngredientsAdminPage;
