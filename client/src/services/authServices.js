import api from './api';

export const authService = {
  /**
   * Login user with username and password
   * @param {Object} credentials - { username: string, password: string, rememberMe: boolean }
   * @returns {Promise} Response data
   */
  login: async (credentials) => {
    try {
      // Using the NEW API endpoint that returns JSON
      const response = await api.post('/api/account/login', {
        userName: credentials.username,
        password: credentials.password,
        rememberMe: credentials.rememberMe || false,
      });

      console.log('Login response:', response);

      // The API now returns JSON with { success: true/false, message: string, user: object }
      if (response.data && response.data.success === true) {
        // Store user info
        const userInfo = {
          username: response.data.user.username,
          isAuthenticated: true,
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        return { success: true, data: userInfo };
      }

      // Login failed - backend returned success: false
      return { 
        success: false, 
        message: response.data?.message || 'Invalid username or password' 
      };

    } catch (error) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid username or password';
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid request. Please check your input.';
      }

      return { 
        success: false, 
        message: errorMessage 
      };
    }
  },

  /**
   * Register a new user
   * @param {Object} userData - Registration data
   * @returns {Promise} Response data
   */
  register: async (userData) => {
    try {
      console.log('Attempting registration with:', {
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      // Using the NEW API endpoint that returns JSON
      const response = await api.post('/api/account/register', {
        userName: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        roleName: userData.roleName || 'User',
      });

      console.log('Registration response:', response);

      // The API returns JSON with { success: true/false, message: string, user: object }
      if (response.data && response.data.success === true) {
        // Store user info (backend auto-logs in after registration)
        const userInfo = {
          username: response.data.user.username,
          email: response.data.user.email,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          isAuthenticated: true,
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
        return { success: true, data: userInfo };
      }

      // Registration failed
      return { 
        success: false, 
        message: response.data?.message || 'Registration failed. Please try again.' 
      };

    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Cannot connect to server. Please check if the backend is running.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid registration data. Please check your input.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Username or email already exists';
      }

      return { 
        success: false, 
        message: errorMessage 
      };
    }
  },

  /**
   * Logout current user
   * @returns {Promise} Response data
   */
  logout: async () => {
    try {
      const response = await api.post('/api/account/logout');
      localStorage.removeItem('user');
      
      if (response.data && response.data.success === true) {
        return { success: true };
      }
      
      return { success: false, message: response.data?.message || 'Logout failed' };
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local data even if request fails
      localStorage.removeItem('user');
      return { success: true, message: 'Local session cleared' };
    }
  },

  /**
   * Get current authenticated user info
   * @returns {Promise} User data
   */
  getCurrentUser: async () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        return JSON.parse(storedUser);
      }
      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const user = localStorage.getItem('user');
    return !!user;
  },

  /**
   * Get stored user data from localStorage
   * @returns {Object|null} User object or null
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export default authService;