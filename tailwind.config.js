/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#4285F4',
          'blue-royal': '#1A56DB',
          'blue-deep': '#174EA6',
          red: '#EA4335',
          yellow: '#FBBC04',
          green: '#34A853',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#F8FAFF',
          border: '#E6EAF2',
          muted: '#5F6B7A',
          text: '#1F2937',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'lift': '0 12px 30px -10px rgba(26, 86, 219, 0.18)',
        'card': '0 4px 20px -2px rgba(27, 46, 94, 0.05), 0 2px 6px -1px rgba(27, 46, 94, 0.03)',
        'card-hover': '0 16px 36px -6px rgba(27, 46, 94, 0.1), 0 4px 12px -2px rgba(27, 46, 94, 0.04)',
      },
      animation: {
        'blob-slow': 'blob-float 18s ease-in-out infinite alternate',
        'blob-reverse': 'blob-float-reverse 22s ease-in-out infinite alternate',
      },
      keyframes: {
        'blob-float': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(40px, -30px) scale(1.08)' },
          '100%': { transform: 'translate(-20px, 25px) scale(0.95)' },
        },
        'blob-float-reverse': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(-35px, 35px) scale(1.05)' },
          '100%': { transform: 'translate(30px, -20px) scale(0.98)' },
        },
      }
    },
  },
  plugins: [],
}
