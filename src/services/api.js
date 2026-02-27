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
    return cfg;
  },
  (error) => Promise.reject(error)
);

function handleSessionExpired() {
  if (!window.location.pathname.includes('/login')) {
    window.dispatchEvent(new Event('session:expired'));
  }
}

api.interceptors.response.use(
  (response) => {
    // .NET session timeout returns 200 with HTML redirect instead of 401
    const contentType = response.headers['content-type'] || '';
    if (contentType.includes('text/html')) {
      handleSessionExpired();
      return Promise.reject(new Error('Session expired'));
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      handleSessionExpired();
    }
    return Promise.reject(error);
  }
);

export default api;