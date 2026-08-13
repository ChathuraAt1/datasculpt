'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, ChevronDown, ChevronRight, CreditCard, Database, Gauge, LockKeyhole, MessageSquare, RefreshCw, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';

type BillingCycle = 'monthly' | 'annual';
type PricingState = 'loading' | 'success' | 'fallback';
type Plan = { slug: string; name: string; description: string; monthlyPrice: number | null; yearlyPrice: number | null; currency: string; features: string[]; popular: boolean; isActive: boolean; fallback?: boolean };

const fallbackPlans: Plan[] = [
  { slug: 'developer', name: 'Developer', description: 'For individual engineers and small AI prototypes building initial data pipelines.', monthlyPrice: 49, yearlyPrice: 39, currency: 'USD', features: ['Core ingestion connectors', '25M records / month', 'Community support', 'Standard CPU execution'], popular: false, isActive: true, fallback: true },
  { slug: 'professional', name: 'Professional', description: 'For growing engineering teams needing GPU-accelerated data transformation.', monthlyPrice: 199, yearlyPrice: 159, currency: 'USD', features: ['GPU-accelerated transforms', '250M records / month', 'QualityGuard assertions', 'Priority support'], popular: true, isActive: true, fallback: true },
  { slug: 'scale', name: 'Scale', description: 'For high-throughput enterprise AI workloads and vector feature store preparation.', monthlyPrice: 499, yearlyPrice: 399, currency: 'USD', features: ['Multi-cluster workloads', '1B records / month', 'AI-ready feature preparation', 'Advanced observability'], popular: false, isActive: true, fallback: true },
  { slug: 'enterprise', name: 'Enterprise', description: 'For large organizations requiring custom VPC deployments and dedicated GPU clusters.', monthlyPrice: null, yearlyPrice: null, currency: 'USD', features: ['Custom VPC deployment', 'Dedicated GPU clusters', 'Security and SLA review', 'Architecture partnership'], popular: false, isActive: true, fallback: true },
];

const order = ['developer', 'professional', 'scale', 'enterprise'];
const featureRows = [
  ['Compute Acceleration', 'CPU execution', true, true, true, true],
  ['Compute Acceleration', 'GPU worker nodes', false, true, true, true],
  ['Compute Acceleration', 'Multi-cluster scheduling', false, false, true, true],
  ['Data Connectors', 'Core source connectors', true, true, true, true],
  ['Data Connectors', 'Warehouse and lake inputs', false, true, true, true],
  ['Quality Assertions', 'Schema and freshness checks', false, true, true, true],
  ['Quality Assertions', 'Advanced anomaly isolation', false, false, true, true],
  ['Security & SLAs', 'Standard support', true, true, true, true],
  ['Security & SLAs', 'Custom VPC and SLA', false, false, false, true],
] as const;

const estimatorBands = [
  { value: 100000, label: '100K', plan: 'Developer', workers: 0, speed: '2×', cost: '$49+' },
  { value: 1000000, label: '1M', plan: 'Developer', workers: 0, speed: '4×', cost: '$49+' },
  { value: 10000000, label: '10M', plan: 'Professional', workers: 2, speed: '18×', cost: '$199+' },
  { value: 50000000, label: '50M', plan: 'Scale', workers: 4, speed: '42×', cost: '$499+' },
  { value: 100000000, label: '100M+', plan: 'Enterprise', workers: 8, speed: '100×', cost: 'Custom' },
];

