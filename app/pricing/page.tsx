'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  Database,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Workflow,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EditorialButton } from '@/components/ui/EditorialButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/home/Reveal';
import { apiBaseUrl } from '@/lib/auth';
import { fallbackPlans, normalizePlanCatalog, type BillingCycle, type SubscriptionPlan } from '@/lib/plans';

type PricingState = 'loading' | 'success' | 'fallback';
type Plan = SubscriptionPlan;
const selectorOptions = [
  { title: 'I’m exploring a workflow', slug: 'developer', message: 'Start small, test ideas, and understand what DataSculpt can do.' },
  { title: 'I’m building with a team', slug: 'professional', message: 'Give a growing data team stronger transformation and quality workflows.' },
  { title: 'I’m preparing for production scale', slug: 'scale', message: 'Support high-volume workloads and more advanced operating needs.' },
  { title: 'I need a tailored enterprise deployment', slug: 'enterprise', message: 'Work with the DataSculpt team on deployment, security, and capacity requirements.' },
];
const estimatorBands = [
  { label: 'Exploring', plan: 'Developer', workers: 'Standard compute', price: '$49+', description: 'A simple place to test an initial workflow.' },
  { label: 'Growing', plan: 'Developer', workers: 'Standard compute', price: '$49+', description: 'For a focused workflow that is gaining momentum.' },
  { label: 'Production', plan: 'Professional', workers: 'GPU worker guidance', price: '$199+', description: 'For teams building repeatable production workflows.' },
  { label: 'High volume', plan: 'Scale', workers: 'Multi-worker guidance', price: '$499+', description: 'For demanding workloads and broader operating needs.' },
  { label: 'Enterprise scale', plan: 'Enterprise', workers: 'Tailored capacity plan', price: 'Custom', description: 'For custom deployment, security, and capacity requirements.' },
];
const technicalTopics = [
  ['Compute acceleration', 'Professional and above can include GPU worker capacity. Technical planning may reference cuDF, CUDA-X, and Apache Arrow depending on workload needs.'],
  ['Data volume and workload planning', 'Plan selection is a starting point. Final capacity depends on source shape, transformation complexity, run frequency, retention, and deployment model.'],
  ['Quality and governance capabilities', 'QualityGuard capabilities can include schema, freshness, completeness, validity, and anomaly-oriented checks across supported workflows.'],
  ['Enterprise deployment options', 'Enterprise discussions can cover isolated VPC deployment, private infrastructure, regional requirements, and architecture review.'],
  ['Support and SLA considerations', 'Support levels and SLA coverage are confirmed according to the selected plan or enterprise order terms.'],
] as const;
const faqs = [
  ['How does usage-based compute billing work?', 'Compute planning starts with the selected plan and workload profile. Final usage, worker capacity, and commercial terms are confirmed with the DataSculpt team before production deployment.'],
  ['Can we deploy DataSculpt within our own AWS/GCP VPC?', 'Yes. Isolated VPC and private deployment models are available as enterprise architecture options across AWS, GCP, and Azure, subject to an architecture review.'],
  ['What happens if our data pipeline volume spikes unexpectedly?', 'The estimator provides an early recommendation for increased capacity or a higher tier. Contact the DataSculpt team when volume becomes production-critical so capacity and SLA coverage can be reviewed.'],
  ['Are there discounts available for educational or open-source projects?', 'Discounts are reviewed case by case for eligible educational and open-source projects. Contact the team with your project details for consideration.'],
] as const;

