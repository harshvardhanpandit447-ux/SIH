/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          primary: '#22C55E', // Primary Green
          bright: '#4ADE80',  // Bright Green
          light: '#DCFCE7',   // Light Green
          mint: '#F0FDF4',    // Mint
          dark: '#166534',    // Dark Green
          text: '#17351F',    // Dark Green Text
          bg: '#F8FFF9',      // Crisp Background
          accent: '#15803D',
          amber: '#F59E0B',
          sky: '#0EA5E9'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Noto Sans Devanagari', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif']
      },
      keyframes: {
        sway: {
          '0%, 100%': { transform: 'rotate(-2.5deg)' },
          '50%': { transform: 'rotate(2.5deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        }
      },
      animation: {
        sway: 'sway 4s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
        pulseSlow: 'pulseSlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    },
  },
  plugins: [],
}
