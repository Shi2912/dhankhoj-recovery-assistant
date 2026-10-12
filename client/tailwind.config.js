/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff9eb',
          100: '#ffefc6',
          200: '#ffdd88',
          300: '#ffc347',
          400: '#ffab1a',
          500: '#f5820d',
          600: '#d95e06',
          700: '#b44108',
          800: '#90330e',
          900: '#762b0f',
        },
        tiranga: {
          green: '#138808',
          darkGreen: '#0b5a04',
          navy: '#000080',
          orange: '#FF9933',
        },
        fintech: {
          navy: '#0A192F',
          darkBlue: '#0F2744',
          slate: '#1E293B',
          accent: '#0284C7',
          emerald: '#059669',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
