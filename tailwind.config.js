/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fdf3f3',
          100: '#fbe4e4',
          200: '#f6c5c5',
          300: '#ef9a9a',
          400: '#e66060',
          500: '#FF3366', // Primary pink
          600: '#E62E5C',
          700: '#a51010',
          800: '#881010',
          900: '#711313',
          pink: '#FF4D8C',
          purple: '#6B46C1', 
          dark: '#0B0F19', 
          lime: '#CCFF00',
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.6s ease both',
        float: 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
