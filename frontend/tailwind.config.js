/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FFE600',
          hover: '#E6CF00',
          light: '#FFF08A',
        },
        secondary: {
          DEFAULT: '#3483FA',
          hover: '#2968C8',
          light: '#6BA3FF',
        },
        neutral: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D4D4D4',
          300: '#A3A3A3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#292929',
          800: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', '"Proxima Nova"', 'system-ui', 'sans-serif'],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        30: '7.5rem',
      },
    },
  },
  plugins: [import('@tailwindcss/typography')],
}
