/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#FAF7F2',
          dark: '#F2ECE1',
          light: '#FDFBF7',
        },
        terracotta: {
          DEFAULT: '#C85A32',
          dark: '#A34120',
          light: '#E87D56',
        },
        gold: {
          DEFAULT: '#D4AF37',
          dark: '#B58E23',
          light: '#F3E5AB',
        },
        navy: {
          DEFAULT: '#0442A5', // Logo Sapphire Blue
          dark: '#01173C',
          deep: '#010E24',
          subtle: '#E8F2FF',
        },
        charcoal: {
          DEFAULT: '#1A1816',
          light: '#2D2926',
          muted: '#524C46',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gallery': '0 20px 40px -15px rgba(26, 24, 22, 0.08), 0 0 15px 0 rgba(200, 90, 50, 0.04)',
        'gallery-hover': '0 30px 60px -20px rgba(26, 24, 22, 0.15), 0 0 25px 0 rgba(200, 90, 50, 0.1)',
        'admin': '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
