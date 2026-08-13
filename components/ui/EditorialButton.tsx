'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type EditorialButtonProps = {
  children: ReactNode;
  href: string;
  icon?: ReactNode;
  className?: string;
};

export function EditorialButton({ children, href, icon, className = '' }: EditorialButtonProps) {
  const reducedMotion = useReducedMotion();
  return <motion.div whileHover={reducedMotion ? undefined : { y: -2 }} whileTap={{ scale: 0.98 }} className={`inline-flex ${className}`}>
    <Link href={href} className="group relative inline-flex min-h-14 w-full items-center justify-center gap-4 overflow-hidden rounded-2xl border border-brand-500/60 bg-white/75 px-5 py-3 text-sm font-semibold text-brand-700 shadow-[0_8px_24px_rgba(154,101,0,0.12)] backdrop-blur-md transition-colors duration-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf2] sm:w-auto sm:min-w-[210px]">
      <motion.span initial={{ scaleX: 0 }} whileHover={reducedMotion ? undefined : { scaleX: 1 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 origin-left bg-brand-400" aria-hidden="true" />
      <span className="relative z-10">{children}</span>
      <motion.span initial={{ x: 0, rotate: 0 }} whileHover={reducedMotion ? undefined : { x: 5, y: -3, rotate: 10 }} transition={{ type: 'spring', stiffness: 420, damping: 22 }} className="relative z-10 grid h-8 w-8 place-items-center rounded-full border border-brand-500/40 bg-brand-100/80 text-brand-700 transition-colors duration-300 group-hover:border-brand-600/50 group-hover:bg-white/30" aria-hidden="true">{icon}</motion.span>
      <span className="pointer-events-none absolute -right-8 top-1/2 z-10 h-20 w-20 -translate-y-1/2 rounded-full bg-white/30 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />
    </Link>
  </motion.div>;
}
