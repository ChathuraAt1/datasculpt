import type { ReactNode } from 'react';

export function StatusBadge({ children, tone = 'green' }: { children: ReactNode; tone?: 'green' | 'cyan' | 'amber' }) {
  const tones = {
    green: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-300',
    cyan: 'border-cyan-400/20 bg-cyan-400/10 text-cyan-300',
    amber: 'border-amber-400/20 bg-amber-400/10 text-amber-300',
  };
  return <span className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${tones[tone]}`}>
    <span className={`h-1.5 w-1.5 rounded-full ${tone === 'green' ? 'bg-emerald-400' : tone === 'cyan' ? 'bg-cyan-400' : 'bg-amber-400'}`} />
    {children}
  </span>;
}
