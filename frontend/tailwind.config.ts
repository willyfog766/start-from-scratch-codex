import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'var(--color-surface)',
        foreground: 'var(--color-foreground)',
      },
    },
  },
  plugins: [],
} satisfies Config;
