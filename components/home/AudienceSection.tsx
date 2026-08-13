'use client';

import { ShieldCheck } from 'lucide-react';
import { audiences } from './homeData';
import { Reveal } from './Reveal';
import { GlassCard } from '@/components/ui/GlassCard';

export function AudienceSection() { return <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="mb-10 max-w-2xl"><Reveal><p className="eyebrow">MADE FOR THE PEOPLE MOVING DATA FORWARD</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">One foundation. Every team moves better.</h2><p className="mt-4 text-base leading-7 text-slate-500">DataSculpt connects the needs of technical builders and business leaders around one trusted data foundation.</p></Reveal></div><div className="grid gap-5 md:grid-cols-3">{audiences.map(([title, description], index) => <Reveal key={title} delay={index * 0.08}><GlassCard className="h-full border-brand-100 bg-white/75 p-6"><ShieldCheck size={20} className="text-brand-500" /><h3 className="mt-5 text-xl font-semibold text-slate-800">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{description}</p></GlassCard></Reveal>)}</div></section>; }
