import apiClient from './apiClient';

export const login = async ({ login, password }) => {
  try {
    const response = await apiClient.post('auth/log-in/admin', { login, password });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при входе администратора'
    );
  }
};

export const getProfile = async () => {
  try {
    const response = await apiClient.get('/profile');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        'Ошибка при получении профиля администратора'
    );
  }
};

export default {
  login,
  getProfile,
};
