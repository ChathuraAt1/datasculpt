import type { ReactNode } from 'react';

export function GlassCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`glass-panel rounded-2xl shadow-panel ${className}`}>{children}</div>;
}
