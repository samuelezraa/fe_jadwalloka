/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- BARIS INI WAJIB ADA & SANGAT PENTING!
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}