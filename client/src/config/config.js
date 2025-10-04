// Application configuration using environment variables

const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5143',
    timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
  },

  // Application Settings
  app: {
    name: import.meta.env.VITE_APP_NAME || 'BBU Library System',
    version: '1.0.0',
  },

  // Environment
  env: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
  },

  // Feature Flags (optional)
  features: {
    enableDebugMode: import.meta.env.VITE_ENABLE_DEBUG === 'true',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },
};

// Log configuration in development mode
if (config.env.isDevelopment) {
  console.log('🔧 App Configuration:', config);
}

export default config;