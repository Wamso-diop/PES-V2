import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand blue (mapped to Tailwind blue scale)
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Navy remapped to blue scale for backward compat
        navy: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Gold remapped to orange for backward compat
        gold: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        // Hero section: light background with soft blue-violet tint
        'hero-gradient': 'linear-gradient(145deg, #ffffff 0%, #f0f4ff 55%, #faf0ff 100%)',
        // Dark CTA / Method section
        'cta-gradient': 'linear-gradient(135deg, #172554 0%, #1e3a8a 60%, #1d4ed8 100%)',
        // Hero image card background (dark blue)
        'hero-image-bg': 'linear-gradient(160deg, #1e3a8a 0%, #2563eb 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,1) 100%)',
        'primary-gradient': 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
        'gold-gradient': 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
      },
      boxShadow: {
        'glass':       '0 8px 32px 0 rgba(37, 99, 235, 0.12)',
        'primary':     '0 4px 20px rgba(37, 99, 235, 0.35)',
        'primary-lg':  '0 8px 36px rgba(37, 99, 235, 0.4)',
        'gold':        '0 4px 20px rgba(249, 115, 22, 0.35)',
        'navy':        '0 4px 24px rgba(23, 37, 84, 0.4)',
        'card':        '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover':  '0 8px 32px rgba(0,0,0,0.12)',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
}

export default config