export default function PricingPage() {
  const reducedMotion = useReducedMotion();
  const [plans, setPlans] = useState<Plan[]>(fallbackPlans);
  const [pricingState, setPricingState] = useState<PricingState>('loading');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [selectedPath, setSelectedPath] = useState(0);
  const [volumeIndex, setVolumeIndex] = useState(2);
  const [openTechnical, setOpenTechnical] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const selectedOption = selectorOptions[selectedPath];

  async function loadPlans() {
    setPricingState('loading');
    const baseUrl = apiBaseUrl();
    if (!baseUrl) { setPlans(fallbackPlans); setPricingState('fallback'); return; }
    try {
      const response = await fetch(`${baseUrl}/api/subscription-plans`, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Pricing request failed');
      const payload: unknown = await response.json();
      const data = isRecord(payload) ? payload.data : null;
      const active = normalizePlanCatalog(data);
      if (!active.length) throw new Error('No active plans returned');
      setPlans(active); setPricingState('success');
    } catch { setPlans(fallbackPlans); setPricingState('fallback'); }
  }

  useEffect(() => { void loadPlans(); }, []);
  const priceLabel = (plan: Plan) => { const value = cycle === 'annual' ? plan.yearlyPrice : plan.monthlyPrice; return value === null ? 'Custom' : new Intl.NumberFormat('en-US', { style: 'currency', currency: plan.currency || 'USD', maximumFractionDigits: 0 }).format(value); };

  return <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:pt-12 lg:px-8">
    <Reveal><header className="grid items-end gap-10 lg:grid-cols-[1fr_0.8fr]"><div><Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-brand-600"><span>Home</span><ChevronRight size={14} /><span className="text-brand-600">Pricing</span></Link><p className="eyebrow mt-10">PRICING THAT SCALES WITH YOUR WORK</p><h1 className="mt-4 max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-slate-900 sm:text-6xl">Choose the right starting point for your data workflow.</h1></div><div><p className="max-w-xl text-lg leading-8 text-slate-600">Move from early experimentation to trusted production workflows with a plan that grows around the work your team is ready to do.</p><div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center"><EditorialButton href="#plan-selector" icon={<ArrowRight size={17} />}>Find your starting point</EditorialButton><Link href="/contact/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Talk through your use case <ArrowRight size={15} /></Link></div></div></header></Reveal>

    <Reveal><div className="mt-14 grid min-h-[250px] items-end overflow-hidden rounded-[2rem] border border-brand-100 bg-brand-100/60 p-7 sm:min-h-[320px] sm:p-10 lg:grid-cols-[1fr_0.6fr]"><div><p className="eyebrow">A PLAN FOR THE NEXT STEP</p><p className="mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl">Start where the workflow is today. Grow when the work is ready.</p></div><div className="relative mt-8 h-32 lg:mt-0"><div className="absolute bottom-0 right-[8%] h-32 w-32 rounded-full border border-brand-300/50 bg-brand-200/30" /><div className="absolute bottom-7 right-[16%] h-20 w-20 rounded-full border border-brand-500/40" /><div className="absolute bottom-14 right-[24%] h-8 w-8 rounded-full bg-brand-500 shadow-brand" /></div></div></Reveal>

    <Reveal><section id="plan-selector" className="scroll-mt-24 pt-24"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">CHOOSE YOUR STARTING POINT</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl">Which best describes your next step?</h2></div><div className="flex items-center gap-2 text-xs text-slate-500"><span className={`h-2 w-2 rounded-full ${pricingState === 'success' ? 'bg-brand-500' : 'bg-slate-400'}`} />{pricingState === 'success' ? 'Live pricing' : pricingState === 'loading' ? 'Loading plan catalog…' : 'Showing reference pricing'}{pricingState === 'fallback' && <button type="button" onClick={() => void loadPlans()} className="ml-1 inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-500"><RefreshCw size={12} />Retry</button>}</div></div><div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">{selectorOptions.map((option, index) => { const active = selectedPath === index; return <button key={option.slug} type="button" aria-pressed={active} onClick={() => setSelectedPath(index)} className={`rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${active ? 'border-brand-400 bg-white shadow-panel' : 'border-brand-100 bg-white/55 hover:border-brand-300'}`}><span className={`grid h-8 w-8 place-items-center rounded-full ${active ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-700'}`}>{index + 1}</span><p className="mt-5 font-semibold text-slate-900">{option.title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{option.message}</p><p className="mt-4 text-xs font-semibold uppercase tracking-[0.13em] text-brand-700">Recommended: {option.slug}</p></button>; })}</div><div className="mt-5 rounded-2xl border border-brand-300/60 bg-brand-100/55 p-5"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-700">YOUR RECOMMENDED START</p><p className="mt-2 text-xl font-semibold text-slate-900">{selectedOption.message}</p></div><Link href={`#${selectedOption.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-500">View {selectedOption.slug} <ArrowRight size={15} /></Link></div></div></section></Reveal>

    <Reveal><section className="pt-12"><div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="eyebrow">PLANS THAT MEET YOU WHERE YOU ARE</p><p className="mt-2 text-sm text-slate-600">Prices are shown in the plan currency returned by the pricing service.</p></div><div className="inline-flex self-start rounded-xl border border-brand-200 bg-white p-1 shadow-sm" role="group" aria-label="Billing cycle"><button type="button" aria-pressed={cycle === 'monthly'} onClick={() => setCycle('monthly')} className={`rounded-lg border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${cycle === 'monthly' ? 'border-brand-400 bg-brand-100 font-semibold text-slate-900' : 'border-transparent bg-white text-slate-600 hover:border-brand-200 hover:text-brand-700'}`}>Monthly</button><button type="button" aria-pressed={cycle === 'annual'} onClick={() => setCycle('annual')} className={`rounded-lg border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${cycle === 'annual' ? 'border-brand-500 bg-brand-500 font-semibold text-white' : 'border-transparent bg-white text-slate-600 hover:border-brand-200 hover:text-brand-700'}`}>Annual <span className="ml-1 text-[0.65rem] font-semibold">Save 20%</span></button></div></div><div className="grid gap-5 lg:grid-cols-4">{plans.map((plan) => <PlanCard key={plan.slug} plan={plan} cycle={cycle} price={priceLabel(plan)} recommended={plan.slug === selectedOption.slug} />)}</div></section></Reveal>

    <Reveal><section className="pt-28"><div className="grid gap-6 lg:grid-cols-[1fr_0.78fr]"><GlassCard className="border-brand-100 bg-white/65 p-6 sm:p-8"><p className="eyebrow">WORKLOAD PLANNING GUIDE</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">See where your workload may fit.</h2><p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">Use this as an early planning guide. Final capacity and commercial terms are confirmed with the DataSculpt team.</p><label htmlFor="volume" className="mt-8 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Current stage: <span className="text-brand-700">{estimatorBands[volumeIndex].label}</span></label><input id="volume" type="range" min="0" max={estimatorBands.length - 1} value={volumeIndex} onChange={(event) => setVolumeIndex(Number(event.target.value))} className="mt-5 w-full accent-brand-500" /><div className="mt-3 flex justify-between text-[0.65rem] font-semibold text-slate-500">{estimatorBands.map((band) => <span key={band.label}>{band.label}</span>)}</div></GlassCard><GlassCard className="border-brand-300/60 bg-brand-100/60 p-6 sm:p-8"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">ILLUSTRATIVE PLANNING ESTIMATE</p><p className="mt-4 text-3xl font-semibold text-slate-900">{estimatorBands[volumeIndex].plan} plan</p><p className="mt-2 text-sm leading-6 text-slate-600">{estimatorBands[volumeIndex].description}</p><div className="mt-7 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/75 p-4"><p className="text-xs text-slate-500">Entry point</p><p className="mt-2 text-xl font-semibold text-slate-900">{estimatorBands[volumeIndex].price}</p></div><div className="rounded-xl bg-white/75 p-4"><p className="text-xs text-slate-500">Capacity guide</p><p className="mt-2 text-sm font-semibold text-slate-900">{estimatorBands[volumeIndex].workers}</p></div></div></GlassCard></div></section></Reveal>

    <Reveal><section className="pt-28"><div className="mx-auto max-w-2xl text-center"><p className="eyebrow">OPTIONAL TECHNICAL DETAIL</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl">Technical pricing notes.</h2><p className="mt-4 text-slate-600">Open the details when you are comparing architecture, deployment, and operating requirements.</p></div><div className="mx-auto mt-8 max-w-4xl divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white/65">{technicalTopics.map(([title, body], index) => { const open = openTechnical === index; return <div key={title}><button type="button" aria-expanded={open} onClick={() => setOpenTechnical(open ? null : index)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-semibold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 sm:px-7"><span>{title}</span><ChevronDown size={18} className={`text-brand-600 transition ${open ? 'rotate-180' : ''}`} /></button><AnimatePresence initial={false}>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="overflow-hidden"><p className="px-5 pb-6 text-sm leading-7 text-slate-600 sm:px-7">{body}</p></motion.div>}</AnimatePresence></div>; })}</div></section></Reveal>

    <Reveal><section className="mx-auto max-w-4xl pt-28"><p className="eyebrow text-center">FREQUENTLY ASKED QUESTIONS</p><h2 className="mt-3 text-center text-3xl font-semibold tracking-[-0.04em] text-slate-900">Pricing, clarified.</h2><div className="mt-8 divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white/65">{faqs.map(([question, answer], index) => { const open = openFaq === index; return <div key={question}><button type="button" aria-expanded={open} onClick={() => setOpenFaq(open ? null : index)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-sm font-semibold text-slate-800 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 sm:px-7"><span>{question}</span><ChevronDown size={17} className={`shrink-0 text-brand-600 transition ${open ? 'rotate-180' : ''}`} /></button><AnimatePresence initial={false}>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="px-5 pb-6 text-sm leading-7 text-slate-600 sm:px-7">{answer}</p></motion.div>}</AnimatePresence></div>; })}</div></section></Reveal>

    <Reveal><section className="mt-28 grid gap-8 overflow-hidden rounded-[2rem] border border-brand-300/60 bg-white shadow-panel lg:grid-cols-[1fr_0.8fr]"><div className="p-8 sm:p-12"><p className="eyebrow">A TAILORED NEXT STEP</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-900">Need a pricing model built around your environment?</h2><p className="mt-5 max-w-xl leading-7 text-slate-600">Share your workload, deployment expectations, and growth plans with the DataSculpt team.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><EditorialButton href="/contact/" icon={<MessageSquare size={17} />}>Talk through your use case</EditorialButton><Button href="/products/" variant="ghost">Explore the platform <ArrowRight size={15} /></Button></div></div><div className="relative min-h-[270px] bg-brand-100/75 p-7" aria-hidden="true"><div className="absolute right-10 top-10 h-44 w-44 rounded-full border border-brand-300/60" /><div className="absolute right-20 top-20 h-24 w-24 rounded-full bg-brand-300/45 blur-xl" /><div className="absolute bottom-8 left-7 rounded-2xl border border-white/80 bg-white/75 p-4 text-sm font-semibold text-slate-800 backdrop-blur">A clearer model for what comes next.</div></div></section></Reveal>
  </div>;
}

function PlanCard({ plan, cycle, price, recommended }: { plan: Plan; cycle: BillingCycle; price: string; recommended: boolean }) {
  const custom = price === 'Custom';
  const cta = custom ? 'Talk to Enterprise' : plan.name === 'Developer' ? 'Start with Developer' : plan.name === 'Professional' ? 'Start with Professional' : 'Start with Scale';
  const href = custom ? '/contact/' : `/checkout/?plan=${encodeURIComponent(plan.slug)}&cycle=${cycle}`;
  return <motion.article whileHover={{ y: -3 }} className={`relative flex min-h-[445px] flex-col justify-between rounded-2xl border p-6 transition ${recommended ? 'border-brand-400 bg-white shadow-panel' : 'border-brand-100 bg-white/65 hover:border-brand-300'}`}>{recommended && <span className="absolute -top-3 left-5 rounded-full bg-brand-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">Recommended for you</span>}{plan.popular && !recommended && <span className="absolute -top-3 left-5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">Popular for data teams</span>}<div><div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-slate-900">{plan.name}</h2>{plan.fallback && <span className="text-[0.58rem] font-semibold uppercase tracking-wider text-slate-400">Reference</span>}</div><p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-600">{plan.description}</p><div className="mt-6 flex items-end gap-2"><span className="text-4xl font-extrabold text-slate-900">{price}</span>{!custom && <span className="mb-1 text-sm text-slate-500">/{cycle === 'annual' ? 'mo annual' : 'month'}</span>}</div>{cycle === 'annual' && !custom && <span className="mt-2 inline-flex rounded-full bg-brand-100 px-2 py-1 text-[0.62rem] font-semibold text-brand-700">SAVE 20%</span>}<ul className="mt-7 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-700"><Check size={16} className="mt-0.5 shrink-0 text-brand-600" />{feature}</li>)}</ul></div><Link href={href} aria-disabled={!plan.slug} className={`mt-8 inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${recommended ? 'border-brand-500 bg-brand-500 text-slate-950 shadow-brand hover:bg-brand-600' : 'border-slate-800 bg-slate-900 text-white hover:border-brand-400 hover:bg-slate-800'} ${!plan.slug ? 'pointer-events-none opacity-50' : ''}`}>{cta}<ArrowRight size={15} /></Link></motion.article>;
}

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
