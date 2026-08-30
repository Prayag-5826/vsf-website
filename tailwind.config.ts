import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx,mdx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        vsf: {
          crimson: {
            DEFAULT: '#B91C1C',
            hover: '#991B1B',
            light: '#FEF2F2',
          },
          navy: {
            DEFAULT: '#0F172A',
            surface: '#1E293B',
            muted: '#334155',
          },
          gold: {
            DEFAULT: '#B45309',
            light: '#D97706',
            border: '#FDE68A',
          },
          bg: {
            subtle: '#F8FAFC',
            surface: '#FFFFFF',
          },
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        heading: ['var(--font-montserrat)', 'sans-serif'],
        sans: ['var(--font-open-sans)', 'sans-serif'],
        hindi: ['var(--font-hindi)', 'serif'],
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgb(15 23 42 / 0.08), 0 1px 2px -1px rgb(15 23 42 / 0.08)',
        panel: '0 4px 6px -1px rgb(15 23 42 / 0.05), 0 2px 4px -2px rgb(15 23 42 / 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
