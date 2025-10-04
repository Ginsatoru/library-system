import axios from 'axios';
import config from '../config/config';

// Get API base URL from config
const API_BASE_URL = config.api.baseUrl;

console.log('🌐 API Base URL:', API_BASE_URL);

// Create axios instance with cookie support
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CRITICAL: This enables cookies to be sent/received
  timeout: config.api.timeout,
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });

      switch (error.response.status) {
        case 401:
          console.error('Unauthorized. Please login again.');
          // Don't auto-redirect if we're already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;
        case 403:
          console.error('Access denied.');
          break;
        case 500:
          console.error('Server error. Please try again later.');
          break;
        default:
          console.error('An error occurred:', error.response.data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response from server:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
        }
      });

      // Check if it's a CORS or SSL error
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_SSL_PROTOCOL_ERROR') {
        console.error('⚠️ Network/CORS Error - Possible causes:');
        console.error('1. Backend server is not running');
        console.error('2. CORS is not configured on backend');
        console.error('3. Using HTTPS instead of HTTP (or vice versa)');
        console.error('4. Wrong port number');
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

export default api;