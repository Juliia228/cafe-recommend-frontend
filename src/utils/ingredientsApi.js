import apiClient from './apiClient';

// Получение списка ингредиентов
export const getIngredients = async () => {
  try {
    const response = await apiClient.get('/ingredients');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при загрузке ингредиентов'
    );
  }
};

// Создание нового ингредиента
export const createIngredient = async (label) => {
  try {
    const response = await apiClient.post('/ingredients', { label });
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
    const response = await apiClient.put(`/ingredients/${id}`, {
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
    const response = await apiClient.delete(`/ingredients/${id}`);
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
