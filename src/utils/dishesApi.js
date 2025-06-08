import apiClient from './apiClient';
import { store } from '../entities/store/store';


export const getDishes = async () => {
  try {
    const response = await apiClient.get('/dish/get-all', {
      params: {
        withIngredients: true,
        onlyEnabled: true
      }
    });
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
    const response = await apiClient.post('/dish/new', dishData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при создании блюда'
    );
  }
};

export const updateDish = async (id, dishData) => {
  try {
    const response = await apiClient.put(`/dish/edit`, dishData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при обновлении блюда'
    );
  }
};

export const deleteDish = async (id) => {
  try {
    const response = await apiClient.delete(`/dish/delete${id}`);
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
