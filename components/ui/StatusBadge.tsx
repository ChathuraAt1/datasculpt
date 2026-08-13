import type { ReactNode } from 'react';

export function StatusBadge({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'cyan' | 'amber' }) {
  const tones = {
    green: 'border-brand-300/25 bg-brand-300/10 text-brand-200',
    cyan: 'border-brand-400/25 bg-brand-400/10 text-brand-300',
    amber: 'border-brand-500/25 bg-brand-500/10 text-brand-400',
  };
  const dots = { green: 'bg-brand-300', cyan: 'bg-brand-400', amber: 'bg-brand-500' };
  return <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${tones[tone]}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} />
    {children}
  </span>;
}
