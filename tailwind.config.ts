import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#f7f6f0',
        ink: '#fbfaf5',
        panel: '#ffffff',
        line: '#deded7',
        brand: {
          50: '#fafaf7',
          100: '#eeeadd',
          200: '#f9df70',
          300: '#c99000',
          400: '#b77900',
          500: '#9a6500',
          600: '#805200',
          700: '#684100',
          800: '#513200',
          900: '#3d2500',
          950: '#291900',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        brand: '0 0 0 1px rgb(183 121 0 / 0.28), 0 10px 30px rgb(183 121 0 / 0.14)',
        panel: '0 18px 70px rgb(120 90 20 / 0.12)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at 50% 0%, rgb(234 179 8 / 0.18), transparent 44%)',
      },
    },
  },
  plugins: [],
};

export default config;
