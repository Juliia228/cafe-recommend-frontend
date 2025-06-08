import { createSlice } from '@reduxjs/toolkit';

// Функция для загрузки начального состояния из localStorage
const loadInitialState = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const userData = localStorage.getItem('authUser');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return {
    user: userData ? JSON.parse(userData) : null,
    tokens: {
      accessToken: accessToken || null,
      refreshToken: refreshToken || null,
    },
    isAdmin: isAdmin || false,
    isLoading: false,
    error: null,
  };
};

const initialState = loadInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.isLoading = payload;
    },
    setAuthSuccess: (state, { payload }) => {

      state.user = payload.user;
      state.tokens = {
        accessToken: payload?.token?.accessToken,
        refreshToken: payload?.token?.refreshToken,
      };
      state.isAdmin = payload.isAdmin || false;
      state.error = null;

      // Сохраняем данные в localStorage
      localStorage.setItem('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
      localStorage.setItem('authUser', JSON.stringify(payload.user));
      localStorage.setItem('isAdmin', payload.isAdmin || false);
    },
    updateTokens: (state, { payload }) => {
      state.tokens = {
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
      };

      // Обновляем токены в localStorage
      localStorage.setItem('accessToken', payload.accessToken);
      localStorage.setItem('refreshToken', payload.refreshToken);
    },
    setAuthFailure: (state, { payload }) => {
      state.error = payload;
      // Очищаем localStorage при ошибке аутентификации
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('isAdmin');
    },
    logout: (state) => {
      state.user = null;
      state.tokens = {
        accessToken: null,
        refreshToken: null,
      };
      state.isAdmin = false;
      // Очищаем localStorage при выходе
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authUser');
      localStorage.removeItem('isAdmin');
    },
  },
});

export const {
  setLoading,
  setAuthSuccess,
  updateTokens,
  setAuthFailure,
  logout,
} = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectAccessToken = (state) => state.auth.tokens.accessToken;
export const selectRefreshToken = (state) => state.auth.tokens.refreshToken;

export default authSlice.reducer;
