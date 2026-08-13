'use client';

import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, BarChart3, BrainCircuit, CheckCircle2, Database, Layers3, Pause, Play, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { useRef, useState } from 'react';
import { Hero } from '@/components/home/Hero';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

const challenges = [
  { title: 'Data is scattered across systems', description: 'Important information lives in too many places, making it difficult to see the complete picture.', icon: Database },
  { title: 'Preparation takes too much time', description: 'Teams spend their energy finding, cleaning, and checking data before meaningful work can begin.', icon: Layers3 },
  { title: 'AI needs a stronger foundation', description: 'Promising AI initiatives lose momentum when the underlying data is incomplete, inconsistent, or hard to trust.', icon: BrainCircuit },
];

const journey = [
  ['01', 'Connect', 'Bring the sources that matter together in one clear workflow.'],
  ['02', 'Shape', 'Organize information so teams can work with it confidently.'],
  ['03', 'Trust', 'Build quality and governance into the way data moves.'],
  ['04', 'Activate', 'Prepare intelligence for AI, analytics, and daily decisions.'],
] as const;

const aiOutcomes = [
  ['Search and knowledge assistants', 'Give teams a dependable foundation for finding answers across enterprise information.', Sparkles],
  ['Forecasting and prediction', 'Prepare consistent data that helps planners see what may happen next.', BarChart3],
  ['Customer intelligence', 'Connect the signals needed to understand customers and improve every interaction.', UsersRound],
  ['Automated decisions', 'Turn trusted information into repeatable actions across operational workflows.', CheckCircle2],
] as const;

const audiences = [
  ['Data engineering teams', 'Spend less time untangling preparation work and more time building the systems your business needs.'],
  ['AI and analytics teams', 'Start with cleaner, better-prepared data so experiments can become useful products.'],
  ['Enterprise decision makers', 'Create a dependable foundation for confident reporting, planning, and intelligent automation.'],
] as const;

const testimonials = [
  { role: 'Illustrative customer story · Data engineering team', challenge: 'Preparation work was slowing every new data initiative.', transformation: 'A clearer workflow helped the team spend more time building and less time untangling inputs.', quote: 'We can finally give our teams a dependable starting point instead of another data clean-up project.' },
  { role: 'Illustrative customer story · AI and analytics team', challenge: 'Promising experiments were difficult to turn into repeatable outcomes.', transformation: 'Better-prepared information created a stronger foundation for search, forecasting, and experimentation.', quote: 'The difference is not just cleaner data. It is more confidence in what our AI work can deliver.' },
  { role: 'Illustrative customer story · Enterprise operations team', challenge: 'Important decisions depended on inconsistent views of the business.', transformation: 'Shared, trusted workflows made reporting and operational decisions easier to align.', quote: 'When everyone can work from the same trusted foundation, decisions move with much less friction.' },
] as const;

export default function HomePage() {
  return <div><Hero /><Challenges /><TransformationJourney /><AIOutcomes /><Testimonials /><OutcomeStatements /><AudienceSection /><FinalCTA /></div>;
}

