/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'presidio-blue': '#0c5483',
        'presidio-light-blue': '#E3F2FD',
        'presidio-green': '#4CAF50',
        'presidio-purple': '#9C27B0',
      },
      fontFamily: {
        'segoe': ['"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}