import Link from 'next/link';
import type { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
};

const variants = {
  primary: 'border border-cyan-400/60 bg-cyan-500 text-slate-950 shadow-cyan hover:bg-cyan-300',
  secondary: 'border border-cyan-500/40 bg-blue-600/20 text-cyan-100 hover:border-cyan-400/80 hover:bg-blue-600/35',
  ghost: 'border border-slate-800 bg-slate-900/50 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-200',
};

export function Button({ children, href, variant = 'primary', className = '' }: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${variants[variant]} ${className}`;

  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button className={classes}>{children}</button>;
}
