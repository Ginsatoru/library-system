const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5143',
    timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
  },

  app: {
    name: import.meta.env.VITE_APP_NAME || 'BBU Library System',
    version: '1.0.0',
  },

  env: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
  },

  features: {
    enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },
};

export default config;