export default function PricingPage() {
  const [plans, setPlans] = useState<Plan[]>(fallbackPlans);
  const [pricingState, setPricingState] = useState<PricingState>('loading');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [volumeIndex, setVolumeIndex] = useState(2);
  const [checkoutPlan, setCheckoutPlan] = useState<Plan | null>(null);
  const [faq, setFaq] = useState<number | null>(0);

  const loadPlans = async () => {
    setPricingState('loading');
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, '');
    if (!baseUrl) { setPlans(fallbackPlans); setPricingState('fallback'); return; }
    try {
      const response = await fetch(`${baseUrl}/api/subscription-plans`, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('Pricing request failed');
      const payload: unknown = await response.json();
      const data = isRecord(payload) ? payload.data : null;
      const apiPlans = Array.isArray(data) ? data.map(normalizePlan).filter((plan): plan is Plan => plan !== null && plan.isActive) : [];
      if (!apiPlans.length) throw new Error('No active plans returned');
      const orderedPlans = order.map((slug) => apiPlans.find((plan) => plan.slug === slug)).filter((plan): plan is Plan => Boolean(plan));
      if (!orderedPlans.length) throw new Error('No supported active plans returned');
      setPlans(orderedPlans);
      setPricingState('success');
    } catch { setPlans(fallbackPlans); setPricingState('fallback'); }
  };

  useEffect(() => { void loadPlans(); }, []);

  const estimate = estimatorBands[volumeIndex];
  const priceLabel = (plan: Plan) => { const value = cycle === 'annual' ? plan.yearlyPrice : plan.monthlyPrice; return value === null ? 'Custom' : new Intl.NumberFormat('en-US', { style: 'currency', currency: plan.currency || 'USD', maximumFractionDigits: 0 }).format(value); };

  return <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-10 lg:px-8 lg:pt-14">
    <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl text-center"><Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-300"><span>Home</span><ChevronRight size={14} /><span className="text-brand-300">Pricing</span></Link><div className="mt-8"><span className="inline-flex rounded-full border border-brand-500/30 bg-brand-950/40 px-3.5 py-1.5 font-mono text-xs tracking-[0.16em] text-brand-400">TRANSPARENT ENTERPRISE PRICING</span></div><h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">Scale Your Data Pipelines. <span className="bg-gradient-to-r from-brand-200 via-brand-400 to-brand-300 bg-clip-text text-transparent">Pay Only for Compute.</span></h1><p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg">Choose the right plan for your data volume—from individual prototypes to multi-cluster GPU deployments.</p></motion.header>

    <div className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row"><div className="flex items-center gap-3 text-xs text-slate-500"><span className={`h-2 w-2 rounded-full ${pricingState === 'success' ? 'bg-brand-300' : 'bg-slate-600'}`} />{pricingState === 'success' ? 'Live pricing' : pricingState === 'loading' ? 'Loading plan catalog…' : 'Showing fallback pricing'}{pricingState === 'fallback' && <button onClick={() => void loadPlans()} className="ml-1 inline-flex items-center gap-1 text-brand-300 hover:text-brand-200"><RefreshCw size={12} />Retry</button>}</div><div className="inline-flex rounded-xl border border-slate-800 bg-slate-900/80 p-1" role="group" aria-label="Billing cycle"><button onClick={() => setCycle('monthly')} className={`rounded-lg px-4 py-2 text-sm ${cycle === 'monthly' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-brand-300'}`}>Monthly</button><button onClick={() => setCycle('annual')} className={`rounded-lg px-4 py-2 text-sm ${cycle === 'annual' ? 'bg-brand-400 font-semibold text-slate-950' : 'text-slate-500 hover:text-brand-300'}`}>Annual <span className="ml-1 font-mono text-[0.65rem]">(Save 20%)</span></button></div></div>

    <div className="mt-8 grid gap-5 lg:grid-cols-4">{plans.map((plan) => <PlanCard key={plan.slug} plan={plan} cycle={cycle} priceLabel={priceLabel(plan)} onCheckout={setCheckoutPlan} />)}</div>

    <Estimator volumeIndex={volumeIndex} setVolumeIndex={setVolumeIndex} estimate={estimate} />
    <Comparison />
    <FAQ faq={faq} setFaq={setFaq} />
    <motion.section id="contact-sales" className="mt-24 rounded-2xl border border-brand-500/30 bg-gradient-to-r from-slate-900 via-brand-950/20 to-slate-900 p-8 text-center shadow-[0_0_30px_rgba(234,179,8,0.08)] sm:p-10"><p className="eyebrow">READY WHEN YOU ARE</p><h2 className="mt-3 text-3xl font-semibold text-white">Build the right compute model for your data.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">Talk through volume, governance, deployment boundaries, and the path to production.</p><Button href="#contact-sales" className="mt-7">Contact the Data Team <MessageSquare size={15} /></Button></motion.section>
    <AnimatePresence>{checkoutPlan && <CheckoutModal plan={checkoutPlan} onClose={() => setCheckoutPlan(null)} />}</AnimatePresence>
  </div>;
}

