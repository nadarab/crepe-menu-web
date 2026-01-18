/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.tsx",
    "./src/**/*.ts",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',
      },
      fontFamily: {
        alexandria: ['Anton', 'Cairo', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
        bree: ['Bree Serif', 'serif'],
        tajawal: ['Tajawal', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
      },
    },
  },
  plugins: [],
}

