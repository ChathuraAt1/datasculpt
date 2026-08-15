'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronRight, Clock3, Globe2, Mail, MessageSquare, Network, Send, ShieldCheck, TriangleAlert } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { EditorialButton } from '@/components/ui/EditorialButton';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/home/Reveal';
import { apiBaseUrl } from '@/lib/auth';
import { useConsent } from '@/components/consent/ConsentContext';

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';
type ContactForm = { name: string; email: string; company: string; workload: string; message: string };
type TurnstileApi = { render: (element: HTMLElement, options: { sitekey: string; action: string; callback: (token: string) => void; 'expired-callback': () => void; 'error-callback': () => void }) => string | number; reset: (widgetId?: string | number) => void };

declare global { interface Window { turnstile?: TurnstileApi } }

const initialForm: ContactForm = { name: '', email: '', company: '', workload: '', message: '' };
const workloads = ['<1TB / month', '1TB - 10TB', '10TB - 100TB', '100TB+ Petabyte Scale'];
const conversations = [
  { title: 'Improve a current data workflow', message: 'Tell us what is slowing the current workflow down.' },
  { title: 'Prepare data for enterprise AI', message: 'Tell us what your AI or analytics initiative needs next.' },
  { title: 'Explore a custom deployment', message: 'Tell us about your deployment, security, or regional requirements.' },
  { title: 'Request a technical demonstration', message: 'Tell us which workflow or capability you would like to see.' },
  { title: 'Discuss a partnership', message: 'Tell us what kind of partnership you are exploring.' },
];
const faqs = [
  ['What is the typical onboarding timeline for custom VPC deployments?', 'Most architecture reviews begin with a workload and security discovery session, followed by a scoped deployment plan. The final timeline depends on network boundaries, compliance requirements, and cluster readiness.'],
  ['Can we run a proof-of-concept benchmark on our own dataset?', 'Yes. POC benchmarks can be scoped around representative workloads, source formats, quality assertions, and target throughput. Contact the architecture team to define a safe evaluation boundary.'],
  ['Do you offer non-disclosure agreements (NDAs) prior to data architecture audits?', 'NDA discussions can be included before sharing sensitive architecture, workload, or dataset details. Mention your requirements in the inquiry and the team will coordinate the appropriate next step.'],
] as const;