function PlanCard({ plan, cycle, priceLabel, onCheckout }: { plan: Plan; cycle: BillingCycle; priceLabel: string; onCheckout: (plan: Plan) => void }) {
  const popular = plan.popular;
  const isCustom = priceLabel === 'Custom';
  return <motion.article whileHover={{ y: popular ? -4 : -2 }} className={`relative flex min-h-[475px] flex-col justify-between rounded-2xl p-6 text-slate-100 transition-all ${popular ? 'z-10 scale-[1.02] border-2 border-brand-400 bg-slate-900/90 shadow-[0_0_35px_rgba(234,179,8,0.2)]' : 'border border-slate-800 bg-slate-900/80 hover:border-brand-500/30'}`}>{popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-400 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-950">MOST POPULAR FOR DATA TEAMS</span>}<div><div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-white">{plan.name}</h2>{plan.fallback && <span className="font-mono text-[0.58rem] text-slate-600">REFERENCE</span>}</div><p className="mt-3 min-h-[72px] text-sm leading-6 text-slate-400">{plan.description}</p><div className="mt-6 flex items-end gap-2"><span className="text-4xl font-extrabold text-white">{priceLabel}</span>{!isCustom && <span className="mb-1 text-sm text-slate-400">/{cycle === 'annual' ? 'mo annual' : 'month'}</span>}</div>{cycle === 'annual' && !isCustom && <span className="mt-2 inline-flex rounded-full bg-brand-400/10 px-2 py-1 font-mono text-[0.62rem] text-brand-300">SAVE 20%</span>}<ul className="mt-7 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-300"><Check size={16} className="mt-0.5 shrink-0 text-brand-300" />{feature}</li>)}</ul></div><button onClick={() => onCheckout(plan)} disabled={!plan.slug} className={`mt-8 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:cursor-not-allowed disabled:opacity-50 ${popular ? 'bg-brand-400 text-slate-950 shadow-brand hover:bg-brand-300' : 'border border-slate-700 bg-slate-950/60 text-slate-300 hover:border-brand-500/50 hover:text-brand-300'}`}>{isCustom ? 'Contact Enterprise Team' : plan.name === 'Developer' ? 'Start Developer Plan' : plan.name === 'Professional' ? 'Launch Professional Plan' : 'Upgrade to Scale'}<ArrowRight size={15} /></button></motion.article>;
}

function Estimator({ volumeIndex, setVolumeIndex, estimate }: { volumeIndex: number; setVolumeIndex: (value: number) => void; estimate: typeof estimatorBands[number] }) {
  return <section id="estimator" className="mt-24 scroll-mt-24"><div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]"><GlassCard className="p-6 sm:p-8"><p className="eyebrow">COMPUTE PLANNING TOOL</p><h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">Estimate Your Monthly Processing Costs</h2><p className="mt-3 text-sm leading-6 text-slate-400">Adjust the monthly record volume to see an illustrative plan and worker recommendation. This is guidance, not a live invoice.</p><label htmlFor="volume" className="mt-8 block font-mono text-xs uppercase tracking-wider text-slate-500">Monthly record volume: <span className="text-brand-300">{estimate.label} records</span></label><input id="volume" type="range" min="0" max={estimatorBands.length - 1} value={volumeIndex} onChange={(event) => setVolumeIndex(Number(event.target.value))} className="mt-5 w-full accent-brand-400" /><div className="mt-3 flex justify-between font-mono text-[0.62rem] text-slate-600"><span>100K</span><span>1M</span><span>10M</span><span>50M</span><span>100M+</span></div></GlassCard><GlassCard className="flex flex-col justify-between border-brand-500/30 p-6 sm:p-8"><div><p className="font-mono text-xs uppercase tracking-wider text-slate-500">Recommended configuration</p><p className="mt-3 text-2xl font-semibold text-brand-300">{estimate.plan} Plan</p><p className="mt-2 text-sm text-slate-400">{estimate.workers ? `${estimate.workers} GPU worker nodes` : 'Standard compute worker'}</p></div><div className="mt-8 grid grid-cols-2 gap-3"><div className="rounded-lg bg-slate-950/70 p-3"><Gauge size={16} className="text-brand-400" /><p className="mt-2 font-mono text-lg text-white">{estimate.speed}</p><p className="font-mono text-[0.6rem] text-slate-500">CPU speedup</p></div><div className="rounded-lg bg-slate-950/70 p-3"><Zap size={16} className="text-brand-400" /><p className="mt-2 font-mono text-lg text-white">{estimate.cost}</p><p className="font-mono text-[0.6rem] text-slate-500">estimated entry</p></div></div></GlassCard></div></section>;
}

