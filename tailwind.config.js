/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        antiquewhite: '#FAEBD7', // 确保这里有定义
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}