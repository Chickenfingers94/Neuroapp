/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        phase1: { DEFAULT: '#0ea5e9', dark: '#0284c7' },
        phase2: { DEFAULT: '#f59e0b', dark: '#d97706' },
        phase3: { DEFAULT: '#ef4444', dark: '#dc2626' },
        safe: '#22c55e',
        caution: '#eab308',
        danger: '#ef4444',
        synergy: '#8b5cf6',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
