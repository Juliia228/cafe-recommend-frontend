import apiClient from './apiClient';

export const loyaltyApi = {
  async getSettings() {
    try {
      const response = await apiClient.get('/loyalty');
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
      const response = await apiClient.put('/loyalty', settings);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          'Ошибка при сохранении настроек лояльности'
      );
    }
  },
};
