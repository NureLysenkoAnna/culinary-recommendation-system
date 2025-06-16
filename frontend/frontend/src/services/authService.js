
import api from '../api/api';

// Реєстрація нового користувача
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  const { token, user } = response.data;

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return user;
};

// Вхід користувача
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  const { token, user } = response.data;

  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return user;
};

// Вихід користувача
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Отримати токен
export const getToken = () => {
  return localStorage.getItem('token');
};

// Отримати дані користувача
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Перевірити, чи користувач авторизований
export const isAuthenticated = () => {
  return !!getToken();
};
