'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { testimonials } from './homeData';
import { Reveal } from './Reveal';

export function Testimonials() {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const previous = (active - 1 + testimonials.length) % testimonials.length;
  const next = (active + 1) % testimonials.length;
  const select = (index: number, nextDirection: number) => { setDirection(nextDirection); setActive((index + testimonials.length) % testimonials.length); };
  const transition = { duration: reducedMotion ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] as const };

  return <section aria-labelledby="customer-stories-title" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="mb-10 max-w-2xl"><Reveal><p className="eyebrow">THE OUTCOME PEOPLE REMEMBER</p><h2 id="customer-stories-title" className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Trusted data creates confident action.</h2><p className="mt-4 text-base leading-7 text-slate-500">Illustrative customer stories showing the kinds of change DataSculpt is designed to support.</p></Reveal></div><div className="rounded-[2rem] border border-brand-100 bg-brand-50/55 p-5 sm:p-8 lg:p-10"><div className="grid min-h-[520px] items-center gap-5 lg:grid-cols-[0.8fr_1.3fr_0.8fr] lg:gap-8" aria-live="polite"><AnimatedStory keyName={`left-${testimonials[previous].name}`} item={testimonials[previous]} mode="side" onSelect={() => select(previous, -1)} transition={transition} reducedMotion={reducedMotion} direction={direction} /><AnimatedStory keyName={`center-${testimonials[active].name}`} item={testimonials[active]} mode="featured" transition={transition} reducedMotion={reducedMotion} direction={direction} /><AnimatedStory keyName={`right-${testimonials[next].name}`} item={testimonials[next]} mode="side" onSelect={() => select(next, 1)} transition={transition} reducedMotion={reducedMotion} direction={direction} /></div><div className="mt-6 flex items-center justify-center gap-4"><NavButton label="Show previous testimonial" onClick={() => select(previous, -1)} icon={<ArrowLeft size={16} />} /><span className="font-mono text-xs text-brand-700">{String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span><NavButton label="Show next testimonial" onClick={() => select(next, 1)} icon={<ArrowRight size={16} />} /></div></div></section>;
}

function AnimatedStory({ item, mode, onSelect, transition, reducedMotion, keyName, direction }: { item: (typeof testimonials)[number]; mode: 'featured' | 'side'; onSelect?: () => void; transition: { duration: number; ease: readonly [number, number, number, number] }; reducedMotion: boolean | null; keyName: string; direction: number }) {
  const featured = mode === 'featured';
  return <AnimatePresence mode="popLayout" initial={false}><motion.div key={keyName} layout initial={{ opacity: 0, x: reducedMotion ? 0 : featured ? direction * 28 : -direction * 18, scale: reducedMotion ? 1 : 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: reducedMotion ? 0 : featured ? -direction * 28 : direction * 18, scale: reducedMotion ? 1 : 0.96 }} transition={transition} className="w-full"><StoryCard item={item} featured={featured} onSelect={onSelect} /></motion.div></AnimatePresence>;
}

function StoryCard({ item, featured, onSelect }: { item: (typeof testimonials)[number]; featured: boolean; onSelect?: () => void }) {
  const content = <><div className="flex items-center gap-3 text-left"><img src={item.image} alt="" className={`${featured ? 'h-14 w-14' : 'h-11 w-11'} rounded-full object-cover ring-2 ring-brand-200`} loading="lazy" /><span><span className="block text-sm font-semibold text-slate-800">{item.name}</span><span className="mt-1 block text-xs text-brand-700">{item.role}</span>{item.company && <span className="mt-1 block text-xs text-slate-500">{item.company}</span>}</span></div><p className={`${featured ? 'mt-7 text-xl' : 'mt-5 text-sm'} text-left font-semibold leading-7 text-slate-800`}>{item.challenge}</p>{featured && <><p className="mt-4 text-left text-sm leading-6 text-slate-500">{item.transformation}</p><blockquote className="mt-6 border-t border-brand-100 pt-5 text-left text-base font-medium leading-7 text-slate-700">“{item.quote}”</blockquote><p className="mt-5 text-left font-mono text-[0.62rem] uppercase tracking-[0.16em] text-brand-600">Illustrative customer story</p></>}{!featured && <p className="mt-4 text-left text-xs leading-5 text-slate-500">Click to feature this story</p>}</>;
  if (!featured) return <motion.button type="button" onClick={onSelect} whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="w-full rounded-3xl border border-brand-100 bg-white/75 p-5 shadow-panel transition hover:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">{content}</motion.button>;
  return <article className="rounded-3xl border border-brand-300/80 bg-white/95 p-6 shadow-brand sm:p-8">{content}</article>;
}

function NavButton({ label, onClick, icon }: { label: string; onClick: () => void; icon: React.ReactNode }) {
  return <button type="button" onClick={onClick} aria-label={label} className="grid h-10 w-10 place-items-center rounded-full border border-brand-200 bg-white/80 text-brand-700 transition hover:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">{icon}</button>;
}
