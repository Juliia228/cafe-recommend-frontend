import apiClient from './apiClient';

export const getRecomendations = async () => {
  try {
    const response = await apiClient.post('/recomendations');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка получения рекомендованных блюд'
    );
  }
};
