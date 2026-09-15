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
          ivory: '#FAF9F5',
          surface: '#F4F3EE',
          card: '#FFFFFF',
          dark: '#0B131D',
          'dark-surface': '#111D2B',
          'dark-card': '#162334',
          sage: '#285A52',
          'sage-hover': '#1F4740',
          'sage-light': '#E9F1EF',
          teal: '#285A52',
          navy: '#111D2B',
          'navy-dark': '#0B131D',
          'navy-light': '#1E293B',
          slate: '#8A96A6',
          text: '#111827',
          muted: '#526071',
          'muted-light': '#8A96A6',
          border: '#E5E7EB',
          'border-dark': '#202F42',
          line: '#E5E8EB',
        }
      },
      fontFamily: {
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.18em',
        tightest: '-0.035em',
      },
      lineHeight: {
        editorial: '1.15',
        relaxedEditorial: '1.25',
      },
      maxWidth: {
        '8xl': '88rem',
      }
    },
  },
  plugins: [],
}
