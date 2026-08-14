import Link from 'next/link';
import type { ReactNode } from 'react';

type ButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
};

const variants = {
  primary: 'border border-brand-300/70 bg-brand-500 text-slate-50 shadow-brand hover:bg-brand-300',
  secondary: 'border border-brand-500/50 bg-brand-100/70 text-brand-700 hover:border-brand-300/90 hover:bg-brand-100',
  ghost: 'border border-brand-100 bg-white/70 text-slate-600 hover:border-brand-500/60 hover:text-brand-700',
};

export function Button({ children, href, variant = 'primary', className = '' }: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf2] ${variants[variant]} ${className}`;

  if (href) return <Link href={href} className={classes}>{children}</Link>;
  return <button className={classes}>{children}</button>;
}
