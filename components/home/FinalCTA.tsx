'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EditorialButton } from '@/components/ui/EditorialButton';

export function FinalCTA() {
  const reducedMotion = useReducedMotion();

  return <section className="mx-auto max-w-7xl px-5 pb-24 pt-8 lg:px-8 lg:pb-32"><div className="grid overflow-hidden rounded-[2rem] border border-brand-200 bg-yellow-50 shadow-panel lg:grid-cols-[1fr_0.9fr]"><motion.div initial={{ opacity: 0, x: reducedMotion ? 0 : -18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.55 }} className="flex flex-col justify-center p-7 sm:p-10 lg:p-14"><p className="eyebrow">READY FOR WHAT COMES NEXT</p><h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-slate-800 sm:text-5xl">Give your data foundation a clearer direction.</h2><p className="mt-5 max-w-xl text-base leading-7 text-slate-600">Build a more trusted path from the information you have today to the decisions and AI initiatives you want to move forward.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"><EditorialButton href="/products/" icon={<Workflow size={18} />}>See your workflow</EditorialButton><Button href="/contact/" variant="ghost">Explore your use case <ArrowUpRight size={16} /></Button></div></motion.div><motion.div initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.04 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: reducedMotion ? 0 : 0.7 }} className="relative min-h-[390px] overflow-hidden sm:min-h-[460px] lg:min-h-full"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85')] bg-cover bg-center" aria-hidden="true" /><div className="absolute inset-0 bg-gradient-to-br from-brand-900/55 via-brand-700/30 to-brand-400/25" aria-hidden="true" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent p-7 pt-28 sm:p-9 sm:pt-36"><p className="max-w-xs text-xl font-semibold leading-7 text-brand-50">Trusted data. Better decisions. Stronger AI foundations.</p></div></motion.div></div></section>;
}
