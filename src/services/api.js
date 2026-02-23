import axios from 'axios';
import config from '../config/config';

const api = axios.create({
  baseURL: config.api.baseUrl,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // required for cookie-based auth
  timeout: config.api.timeout,
});

api.interceptors.request.use(
  (cfg) => {
    if (config.env.isDevelopment) {
      console.log(`🚀 ${cfg.method?.toUpperCase()} ${cfg.baseURL}${cfg.url}`);
    }
    return cfg;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;