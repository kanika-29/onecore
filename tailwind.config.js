/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          crimson: '#D52B1E',
          'crimson-dark': '#B52015',
          'crimson-light': '#FFF1F0',
          stone: '#FAF9F6',
          'stone-surface': '#F4F5F7',
          onyx: '#121212',
          ivory: '#FAF9F5',
          surface: '#F4F3EE',
          card: '#FFFFFF',
          dark: '#0F1115',
          'dark-surface': '#16191F',
          'dark-card': '#1C212B',
          sage: '#285A52',
          'sage-hover': '#1F4740',
          'sage-light': '#E9F1EF',
          teal: '#285A52',
          navy: '#111D2B',
          'navy-dark': '#0B131D',
          'navy-light': '#1E293B',
          slate: '#8A96A6',
          text: '#121212',
          muted: '#4B5563',
          'muted-light': '#9CA3AF',
          border: '#E5E7EB',
          'border-dark': '#202F42',
          line: '#E5E8EB',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2rem',
      },
      letterSpacing: {
        widest: '0.2em',
        tightest: '-0.035em',
      },
      lineHeight: {
        editorial: '1.12',
        relaxedEditorial: '1.25',
      },
      maxWidth: {
        '8xl': '88rem',
      }
    },
  },
  plugins: [],
}
