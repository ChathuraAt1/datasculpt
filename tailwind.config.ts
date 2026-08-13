import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0a0f1d',
        ink: '#020617',
        panel: '#0f172a',
        line: '#1e293b',
        brand: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        brand: '0 0 0 1px rgb(234 179 8 / 0.24), 0 0 30px rgb(234 179 8 / 0.14)',
        panel: '0 18px 70px rgb(0 0 0 / 0.28)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at 50% 0%, rgb(234 179 8 / 0.12), transparent 42%)',
      },
    },
  },
  plugins: [],
};

export default config;
