import apiClient from './apiClient';

export const getDishes = async () => {
  try {
    const response = await apiClient.get('/dish/get-all');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при загрузке блюд'
    );
  }
};

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/dish/all-categories');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при загрузке категорий'
    );
  }
};

export const createDish = async (dishData) => {
  try {
    const response = await apiClient.post('/dishes', dishData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при создании блюда'
    );
  }
};

export const updateDish = async (id, dishData) => {
  try {
    const response = await apiClient.put(`/dishes/${id}`, dishData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при обновлении блюда'
    );
  }
};

export const deleteDish = async (id) => {
  try {
    const response = await apiClient.delete(`/dishes/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при удалении блюда'
    );
  }
};

export default {
  getDishes,
  getCategories,
  createDish,
  updateDish,
  deleteDish,
};
