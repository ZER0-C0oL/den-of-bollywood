/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bollywood: {
          gold: '#FFD700',
          red: '#DC2626',
          orange: '#EA580C',
        }
      }
    },
  },
  plugins: [],
}
