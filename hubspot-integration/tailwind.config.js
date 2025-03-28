/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          light: '#60A5FA',
          dark: '#1D4ED8',
        },
        secondary: {
          DEFAULT: '#10B981',
          dark: '#065F46',
          light: '#D1FAE5',
        },
        background: {
          light: '#F9FAFB',
          dark: '#111827',
        },
        accent: {
          purple: '#8B5CF6',
          amber: '#F59E0B',
          pink: '#EC4899',
          cyan: '#06B6D4',
          indigo: '#4F46E5',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)',
        'highlight': '0 0 0 3px rgba(96, 165, 250, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'subtle-pattern': 'url("/subtle-pattern.png")',
      },
    },
  },
  plugins: [],
  safelist: [
    'text-primary',
    'text-primary-light',
    'text-primary-dark',
    'bg-primary',
    'bg-primary-light',
    'bg-primary-dark',
    'border-primary',
    'hover:bg-primary-dark',
    'hover:text-white',
  ]
} 