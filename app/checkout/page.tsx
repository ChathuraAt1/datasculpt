'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronRight, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { AuthMessage } from '@/components/auth/AuthShell';
import { EditorialButton } from '@/components/ui/EditorialButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/home/Reveal';
import { apiBaseUrl, AuthApiError, authRequest, clearAuth, isRecord } from '@/lib/auth';
import { fallbackPlans, normalizePlanCatalog, type BillingCycle, type SubscriptionPlan } from '@/lib/plans';

type Plan = SubscriptionPlan;
type FormValues = { cardHolder: string; cardNumber: string; expiryMonth: string; expiryYear: string; cvv: string; street: string; city: string; state: string; zip: string; country: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;

const checkoutFallbackPlans = fallbackPlans.filter((plan) => plan.slug !== 'enterprise');

const emptyForm: FormValues = { cardHolder: '', cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '', street: '', city: '', state: '', zip: '', country: 'US' };

export default function CheckoutPage() {
  const { token, user, loading: authLoading } = useAuth();
  const [query, setQuery] = useState<{ slug: string; cycle: BillingCycle } | null>(null);
  const [plans, setPlans] = useState<Plan[]>(checkoutFallbackPlans);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cycle = params.get('cycle') === 'annual' ? 'annual' : 'monthly';
    setQuery({ slug: params.get('plan') || '', cycle });
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function loadCatalog() {
      const base = apiBaseUrl();
      if (!base) { setCatalogLoading(false); return; }
      try {
        const response = await fetch(`${base}/api/subscription-plans`, { headers: { Accept: 'application/json' } });
        const payload: unknown = await response.json();
        const data = isRecord(payload) ? payload.data : null;
        const nextPlans = normalizePlanCatalog(data);
        if (!cancelled && nextPlans.length) setPlans(nextPlans);
      } catch { /* fallback catalog remains available */ } finally { if (!cancelled) setCatalogLoading(false); }
    }
    void loadCatalog();
    return () => { cancelled = true; };
  }, []);

  const plan = useMemo(() => plans.find((item) => item.slug === query?.slug) || null, [plans, query]);
  const price = plan && query ? query.cycle === 'annual' ? plan.yearlyPrice : plan.monthlyPrice : null;
  const displayPrice = plan && price !== null ? new Intl.NumberFormat('en-US', { style: 'currency', currency: plan.currency || 'USD', maximumFractionDigits: 0 }).format(price) : 'Custom';
  const checkoutPath = query ? `/checkout/?plan=${encodeURIComponent(query.slug)}&cycle=${query.cycle}` : '/checkout/';
  const loginPath = `/auth/login/?next=${encodeURIComponent(checkoutPath)}`;

  function update(field: keyof FormValues, value: string) { setForm((current) => ({ ...current, [field]: value })); setErrors((current) => ({ ...current, [field]: undefined })); }
  function validate() {
    const next: FormErrors = {};
    const digits = form.cardNumber.replace(/\D/g, '');
    if (!form.cardHolder.trim()) next.cardHolder = 'Enter the card holder name.';
    if (digits.length < 13 || digits.length > 19) next.cardNumber = 'Card number must contain 13–19 digits.';
    if (!/^\d{2}$/.test(form.expiryMonth) || Number(form.expiryMonth) < 1 || Number(form.expiryMonth) > 12) next.expiryMonth = 'Use a two-digit month.';
    if (!/^\d{2}$/.test(form.expiryYear)) next.expiryYear = 'Use a two-digit year.';
    if (!/^\d{3,4}$/.test(form.cvv)) next.cvv = 'Use a 3–4 digit security code.';
    if (!form.country.trim()) next.country = 'Enter a billing country.';
    setErrors(next); return Object.keys(next).length === 0;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!plan || !query || price === null || !validate()) return;
    if (!token) { setStatus('Your session is no longer available. Please sign in again.'); return; }
    const base = apiBaseUrl();
    if (!base) { setStatus('The subscription service is not configured. Please try again later.'); return; }
    setSubmitting(true); setStatus('');
    try {
      const response = await fetch(`${base}/api/subscriptions`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ plan_slug: plan.slug, payment_method: { card_number: form.cardNumber.replace(/\D/g, ''), expiry_month: form.expiryMonth, expiry_year: form.expiryYear, cvv: form.cvv, card_holder: form.cardHolder.trim() }, billing_address: { street: form.street.trim(), city: form.city.trim(), state: form.state.trim(), zip: form.zip.trim(), country: form.country.trim() } }) });
      const payload: unknown = await response.json().catch(() => null);
      if (response.status === 401) { clearAuth(); window.location.replace(loginPath); return; }
      if (response.status === 422) { setErrors(apiErrors(payload)); setStatus(messageFrom(payload, 'Please review the highlighted fields.')); return; }
      if (!response.ok) { setForm((current) => ({ ...current, cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '' })); throw new Error(messageFrom(payload, 'Payment could not be completed. Please check your details and try again.')); }
      const transaction = extractTransaction(payload);
      if (!transaction) throw new Error('Payment was submitted, but no transaction reference was returned.');
      window.location.replace(`/checkout/success/?transaction=${encodeURIComponent(transaction)}`);
    } catch (error) { setStatus(error instanceof Error ? error.message : 'Payment could not be completed. Please try again.'); } finally { setSubmitting(false); }
  }

  return <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:pt-12 lg:px-8">
    <Reveal><header><Link href="/pricing/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600"><span>Home</span><ChevronRight size={14} /><span>Pricing</span><ChevronRight size={14} /><span className="text-brand-600">Checkout</span></Link><p className="eyebrow mt-10">SECURE SUBSCRIPTION SETUP</p><h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-slate-900 sm:text-6xl">Complete your DataSculpt setup.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Review your selected plan and submit your billing details through the configured subscription service.</p></header></Reveal>
    {catalogLoading || authLoading || !query ? <GlassCard className="mt-12 bg-white/65 p-8"><p className="text-slate-600">Preparing your checkout…</p></GlassCard> : !plan ? <GlassCard className="mt-12 bg-white/65 p-8"><h2 className="text-2xl font-semibold text-slate-900">Choose a plan to continue.</h2><p className="mt-3 text-slate-600">Return to pricing and select the plan that fits your next step.</p><Link href="/pricing/" className="mt-6 inline-flex items-center gap-2 font-semibold text-brand-700 hover:text-brand-500">View pricing <ArrowRight size={15} /></Link></GlassCard> : !user || !token ? <GlassCard className="mt-12 max-w-2xl bg-white/65 p-8"><h2 className="text-2xl font-semibold text-slate-900">Sign in to continue.</h2><p className="mt-3 leading-7 text-slate-600">Your account keeps the subscription request connected to the correct DataSculpt workspace.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><EditorialButton href={loginPath} icon={<ArrowRight size={17} />}>Sign in to continue</EditorialButton><Link href={`/auth/signup/?next=${encodeURIComponent(checkoutPath)}`} className="inline-flex items-center justify-center rounded-xl border border-brand-200 px-5 py-3 text-sm font-semibold text-brand-700 hover:border-brand-400">Create an account</Link></div></GlassCard> : <div className="mt-12 grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start"><GlassCard className="bg-brand-100/55 p-7 lg:sticky lg:top-24"><p className="eyebrow">YOUR SELECTION</p><h2 className="mt-4 text-3xl font-semibold text-slate-900">{plan.name}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p><div className="mt-7 flex items-end gap-2"><span className="text-4xl font-extrabold text-slate-900">{displayPrice}</span>{price !== null && <span className="mb-1 text-sm text-slate-500">/{query.cycle === 'annual' ? 'mo annual' : 'month'}</span>}</div><p className="mt-2 text-sm font-semibold capitalize text-brand-700">{query.cycle} billing</p><ul className="mt-7 space-y-3 border-t border-brand-200 pt-6">{plan.features.map((feature) => <li key={feature} className="flex gap-2 text-sm text-slate-700"><Check size={16} className="mt-0.5 shrink-0 text-brand-600" />{feature}</li>)}</ul><Link href="/pricing/" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-500">Change plan <ArrowRight size={15} /></Link></GlassCard><GlassCard className="bg-white/75 p-7 sm:p-9"><div className="flex items-center gap-3 border-b border-brand-100 pb-5"><ShieldCheck className="text-brand-600" size={21} /><div><h2 className="font-semibold text-slate-900">Billing details</h2><p className="text-xs text-slate-500">Secure request · sandbox gateway</p></div></div><form onSubmit={submit} className="mt-7 space-y-5" noValidate><div className="grid gap-5 sm:grid-cols-2"><Field label="Card holder" value={form.cardHolder} onChange={(value) => update('cardHolder', value)} error={errors.cardHolder} autoComplete="cc-name" /><Field label="Card number" value={form.cardNumber} onChange={(value) => update('cardNumber', value)} error={errors.cardNumber} autoComplete="cc-number" inputMode="numeric" /></div><div className="grid gap-5 sm:grid-cols-3"><Field label="Expiry month" value={form.expiryMonth} onChange={(value) => update('expiryMonth', value)} error={errors.expiryMonth} inputMode="numeric" autoComplete="cc-exp-month" /><Field label="Expiry year" value={form.expiryYear} onChange={(value) => update('expiryYear', value)} error={errors.expiryYear} inputMode="numeric" autoComplete="cc-exp-year" /><Field label="CVV" value={form.cvv} onChange={(value) => update('cvv', value)} error={errors.cvv} inputMode="numeric" autoComplete="cc-csc" /></div><div className="border-t border-brand-100 pt-5"><p className="mb-4 text-sm font-semibold text-slate-800">Billing address</p><div className="grid gap-5 sm:grid-cols-2"><Field label="Street" value={form.street} onChange={(value) => update('street', value)} autoComplete="street-address" /><Field label="City" value={form.city} onChange={(value) => update('city', value)} autoComplete="address-level2" /><Field label="State / region" value={form.state} onChange={(value) => update('state', value)} autoComplete="address-level1" /><Field label="ZIP / postal code" value={form.zip} onChange={(value) => update('zip', value)} autoComplete="postal-code" /><Field label="Country" value={form.country} onChange={(value) => update('country', value)} error={errors.country} autoComplete="country" /></div></div><p className="flex gap-2 text-xs leading-5 text-slate-500"><LockKeyhole size={14} className="mt-0.5 shrink-0 text-brand-600" />Card details are sent only with your authenticated subscription request and are not stored by this page.</p>{status && <AuthMessage error>{status}</AuthMessage>}<button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-brand-500 bg-brand-500 px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-brand transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-wait disabled:opacity-60">{submitting ? 'Submitting securely…' : 'Submit subscription request'} <ArrowRight size={16} /></button></form></GlassCard></div>}
  </div>;
}

