const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
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
        }
      },
    },
  },
  plugins: [],
}