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
    const response = await apiClient.post('auth/log-in', { login, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Ошибка при входе');
  }
};

export const forgotPassword = async ({ phone, code, newPassword }) => {
  try {
    const response = await apiClient.post('auth/reset-password', {
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
    const response = await apiClient.get('user');
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Ошибка при получении профиля'
    );
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await apiClient.put('user/edit', userData);
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
