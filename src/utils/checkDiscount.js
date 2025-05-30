import apiClient from './apiClient';

export const checkDiscount = async (phone) => {
  try {
    const response = await apiClient.post('/check-discount', { phone });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при проверке скидки'
    );
  }
};
