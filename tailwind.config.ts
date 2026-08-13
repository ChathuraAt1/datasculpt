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
        cyan: { glow: '#06b6d4' },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        cyan: '0 0 0 1px rgb(6 182 212 / 0.2), 0 0 30px rgb(6 182 212 / 0.12)',
        panel: '0 18px 70px rgb(0 0 0 / 0.28)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at 50% 0%, rgb(8 145 178 / 0.12), transparent 42%)',
      },
    },
  },
  plugins: [],
};

export default config;
