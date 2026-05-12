/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sarabun: ['Sarabun', 'sans-serif'],
        prompt: ['Prompt', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f7ff',
          100: '#dbeeff',
          200: '#b3d4f5',
          400: '#4a90e2',
          500: '#2979d4',
          700: '#1a56a0',
          900: '#0d2d5e',
        },
        accent: {
          DEFAULT: '#0ac4aa',
          light: '#d0f7f2',
        },
      },
      animation: {
        'fade-slide': 'fadeSlide 0.3s ease',
        'scale-in': 'scaleIn 0.2s ease',
      },
      keyframes: {
        fadeSlide: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