function Challenges() {
  return <SectionShell eyebrow="WHY TEAMS LOOK FOR A BETTER WAY" title="The hardest part of AI is often everything that comes before it." description="DataSculpt helps remove the friction between the information you already have and the outcomes you want to create."><div className="grid gap-5 md:grid-cols-3">{challenges.map(({ title, description, icon: Icon }, index) => <Reveal key={title} delay={index * 0.08}><motion.div whileHover={{ y: -5 }} className="h-full rounded-2xl border border-brand-100 bg-white/70 p-6 shadow-panel transition hover:border-brand-300/70"><span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-100 text-brand-600"><Icon size={21} /></span><h3 className="mt-6 text-xl font-semibold text-slate-800">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{description}</p></motion.div></Reveal>)}</div></SectionShell>;
}

function TransformationJourney() {
  return <SectionShell id="how-it-works" eyebrow="A CLEARER PATH FORWARD" title="From scattered information to useful intelligence." description="A simple operating journey helps your teams move with more clarity at every stage."><div className="relative grid gap-4 md:grid-cols-4 md:gap-0">{journey.map(([number, title, description], index) => <Reveal key={number} delay={index * 0.08}><div className="relative h-full border border-brand-100 bg-white/75 p-6 first:rounded-t-2xl last:rounded-b-2xl md:border-r-0 md:first:rounded-l-2xl md:first:rounded-tr-none md:last:rounded-r-2xl md:last:rounded-bl-none md:last:border-r md:before:absolute md:before:left-full md:before:top-1/2 md:before:z-10 md:before:h-px md:before:w-4 md:before:bg-brand-300 md:last:before:hidden"><p className="font-mono text-sm font-semibold text-brand-500">{number}</p><h3 className="mt-7 text-xl font-semibold text-slate-800">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{description}</p></div></Reveal>)}</div></SectionShell>;
}

function AIOutcomes() {
  return <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]"><Reveal><div><p className="eyebrow">AI-READY BY DESIGN</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Better AI starts with data your teams can trust.</h2><p className="mt-5 max-w-xl text-base leading-7 text-slate-500">DataSculpt prepares the foundation behind useful enterprise AI, so your teams can move from interesting experiments to dependable outcomes.</p><Button href="/architecture/" variant="ghost" className="mt-7">See the system approach <ArrowRight size={15} /></Button></div></Reveal><div className="grid gap-4 sm:grid-cols-2">{aiOutcomes.map(([title, description, Icon], index) => <Reveal key={title} delay={index * 0.06}><motion.div whileHover={{ y: -4 }} className="h-full rounded-2xl border border-brand-100 bg-brand-50/70 p-5 transition hover:border-brand-300/70"><Icon size={20} className="text-brand-500" /><h3 className="mt-5 text-base font-semibold text-slate-800">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{description}</p></motion.div></Reveal>)}</div></div></section>;
}

function Testimonials() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const visible = useInView(sectionRef, { once: false, amount: 0.25 });
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(Boolean(reduceMotion));
  const story = testimonials[selected];
  const selectStory = (index: number) => { setSelected(index); setPaused(true); };
  return <section ref={sectionRef} aria-labelledby="customer-stories-title" className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="mb-10 max-w-2xl"><Reveal><p className="eyebrow">THE OUTCOME PEOPLE REMEMBER</p><h2 id="customer-stories-title" className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Trusted data creates confident action.</h2><p className="mt-4 text-base leading-7 text-slate-500">Representative customer stories showing the kinds of change DataSculpt is designed to support.</p></Reveal></div><div className="relative min-h-[650px] overflow-hidden rounded-[2rem] border border-brand-100 bg-brand-50/55 p-5 sm:min-h-[500px] sm:p-10 lg:min-h-[460px]"><motion.div animate={reduceMotion || paused || !visible ? undefined : { rotate: 360 }} transition={reduceMotion || paused || !visible ? undefined : { duration: 32, repeat: Infinity, ease: 'linear' }} className="absolute left-1/2 top-1/2 hidden h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brand-300/55 md:block" aria-hidden="true" /><div className="relative z-10 flex min-h-[610px] flex-col items-center justify-center sm:min-h-[460px]"><AnimatePresence mode="wait"><motion.div key={selected} initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: reduceMotion ? 1 : 1.02 }} transition={{ duration: reduceMotion ? 0 : 0.3 }} className="order-1 w-full max-w-md rounded-3xl border border-brand-300/80 bg-white/90 p-6 text-center shadow-brand backdrop-blur-xl sm:p-8" aria-live="polite"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-400 text-slate-950"><BrainCircuit size={28} /></span><p className="mt-5 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-brand-600">{story.role}</p><h3 className="mt-4 text-2xl font-semibold text-slate-800">A stronger foundation for what comes next.</h3><p className="mt-4 text-sm leading-6 text-slate-500">{story.transformation}</p><blockquote className="mt-5 border-t border-brand-100 pt-5 text-base font-medium leading-7 text-slate-700">“{story.quote}”</blockquote></motion.div></AnimatePresence><div className="order-2 mt-7 flex max-w-3xl flex-wrap justify-center gap-3 md:absolute md:inset-0 md:mt-0">{testimonials.map((item, index) => <motion.button key={item.role} type="button" onClick={() => selectStory(index)} aria-pressed={selected === index} aria-label={`Show ${item.role}`} whileHover={reduceMotion ? undefined : { scale: 1.04 }} className={`rounded-2xl border px-4 py-3 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 md:absolute md:w-64 ${index === 0 ? 'md:left-2 md:top-10' : index === 1 ? 'md:right-2 md:top-1/2 md:-translate-y-1/2' : 'md:bottom-10 md:left-1/2 md:-translate-x-1/2'} ${selected === index ? 'border-brand-400 bg-brand-100 text-brand-700 shadow-brand' : 'border-brand-100 bg-white/80 text-slate-600 hover:border-brand-300 hover:bg-white'}`}><span className="block font-semibold">{item.challenge}</span><span className="mt-1 block text-xs text-slate-500">Select story {index + 1}</span></motion.button>)}</div><button type="button" onClick={() => setPaused((value) => !value)} className="order-3 mt-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/75 px-3 py-2 text-xs font-semibold text-brand-700 transition hover:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400" aria-label={paused ? 'Resume testimonial animation' : 'Pause testimonial animation'}>{paused ? <Play size={13} /> : <Pause size={13} />}{paused ? 'Resume motion' : 'Pause motion'}</button></div></div></section>;
}

