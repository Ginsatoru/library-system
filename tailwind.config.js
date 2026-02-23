const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: '#002855',
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#005ce6',
          600: '#0047b3',
          700: '#003380',
          800: '#001f4d',
          900: '#000a1a',
        },
        secondary: {
          DEFAULT: '#E9B824',
        },
        // Dark mode specific colors
        dark: {
          DEFAULT: '#121212',
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#bdbdbd',
          300: '#9e9e9e',
          400: '#757575',
          500: '#616161',
          600: '#424242',
          700: '#303030',
          800: '#212121',
          900: '#121212',
        }
      },
      // Extended background colors for dark mode
      backgroundColor: theme => ({
        ...theme('colors'),
        'dark-primary': '#1a1a2e',
        'dark-secondary': '#16213e',
        'dark-surface': '#0f3460',
      }),
      // Extended text colors for dark mode
      textColor: theme => ({
        ...theme('colors'),
        'dark-primary': '#e2e8f0',
        'dark-secondary': '#cbd5e1',
      }),
      // Extended border colors for dark mode
      borderColor: theme => ({
        ...theme('colors'),
        'dark-primary': '#2d3748',
        'dark-secondary': '#4a5568',
      }),
    },
  },
  plugins: [],
}