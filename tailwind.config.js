/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['Press Start 2P', 'VT323', 'monospace'],
      },
      colors: {
        'neon-blue': '#00f0ff',
        'neon-pink': '#ff00ff',
        'neon-green': '#00ff00',
        'space-dark': '#0a0a0f',
      },
    },
  },
  plugins: [],
}


