/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium black-white-gray color palette
        'pure-black': '#0F172A',
        'soft-white': '#FFFFFF',
        'background-light': '#F8FAFC',
        'surface': '#FFFFFF',

        // Gray scale
        'gray-50': '#F8FAFC',
        'gray-100': '#F1F5F9',
        'gray-200': '#E2E8F0',
        'gray-300': '#CBD5E1',
        'gray-400': '#94A3B8',
        'gray-500': '#64748B',
        'gray-600': '#475569',
        'gray-700': '#334155',
        'gray-800': '#1E293B',
        'gray-900': '#0F172A',
      },
      borderRadius: {
        'xs': '0.125rem', // 2px
        'sm': '0.25rem',  // 4px
        'md': '0.375rem', // 6px
        'lg': '0.5rem',   // 8px
      },
      boxShadow: {
        'subtle': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'focus': '0 0 0 3px rgba(100, 116, 139, 0.1)',
      },
      spacing: {
        'xs': '0.25rem', // 4px
        'sm': '0.5rem',  // 8px
        'md': '1rem',    // 16px
        'lg': '1.5rem',  // 24px
        'xl': '2rem',    // 32px
      },
      fontSize: {
        'heading': ['2rem', { lineHeight: '1.2', fontWeight: '700' }],
        'subheading': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'small': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
}