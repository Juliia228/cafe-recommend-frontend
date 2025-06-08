import apiClient from './apiClient';

// Получение списка ингредиентов
export const getIngredients = async () => {
  try {
    const response = await apiClient.get('/ingredient/get-all');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при загрузке ингредиентов'
    );
  }
};

// Создание нового ингредиента
export const createIngredient = async (name) => {
  try {
    const response = await apiClient.post('/ingredient/new', { name });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при создании ингредиента'
    );
  }
};

// Обновление ингредиента
export const updateIngredient = async (id, newLabel) => {
  try {
    const response = await apiClient.put(`/ingredient/edit`, {
      id,
      label: newLabel,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при обновлении ингредиента'
    );
  }
};

// Удаление ингредиента
export const deleteIngredient = async (id) => {
  try {
    const response = await apiClient.delete(`/ingredient/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при удалении ингредиента'
    );
  }
};

// Для обратной совместимости можно оставить экспорт по умолчанию
export default {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};
