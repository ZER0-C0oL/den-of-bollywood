/**
 * Tailwind CSS Configuration
 */
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
          darkBlue: '#1E40AF',
          lightBlue: '#3B82F6',
          silver: '#0F766E',
          darkGray: '#06B6D4',
          lightGray: '#0891B2'
        }
      }
    },
  },
  plugins: [],
}