export default function ContactPage() {
  const reducedMotion = useReducedMotion();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || '';
  const { optionalAllowed, openPreferences } = useConsent();
  const captchaRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | number | null>(null);
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [conversation, setConversation] = useState(0);
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [captchaReady, setCaptchaReady] = useState(false);
  const [state, setState] = useState<SubmissionState>('idle');
  const [error, setError] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const selectedConversation = conversations[conversation];

  useEffect(() => {
    if (!siteKey || !optionalAllowed || !captchaRef.current) {
      if (widgetId.current !== null && window.turnstile) window.turnstile.reset(widgetId.current);
      widgetId.current = null;
      setCaptchaToken('');
      setCaptchaReady(false);
      return;
    }
    const render = () => {
      if (!window.turnstile || !captchaRef.current || widgetId.current !== null) return;
      widgetId.current = window.turnstile.render(captchaRef.current, { sitekey: siteKey, action: 'contact', callback: (token) => { setCaptchaToken(token); setCaptchaError(''); setCaptchaReady(true); }, 'expired-callback': () => { setCaptchaToken(''); setCaptchaError('Verification expired. Please complete the check again.'); }, 'error-callback': () => { setCaptchaToken(''); setCaptchaError('Verification could not be completed. Please try again.'); } });
      setCaptchaReady(true);
    };
    const existing = document.querySelector('script[data-datasculpt-turnstile]');
    if (existing) {
      render();
      if (!window.turnstile) existing.addEventListener('load', render, { once: true });
      return () => existing.removeEventListener('load', render);
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true; script.defer = true; script.dataset.datasculptTurnstile = 'true'; script.onload = render; document.head.appendChild(script);
    return () => { if (widgetId.current !== null && window.turnstile) window.turnstile.reset(widgetId.current); widgetId.current = null; };
  }, [optionalAllowed, siteKey]);

  function resetCaptcha() { setCaptchaToken(''); setCaptchaError(''); if (widgetId.current !== null && window.turnstile) window.turnstile.reset(widgetId.current); }
  function updateField(field: keyof ContactForm, value: string) { setForm((current) => ({ ...current, [field]: value })); if (state === 'error') { setState('idle'); setError(''); } }

  async function submitInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState('submitting'); setError('');
    if (siteKey && !optionalAllowed) { setState('error'); setCaptchaError('Optional verification is disabled. Review your privacy preferences to enable the secure contact form.'); return; }
    if (siteKey && !captchaToken) { setState('error'); setCaptchaError('Please complete the verification before sending your inquiry.'); return; }
    const base = apiBaseUrl();
    if (!base) { setState('error'); setError('The contact service is not configured. Please email our architects directly.'); return; }
    const message = `Company: ${form.company}\nExpected workload: ${form.workload}\nInquiry type: ${selectedConversation.title}\n\nMessage:\n${form.message}`;
    const body: Record<string, string> = { name: form.name, email: form.email, message };
    if (captchaToken) body.turnstile_token = captchaToken;
    try {
      const response = await fetch(`${base}/api/mail/contact`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) { resetCaptcha(); throw new Error(messageFrom(payload, response.status === 500 ? 'The message service is temporarily unavailable. Please try again or email our architects directly.' : 'We could not send your inquiry. Please review the form and try again.')); }
      setForm(initialForm); resetCaptcha(); setState('success');
    } catch (submissionError) { setState('error'); setError(submissionError instanceof Error ? submissionError.message : 'We could not send your inquiry. Please try again.'); }
  }

  return <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:pt-12 lg:px-8">
    <Reveal><header className="grid items-end gap-10 lg:grid-cols-[1fr_0.8fr]"><div><Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600"><span>Home</span><ChevronRight size={14} /><span className="text-brand-600">Contact Us</span></Link><p className="eyebrow mt-10">START A USEFUL CONVERSATION</p><h1 className="mt-4 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-slate-900 sm:text-6xl">Let&apos;s make your next data workflow clearer.</h1></div><div><p className="max-w-xl text-lg leading-8 text-slate-600">Tell us what your team is trying to improve, and we&apos;ll help identify a practical path forward.</p><div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center"><EditorialButton href="#contact-form" icon={<Send size={17} />}>Start your conversation</EditorialButton><a href="mailto:architects@datasculpt.lk" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Email the architecture team <Mail size={15} /></a></div></div></header></Reveal>
    <Reveal><div className="relative mt-14 min-h-[390px] overflow-hidden rounded-[2rem] border border-brand-100 bg-brand-100/60 sm:min-h-[500px]" aria-hidden="true"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center opacity-70" /><div className="absolute inset-0 bg-gradient-to-r from-brand-50/95 via-brand-50/35 to-brand-900/20" /><div className="absolute bottom-7 left-7 max-w-md rounded-2xl border border-white bg-white/90 p-5 text-lg font-semibold leading-7 text-slate-900 shadow-panel backdrop-blur-md sm:bottom-10 sm:left-10 sm:p-7">The clearest path starts with the work you want to move forward.</div></div></Reveal>

    <Reveal><section id="contact-form" className="scroll-mt-24 pt-24"><div className="mb-8 max-w-3xl"><p className="eyebrow">CHOOSE YOUR CONVERSATION</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl">What would you like to make easier?</h2><p className="mt-4 text-slate-600">Choose the closest starting point. You can add the detail that matters most in the message below.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{conversations.map((item, index) => <button key={item.title} type="button" aria-pressed={conversation === index} onClick={() => setConversation(index)} className={`rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${conversation === index ? 'border-brand-400 bg-white shadow-panel' : 'border-brand-100 bg-white/55 hover:border-brand-300'}`}><span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${conversation === index ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-700'}`}>{index + 1}</span><span className="mt-4 block text-sm font-semibold leading-5 text-slate-900">{item.title}</span></button>)}</div></section></Reveal>

    <section className="grid items-start gap-8 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12"><Reveal><GlassCard className="bg-white/75 p-6 sm:p-8"><div className="flex items-start gap-4 border-b border-brand-100 pb-5"><span className="grid h-11 w-11 place-items-center rounded-xl border border-brand-200 bg-brand-50 text-brand-700"><MessageSquare size={20} /></span><div><p className="eyebrow">TELL US WHAT YOU&apos;RE BUILDING</p><h2 className="mt-2 text-2xl font-semibold text-slate-900">{selectedConversation.message}</h2></div></div><AnimatePresence mode="wait">{state === 'success' && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex gap-3 rounded-xl border border-brand-300 bg-brand-50 p-4 text-sm leading-6 text-brand-800" role="status"><CheckCircle2 className="mt-0.5 shrink-0" size={18} />Inquiry received. A Data Architect will respond within 4 business hours.</motion.div>}{state === 'error' && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex gap-3 rounded-xl border border-brand-300 bg-brand-50 p-4 text-sm leading-6 text-brand-800" role="alert"><TriangleAlert className="mt-0.5 shrink-0" size={18} />{error}</motion.div>}</AnimatePresence><form onSubmit={submitInquiry} className="mt-7 space-y-5"><div className="grid gap-5 sm:grid-cols-2"><Field label="Full name" value={form.name} onChange={(value) => updateField('name', value)} required placeholder="Jane Doe" autoComplete="name" /><Field label="Work email" type="email" value={form.email} onChange={(value) => updateField('email', value)} required placeholder="jane@company.com" autoComplete="email" /></div><Field label="Company / organization" value={form.company} onChange={(value) => updateField('company', value)} required placeholder="Acme Data Systems" autoComplete="organization" /><SelectField label="Expected data volume / workload" value={form.workload} options={workloads} onChange={(value) => updateField('workload', value)} required /><label className="block text-sm text-slate-700">Message / pipeline specifications<span className="ml-1 text-brand-600">*</span><textarea required minLength={10} value={form.message} onChange={(event) => updateField('message', event.target.value)} rows={6} placeholder="Tell us about the sources, decisions, or workflow you want to move forward..." className="mt-2 w-full resize-y rounded-xl border border-brand-100 bg-brand-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500" /></label><div className="rounded-xl border border-brand-100 bg-brand-50/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">Verification</p>{siteKey && optionalAllowed ? <><div ref={captchaRef} className="mt-3 min-h-[65px]" /><p className="mt-2 text-xs text-slate-500">{captchaReady && captchaToken ? 'Verification complete.' : 'Complete the check before sending your inquiry.'}</p></> : siteKey ? <p className="mt-3 text-sm text-brand-800">Optional verification is disabled. <button type="button" onClick={openPreferences} className="font-semibold underline underline-offset-2 hover:text-brand-600">Review privacy preferences</button> to enable the secure contact form.</p> : <p className="mt-3 text-sm text-brand-800">Verification is not configured for this build. Please email our architects directly.</p>}{captchaError && <p className="mt-2 text-xs font-semibold text-brand-700" role="alert">{captchaError}</p>}</div><button type="submit" disabled={state === 'submitting' || (Boolean(siteKey) && (!optionalAllowed || !captchaToken))} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-500 bg-brand-500 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-brand transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-wait disabled:opacity-60 sm:w-auto">{state === 'submitting' ? 'Sending inquiry…' : 'Send your inquiry'} <Send size={16} /></button></form></GlassCard></Reveal><Reveal delay={reducedMotion ? 0 : 0.08}><div className="space-y-5"><GlassCard className="overflow-hidden bg-white/70 p-0"><div className="relative min-h-[330px] bg-brand-100"><div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=85')] bg-cover bg-center opacity-65" aria-hidden="true" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-brand-200/15" aria-hidden="true" /><div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white bg-white/95 p-5 shadow-panel"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-800">ARCHITECTURE PERSPECTIVE</p><p className="mt-2 text-xl font-semibold leading-7 text-slate-900">Start with the workflow. We&apos;ll help shape the path.</p></div></div></GlassCard><ChannelCard icon={Mail} title="Direct communication"><a href="mailto:architects@datasculpt.lk" className="block text-sm font-semibold text-brand-700 hover:text-brand-500">architects@datasculpt.lk</a><a href="mailto:sales@datasculpt.lk" className="mt-2 block text-sm font-semibold text-brand-700 hover:text-brand-500">sales@datasculpt.lk</a></ChannelCard><ChannelCard icon={Clock3} title="What happens next"><p className="text-sm leading-6 text-slate-600">Your message is sent to the configured DataSculpt contact service. The team aims to respond within 4 business hours.</p></ChannelCard><ChannelCard icon={Globe2} title="Regional reference"><p className="text-sm leading-6 text-slate-600">Colombo / APAC Operations Hub<br />US East / N. Virginia</p><p className="mt-3 text-xs text-slate-500">Regional reference information, not live operational telemetry.</p></ChannelCard><div className="flex gap-3 rounded-xl border border-brand-100 bg-brand-50 p-4 text-xs leading-5 text-slate-600"><ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-700" />Please avoid sending confidential credentials, raw datasets, or secrets through this form.</div></div></Reveal></section>

    <Reveal><section className="pt-28"><p className="eyebrow">PRE-SALES SUPPORT</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-4xl">Frequently asked enterprise questions.</h2><div className="mt-8 grid gap-4 lg:grid-cols-3">{faqs.map(([question, answer], index) => <GlassCard key={question} className="h-fit bg-white/65 p-5"><button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index} className="flex w-full items-start justify-between gap-4 text-left text-sm font-semibold leading-6 text-slate-800 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"><span>{question}</span><ChevronDown size={17} className={`mt-1 shrink-0 text-brand-600 transition ${openFaq === index ? 'rotate-180' : ''}`} /></button><AnimatePresence initial={false}>{openFaq === index && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="overflow-hidden"><p className="pt-4 text-sm leading-6 text-slate-600">{answer}</p></motion.div>}</AnimatePresence></GlassCard>)}</div></section></Reveal>
  </div>;
}