function Field({ label, value, onChange, error, autoComplete, inputMode }: { label: string; value: string; onChange: (value: string) => void; error?: string; autoComplete?: string; inputMode?: 'numeric' }) { return <label className="block text-sm text-slate-700">{label}<input value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} inputMode={inputMode} className="mt-2 w-full rounded-xl border border-brand-100 bg-brand-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500" />{error && <span className="mt-1 block text-xs text-brand-700" role="alert">{error}</span>}</label>; }
function messageFrom(payload: unknown, fallback: string) { return isRecord(payload) && typeof payload.message === 'string' ? payload.message : fallback; }
function apiErrors(payload: unknown): FormErrors { const errors: FormErrors = {}; if (!isRecord(payload) || !isRecord(payload.errors)) return errors; for (const [key, value] of Object.entries(payload.errors)) { if (key in emptyForm && Array.isArray(value) && typeof value[0] === 'string') errors[key as keyof FormValues] = value[0]; } return errors; }
function extractTransaction(payload: unknown) { if (!isRecord(payload) || !isRecord(payload.data)) return null; const data = payload.data; if (typeof data.transaction_id === 'string') return data.transaction_id; if (isRecord(data.payment) && typeof data.payment.transaction_id === 'string') return data.payment.transaction_id; return null; }
