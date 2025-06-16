import axios from 'axios';
import { BASE_URL } from '../config/config';

const api = axios.create({ baseURL: BASE_URL });

// Додає токен до кожного запиту, якщо він є в localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;