import axios from 'axios';
import config from '../config/config';
import authService from './authServices';

const api = axios.create({
  baseURL: config.api.baseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: config.api.timeout,
});

api.interceptors.request.use(
  (cfg) => cfg,
  (error) => Promise.reject(error)
);

function handleSessionExpired() {
  const isLoggedIn = authService.isAuthenticated();
  const onAuthPage = ['/login', '/register', '/forgot-password', '/reset-password']
    .some((p) => window.location.pathname.startsWith(p));

  if (isLoggedIn && !onAuthPage) {
    window.dispatchEvent(new Event('session:expired'));
  }
}

api.interceptors.response.use(
  (response) => {
    if (response.config?.silentAuth) return response;
    const contentType = response.headers['content-type'] || '';
    if (contentType.includes('text/html')) {
      handleSessionExpired();
      return Promise.reject(new Error('Session expired'));
    }
    return response;
  },
  (error) => {
    if (error.config?.silentAuth) return Promise.reject(error);
    const status = error.response?.status;
    if (status === 401) {
      handleSessionExpired();
    }
    return Promise.reject(error);
  }
);

export default api;