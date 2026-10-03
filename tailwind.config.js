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
          DEFAULT: '#F79454',
          50: '#FDF5EE',
          100: '#FCE7D7',
          200: '#FACBAA',
          300: '#F9AE7D',
          400: '#F79454',
          500: '#E07530',
          600: '#B85519',
        },
        vermilion: {
          DEFAULT: '#C54845',
          50: '#FAF0EF',
          100: '#F5DCDB',
          200: '#EBB4B2',
          300: '#DE8986',
          400: '#C84F4C',
          500: '#A93734',
          600: '#872725',
        },
        'peacock-deep': {
          DEFAULT: '#13504D',
          50: '#EBF2F1',
          100: '#D3E2E1',
          200: '#A9C6C4',
          300: '#6C9A98',
          400: '#35716E',
          500: '#13504D',
          600: '#0C3735',
        },
        peacock: {
          DEFAULT: '#2F7A72',
          50: '#EFF7F6',
          100: '#DBEFEB',
          200: '#B8DFD8',
          300: '#88C6BC',
          400: '#5BA99E',
          500: '#2F7A72',
          600: '#215953',
        },
        sage: {
          DEFAULT: '#A5B596',
          50: '#F4F7F1',
          100: '#E7EDE1',
          200: '#D2DEC5',
          300: '#BDCEA8',
          400: '#A5B596',
          500: '#819371',
          600: '#607052',
        },
        paper: {
          DEFAULT: '#FFFDF8',
          2: '#F6F0E4',
          panel: '#F6F0E4',
          border: '#E8DEC8',
        },
        ink: {
          DEFAULT: '#1C2B29',
          muted: '#526562',
          soft: '#7A8E8B',
        },
        surface: {
          DEFAULT: '#FFFDF8',
          soft: '#F6F0E4',
          border: '#E8DEC8',
          muted: '#526562',
          text: '#1C2B29',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        heading: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Mukta', 'system-ui', 'sans-serif'],
        body: ['Mukta', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(19, 80, 77, 0.08)',
        'lift': '0 12px 30px -10px rgba(19, 80, 77, 0.16)',
        'card': '0 4px 20px -2px rgba(28, 43, 41, 0.06), 0 2px 6px -1px rgba(28, 43, 41, 0.04)',
        'card-hover': '0 16px 36px -6px rgba(28, 43, 41, 0.12), 0 4px 12px -2px rgba(28, 43, 41, 0.06)',
        'saffron-glow': '0 10px 25px -5px rgba(247, 148, 84, 0.35), 0 8px 10px -6px rgba(247, 148, 84, 0.25)',
        'vermilion-glow': '0 10px 25px -5px rgba(200, 79, 76, 0.35), 0 8px 10px -6px rgba(200, 79, 76, 0.25)',
        'peacock-glow': '0 10px 25px -5px rgba(19, 80, 77, 0.25), 0 8px 10px -6px rgba(19, 80, 77, 0.18)',
        'royal-glow': '0 10px 25px -5px rgba(247, 148, 84, 0.35), 0 8px 10px -6px rgba(247, 148, 84, 0.25)', // backward-compatible alias
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
