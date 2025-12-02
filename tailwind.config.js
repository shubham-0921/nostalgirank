/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cn-black': '#000000',
        'cn-white': '#FFFFFF',
        'cn-blue': '#00C0F3',
        'cn-yellow': '#FFCB05',
        'cn-pink': '#FF006E',
      },
      fontFamily: {
        'cartoon': ['Comic Sans MS', 'cursive'],
      },
    },
  },
  plugins: [],
}