function Field({ label, type = 'text', value, onChange, required, placeholder, autoComplete }: { label: string; type?: string; value: string; onChange: (value: string) => void; required?: boolean; placeholder?: string; autoComplete?: string }) { return <label className="block text-sm text-slate-700">{label}{required && <span className="ml-1 text-brand-600">*</span>}<input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete={autoComplete} className="mt-2 w-full rounded-xl border border-brand-100 bg-brand-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500" /></label>; }
function SelectField({ label, value, options, onChange, required }: { label: string; value: string; options: string[]; onChange: (value: string) => void; required?: boolean }) { return <label className="block text-sm text-slate-700">{label}{required && <span className="ml-1 text-brand-600">*</span>}<select required={required} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-brand-100 bg-brand-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500"><option value="" disabled>Select an option</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>; }
function ChannelCard({ icon: Icon, title, children }: { icon: typeof Mail; title: string; children: React.ReactNode }) { return <GlassCard className="bg-white/65 p-5"><div className="flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl border border-brand-200 bg-brand-50 text-brand-700"><Icon size={18} /></span><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-900">{title}</p><div className="mt-3">{children}</div></div></div></GlassCard>; }
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null; }
function messageFrom(payload: unknown, fallback: string) { return isRecord(payload) && typeof payload.message === 'string' ? payload.message : fallback; }