function OutcomeStatements() {
  const outcomes = ['Move from raw data to usable insight faster', 'Build confidence into every data workflow', 'Give AI teams cleaner, better-prepared foundations'];
  return <section className="border-y border-brand-100 bg-brand-50/65"><div className="mx-auto grid max-w-7xl gap-0 px-5 py-3 lg:grid-cols-3 lg:px-8">{outcomes.map((outcome, index) => <div key={outcome} className="flex items-center gap-3 border-brand-100 px-4 py-5 text-sm font-medium text-slate-700 lg:border-r lg:py-4 lg:last:border-r-0"><span className="h-2 w-2 shrink-0 rounded-full bg-brand-400" />{outcome}</div>)}</div></section>;
}

function AudienceSection() {
  return <SectionShell eyebrow="MADE FOR THE PEOPLE MOVING DATA FORWARD" title="One foundation. Every team moves better." description="DataSculpt connects the needs of technical builders and business leaders around one trusted data foundation."><div className="grid gap-5 md:grid-cols-3">{audiences.map(([title, description], index) => <Reveal key={title} delay={index * 0.08}><GlassCard className="h-full border-brand-100 bg-white/75 p-6"><ShieldCheck size={20} className="text-brand-500" /><h3 className="mt-5 text-xl font-semibold text-slate-800">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-500">{description}</p></GlassCard></Reveal>)}</div></SectionShell>;
}

function FinalCTA() {
  return <section className="mx-auto max-w-7xl px-5 pb-24 pt-8 lg:px-8 lg:pb-32"><motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl border border-brand-300/70 bg-gradient-to-r from-brand-50 via-brand-100/75 to-brand-50 p-8 text-center shadow-brand sm:p-12"><p className="eyebrow">READY FOR THE NEXT STEP?</p><h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-slate-800 sm:text-4xl">Make your data foundation ready for what&apos;s next.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600">See how DataSculpt can help your teams create more value from the data they already have.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button href="/products/">Explore the platform <ArrowRight size={16} /></Button><Button href="/contact/" variant="ghost">Explore your use case</Button></div></motion.div></section>;
}

function SectionShell({ id, eyebrow, title, description, children }: { id?: string; eyebrow: string; title: string; description: string; children: React.ReactNode }) {
  return <section id={id} className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"><div className="mb-10 max-w-2xl"><Reveal><p className="eyebrow">{eyebrow}</p><h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2><p className="mt-4 text-base leading-7 text-slate-500">{description}</p></Reveal></div>{children}</section>;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return <motion.div initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: reduceMotion ? 0 : delay, duration: reduceMotion ? 0 : 0.5 }}>{children}</motion.div>;
}