function Comparison() {
  return <section className="mt-24 scroll-mt-24"><p className="eyebrow">PLAN COMPARISON</p><h2 className="mt-3 text-3xl font-semibold text-white">Choose the operating surface you need.</h2><div className="mt-8 overflow-x-auto rounded-2xl border border-slate-800"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-900/90 font-mono text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-4">Capability</th>{['Developer', 'Professional', 'Scale', 'Enterprise'].map((name) => <th key={name} className="px-5 py-4">{name}</th>)}</tr></thead><tbody>{featureRows.map(([category, feature, ...support], index) => <tr key={feature} className="border-t border-slate-800/80"><td className="px-5 py-4"><span className="block font-mono text-[0.58rem] uppercase tracking-wider text-brand-500">{index === 0 || featureRows[index - 1][0] !== category ? category : ''}</span><span className="text-slate-300">{feature}</span></td>{support.map((enabled, cellIndex) => <td key={`${feature}-${cellIndex}`} className="px-5 py-4">{enabled ? <Check size={17} className="text-brand-300" /> : <span className="text-slate-700">—</span>}</td>)}</tr>)}</tbody></table></div></section>;
}

const faqs = ['How does usage-based compute billing work?', 'Can we deploy DataSculpt within our own AWS/GCP VPC?', 'What happens if our data pipeline volume spikes unexpectedly?', 'Are there discounts available for educational or open-source projects?'];
function FAQ({ faq, setFaq }: { faq: number | null; setFaq: (value: number | null) => void }) {
  return <section className="mx-auto mt-24 max-w-4xl scroll-mt-24"><p className="eyebrow text-center">FREQUENTLY ASKED QUESTIONS</p><h2 className="mt-3 text-center text-3xl font-semibold text-white">Pricing, clarified.</h2><div className="mt-8 divide-y divide-slate-800 rounded-2xl border border-slate-800 bg-slate-900/70">{faqs.map((question, index) => <div key={question}><button type="button" onClick={() => setFaq(faq === index ? null : index)} aria-expanded={faq === index} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-sm font-semibold text-slate-200 hover:text-brand-300"><span>{question}</span><ChevronDown size={17} className={`shrink-0 transition ${faq === index ? 'rotate-180 text-brand-300' : 'text-slate-600'}`} /></button><AnimatePresence initial={false}>{faq === index && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="px-5 pb-5 text-sm leading-6 text-slate-400">{answerFor(index)}</p></motion.div>}</AnimatePresence></div>)}</div></section>;
}

function answerFor(index: number) { return ['Compute planning starts with the selected plan and workload profile. Final usage, worker capacity, and commercial terms are confirmed with the DataSculpt team before production deployment.', 'Yes. Isolated VPC and private deployment models are available as enterprise architecture options across AWS, GCP, and Azure, subject to an architecture review.', 'The estimator provides a first recommendation for increased worker capacity or a higher tier. Contact the DataSculpt team when volume patterns become production-critical so capacity and SLA coverage can be reviewed.', 'Discounts are reviewed case by case for eligible educational and open-source projects. Contact the team with your project details for consideration.'][index]; }

function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
function normalizePlan(value: unknown): Plan | null { if (!isRecord(value) || typeof value.slug !== 'string' || typeof value.name !== 'string') return null; const monthly = toPrice(value.monthly_price); const yearly = toPrice(value.yearly_price); const legacy = toPrice(value.price); return { slug: value.slug, name: value.name, description: typeof value.description === 'string' ? value.description : '', monthlyPrice: monthly ?? (value.interval === 'monthly' ? legacy : null), yearlyPrice: yearly ?? (value.interval === 'yearly' ? legacy : null), currency: typeof value.currency === 'string' ? value.currency : 'USD', features: Array.isArray(value.features) ? value.features.filter((feature): feature is string => typeof feature === 'string') : [], popular: value.popular === true, isActive: value.is_active !== false }; }
function toPrice(value: unknown): number | null { if (typeof value === 'number' && Number.isFinite(value)) return value; if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value); return null; }

function CheckoutModal({ plan, onClose }: { plan: Plan; onClose: () => void }) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const token = window.localStorage.getItem('datasculpt_token'); if (!token) { setStatus('Sign in is required before starting a subscription.'); return; } const form = new FormData(event.currentTarget); const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, ''); if (!baseUrl) { setStatus('Subscription service is not configured.'); return; } setLoading(true); setStatus(''); try { const response = await fetch(`${baseUrl}/api/subscriptions`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ plan_slug: plan.slug, payment_method: { card_number: form.get('card_number'), expiry_month: form.get('expiry_month'), expiry_year: form.get('expiry_year'), cvv: form.get('cvv'), card_holder: form.get('card_holder') }, billing_address: { country: form.get('country') } }) }); const payload = await response.json().catch(() => null); if (!response.ok) throw new Error(isRecord(payload) && typeof payload.message === 'string' ? payload.message : 'Subscription could not be completed.'); setStatus('Subscription request completed successfully.'); event.currentTarget.reset(); } catch (error) { setStatus(error instanceof Error ? error.message : 'Subscription could not be completed.'); } finally { setLoading(false); } }
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`Start ${plan.name} plan`}><motion.div initial={{ y: 20, scale: 0.98 }} animate={{ y: 0, scale: 1 }} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-brand-500/30 bg-slate-900 p-6 shadow-[0_0_35px_rgba(234,179,8,0.18)]"><div className="flex items-start justify-between"><div><p className="eyebrow">SUBSCRIPTION REQUEST</p><h2 className="mt-2 text-2xl font-semibold text-white">{plan.name} Plan</h2></div><button onClick={onClose} className="text-slate-500 hover:text-brand-300" aria-label="Close checkout">×</button></div><form onSubmit={submit} className="mt-6 space-y-4"><div><label className="text-xs text-slate-400">Card holder<input required name="card_holder" className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-white outline-none focus:border-brand-400" /></label></div><div><label className="text-xs text-slate-400">Card number<input required name="card_number" inputMode="numeric" className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-sm text-white outline-none focus:border-brand-400" /></label></div><div className="grid grid-cols-3 gap-3">{[['expiry_month', 'MM'], ['expiry_year', 'YY'], ['cvv', 'CVV']].map(([name, label]) => <label key={name} className="text-xs text-slate-400">{label}<input required name={name} className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-3 font-mono text-sm text-white outline-none focus:border-brand-400" /></label>)}</div><label className="text-xs text-slate-400">Billing country<input required name="country" defaultValue="US" className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-sm text-white outline-none focus:border-brand-400" /></label><p className="flex gap-2 text-xs leading-5 text-slate-500"><LockKeyhole size={14} className="mt-0.5 shrink-0 text-brand-400" />Payment details are sent only to the documented subscription endpoint and are not stored by this page.</p>{status && <p className="rounded-lg border border-brand-500/20 bg-brand-950/30 p-3 text-sm text-brand-300">{status}</p>}<div className="flex gap-3 pt-2"><Button>{loading ? 'Submitting…' : 'Submit Subscription'} <CreditCard size={15} /></Button><button type="button" onClick={onClose} className="inline-flex items-center justify-center rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-brand-500/60 hover:text-brand-200">Cancel</button></div></form></motion.div></motion.div>;
}
