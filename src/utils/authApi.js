import apiClient from './apiClient';

export const register = async (userData) => {
  try {
    const response = await apiClient.post('auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка при регистрации');
  }
};

export const login = async ({ login, password }) => {
  try {
    const response = await apiClient.post('user/log-in', { login, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка при входе');
  }
};

export const forgotPassword = async ({ phone, code, newPassword }) => {
  try {
    const response = await apiClient.post('/forgot-password', {
      phone,
      code,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при восстановлении пароля'
    );
  }
};

export const getProfile = async () => {
  try {
    const response = await apiClient.get('/me');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при получении профиля'
    );
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await apiClient.put('/me', userData);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при обновлении профиля'
    );
  }
};

export default {
  register,
  login,
  forgotPassword,
  getProfile,
  updateProfile,
};
