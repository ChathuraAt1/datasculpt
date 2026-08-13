'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Workflow } from 'lucide-react';
import { EditorialButton } from '@/components/ui/EditorialButton';

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const reducedMotion = Boolean(useReducedMotion());
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], reducedMotion ? ['0%', '0%'] : ['0%', '28%']);
  const imageScale = useTransform(scrollYProgress, [0, 1], reducedMotion ? [1, 1] : [1, 1.14]);
  const linesY = useTransform(scrollYProgress, [0, 1], reducedMotion ? ['0%', '0%'] : ['0%', '-24%']);
  const linesRotate = useTransform(scrollYProgress, [0, 1], reducedMotion ? [0, 0] : [0, 4]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.55, 1], reducedMotion ? [0.12, 0.12, 0.12] : [0.06, 0.34, 0.55]);

  return <section ref={heroRef} className="relative isolate min-h-[calc(100svh-4.5rem)] overflow-hidden bg-[#fffdf2] lg:min-h-[calc(100dvh-4.5rem)]" aria-labelledby="hero-title">
    <div className="absolute inset-0 bg-gradient-to-b from-[#fffdf2] via-[#fffdf2]/70 to-brand-100/60" aria-hidden="true" />
    <motion.div style={{ opacity: glowOpacity }} className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(234,179,8,0.72),rgba(255,248,196,0.3)_38%,transparent_72%)]" aria-hidden="true" />
    <motion.div style={{ y: imageY, scale: imageScale }} className="pointer-events-none absolute inset-x-0 bottom-[-5%] h-[72%] origin-bottom bg-[url('/visuals/data-landscape.svg')] bg-[length:100%_auto] bg-no-repeat bg-[center_top] opacity-95" aria-hidden="true" />
    <motion.div style={{ y: linesY, rotate: linesRotate }} className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] origin-center opacity-65" aria-hidden="true"><div className="absolute inset-0 bg-[linear-gradient(118deg,transparent_14%,rgba(154,101,0,0.2)_14.15%,transparent_14.3%,transparent_38%,rgba(154,101,0,0.18)_38.15%,transparent_38.3%,transparent_67%,rgba(154,101,0,0.2)_67.15%,transparent_67.3%),linear-gradient(24deg,transparent_24%,rgba(183,121,0,0.18)_24.15%,transparent_24.3%,transparent_53%,rgba(183,121,0,0.15)_53.15%,transparent_53.3%)]" /></motion.div>
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[54%] bg-gradient-to-t from-brand-100/65 via-brand-50/10 to-transparent" aria-hidden="true" />

    <div className="relative z-10 mx-auto flex min-h-[calc(100svh-4.5rem)] max-w-7xl flex-col items-center px-5 pb-16 pt-20 text-center sm:pt-28 lg:min-h-[calc(100dvh-4.5rem)] lg:px-8 lg:pt-32">
      <motion.h1 initial={{ opacity: 0, y: reducedMotion ? 0 : 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }} id="hero-title" className="max-w-5xl text-balance text-[3.5rem] font-semibold leading-[0.94] tracking-[-0.065em] text-slate-800 sm:text-7xl lg:text-[7.8rem]">Your data has <span className="relative inline-block text-brand-600"><span className="relative z-10">more to say.</span><span className="absolute -bottom-1 left-0 right-0 -z-0 h-[0.18em] -rotate-2 rounded-full bg-brand-200/80" aria-hidden="true" /></span></motion.h1>
      <motion.p initial={{ opacity: 0, y: reducedMotion ? 0 : 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 0.16, duration: reducedMotion ? 0 : 0.6 }} className="mt-8 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">DataSculpt helps enterprise teams turn fragmented information into trusted intelligence for better decisions and AI-ready work.</motion.p>
      <motion.div initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: reducedMotion ? 0 : 0.28, duration: reducedMotion ? 0 : 0.55 }} className="mt-9"><EditorialButton href="/products/" icon={<Workflow size={17} />}>See your workflow</EditorialButton></motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reducedMotion ? 0 : 0.55, duration: reducedMotion ? 0 : 0.7 }} className="mt-auto hidden items-center gap-3 text-xs font-medium tracking-wide text-brand-700 sm:flex"><span className="h-px w-8 bg-brand-400" />A clearer foundation for what comes next<span className="h-px w-8 bg-brand-400" /></motion.div>
    </div>
  </section>;
}
