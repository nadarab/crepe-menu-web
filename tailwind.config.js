/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        alexandria: ['Anton', 'Cairo', 'sans-serif'],
        anton: ['Anton', 'sans-serif'],
        cairo: ['Cairo', 'sans-serif'],
        bree: ['Bree Serif', 'serif'],
        tajawal: ['Tajawal', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

