import axios from 'axios';
import { BASE_URL } from './const';
import { store } from '../entities/store/store';
import { updateTokens, logout } from '../entities/slice/authSlice';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функция для обновления токенов
const refreshTokens = async () => {
  try {
    const { refreshToken } = store.getState().auth.tokens;

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Обновляем токены в хранилище Redux
    store.dispatch(
      updateTokens({
        accessToken,
        refreshToken: newRefreshToken,
      })
    );

    return accessToken;
  } catch (error) {
    // Если не удалось обновить токены, разлогиниваем пользователя
    store.dispatch(logout());
    window.location.href = '/';
    return null;
  }
};

apiClient.interceptors.request.use((config) => {
  const { accessToken } = store.getState().auth.tokens;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на обновление токенов
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshTokens();
      if (newAccessToken) {
        // Повторяем оригинальный запрос с новым токеном
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }
    }

    // Если ошибка не 401 или уже была попытка повтора
    if (error.response?.status === 401 && originalRequest._retry) {
      // Перенаправляем на страницу входа, если refresh не помог
      store.dispatch(logout());
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
