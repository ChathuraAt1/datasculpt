'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, BrainCircuit } from 'lucide-react';
import { useState } from 'react';
import { testimonials } from './homeData';
import { Reveal } from './Reveal';

type Position = 'center' | 'left' | 'right' | 'hidden';

function positionFor(index: number, active: number): Position {
  const offset = (index - active + testimonials.length) % testimonials.length;
  if (offset === 0) return 'center';
  if (offset === 1) return 'right';
  if (offset === testimonials.length - 1) return 'left';
  return 'hidden';
}

export function Testimonials() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const previous = (active - 1 + testimonials.length) % testimonials.length;
  const next = (active + 1) % testimonials.length;
  const selectStory = (index: number) => setActive((index + testimonials.length) % testimonials.length);

  return <section aria-labelledby="customer-stories-title" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="mb-10 max-w-2xl"><Reveal><p className="eyebrow">THE OUTCOME PEOPLE REMEMBER</p><h2 id="customer-stories-title" className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Trusted data creates confident action.</h2><p className="mt-4 text-base leading-7 text-slate-500">Illustrative customer stories showing the kinds of change DataSculpt is designed to support.</p></Reveal></div><div className="rounded-[2rem] border border-brand-100 bg-brand-50/55 p-5 sm:p-8 lg:p-10"><div className="relative h-[500px] overflow-hidden md:h-[450px]" aria-live="polite"><div className="absolute inset-0 flex items-center justify-center"><div className="relative h-[390px] w-full max-w-5xl">{testimonials.map((item, index) => { const position = positionFor(index, active); const isCenter = position === 'center'; const isHidden = position === 'hidden'; return <motion.div key={item.role} initial={false} animate={reducedMotion ? { x: 0, y: isCenter ? 0 : 30, scale: isCenter ? 1 : 0.94, opacity: isCenter ? 1 : 0 } : position === 'center' ? { x: 0, y: 0, scale: 1, opacity: 1 } : position === 'left' ? { x: -330, y: 24, scale: 0.78, opacity: 0.7 } : position === 'right' ? { x: 330, y: 24, scale: 0.78, opacity: 0.7 } : { x: 0, y: 70, scale: 0.68, opacity: 0 } } transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }} className={`absolute left-1/2 top-1/2 w-[min(100%,28rem)] -translate-x-1/2 -translate-y-1/2 ${isHidden ? 'pointer-events-none' : ''} ${isCenter ? 'z-20' : 'z-10'} ${!isCenter ? 'hidden md:block' : ''}`} aria-hidden={isHidden}><TestimonialCard item={item} featured={isCenter} onSelect={() => selectStory(index)} /></motion.div>; })}</div></div><div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 md:hidden"><NavigationButton direction="previous" onClick={() => selectStory(previous)} /><span className="font-mono text-xs text-brand-700">{String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span><NavigationButton direction="next" onClick={() => selectStory(next)} /></div></div><div className="mt-4 hidden items-center justify-center gap-4 md:flex"><NavigationButton direction="previous" onClick={() => selectStory(previous)} /><span className="font-mono text-xs text-brand-700">{String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span><NavigationButton direction="next" onClick={() => selectStory(next)} /></div></div></section>;
}

function NavigationButton({ direction, onClick }: { direction: 'previous' | 'next'; onClick: () => void }) {
  const Icon = direction === 'previous' ? ArrowLeft : ArrowRight;
  return <button type="button" onClick={onClick} className="grid h-10 w-10 place-items-center rounded-full border border-brand-200 bg-white/80 text-brand-700 transition hover:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400" aria-label={`Show ${direction} testimonial`}><Icon size={16} /></button>;
}

function TestimonialCard({ item, featured, onSelect }: { item: (typeof testimonials)[number]; featured: boolean; onSelect: () => void }) {
  const content = <><span className={`mx-auto grid place-items-center rounded-2xl ${featured ? 'h-14 w-14 bg-brand-400 text-slate-950' : 'h-11 w-11 bg-brand-100 text-brand-600'}`}><BrainCircuit size={featured ? 28 : 20} /></span><p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-brand-600">{item.role}</p><h3 className={`${featured ? 'mt-4 text-2xl' : 'mt-3 text-base'} font-semibold text-slate-800`}>{item.challenge}</h3>{featured && <><p className="mt-4 text-sm leading-6 text-slate-500">{item.transformation}</p><blockquote className="mt-5 border-t border-brand-100 pt-5 text-base font-medium leading-7 text-slate-700">“{item.quote}”</blockquote></>}</>;
  if (featured) return <article className="rounded-3xl border border-brand-300/80 bg-white/95 p-6 text-center shadow-brand sm:p-8" aria-current="true">{content}</article>;
  return <button type="button" onClick={onSelect} aria-label={`Show ${item.role}`} className="w-full rounded-3xl border border-brand-100 bg-white/75 p-5 text-center opacity-75 shadow-panel transition hover:border-brand-400 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">{content}</button>;
}
