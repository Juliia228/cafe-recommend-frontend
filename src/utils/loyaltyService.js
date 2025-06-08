import apiClient from './apiClient';

export const loyaltyApi = {
  async getSettings() {
    try {
      const response = await apiClient.get('/loyalty-program/settings');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          'Ошибка при загрузке настроек лояльности'
      );
    }
  },

  async updateSettings(settings) {
    try {
      const response = await apiClient.post('/loyalty-program/settings/update', settings);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          'Ошибка при сохранении настроек лояльности'
      );
    }
  },
};
