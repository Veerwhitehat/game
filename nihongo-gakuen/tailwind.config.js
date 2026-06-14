/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gakuen: {
          navy: '#0A1128',
          charcoal: '#121212',
          crimson: '#D00000',
          gold: '#FFD700',
          white: '#F8F8F8',
        }
      },
    },
  },
  plugins: [],
}
