'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronRight, CircleAlert, LoaderCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/home/Reveal';
import { authRequest } from '@/lib/auth';

export default function CheckoutSuccessPage() {
  const { token, loading: authLoading } = useAuth();
  const [transaction, setTransaction] = useState('');
  const [verification, setVerification] = useState<'loading' | 'verified' | 'unavailable'>('loading');

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('transaction') || '';
    setTransaction(value);
  }, []);

  useEffect(() => {
    if (authLoading || !transaction) return;
    if (!token) { setVerification('unavailable'); return; }
    let cancelled = false;
    void authRequest(`/api/payments/${encodeURIComponent(transaction)}`, {}, token).then(() => { if (!cancelled) setVerification('verified'); }).catch(() => { if (!cancelled) setVerification('unavailable'); });
    return () => { cancelled = true; };
  }, [authLoading, token, transaction]);

  return <div className="mx-auto max-w-4xl px-5 pb-24 pt-8 sm:pt-12 lg:px-8"><Reveal><header><Link href="/pricing/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600"><span>Home</span><ChevronRight size={14} /><span>Pricing</span><ChevronRight size={14} /><span className="text-brand-600">Complete</span></Link></header><GlassCard className="mt-12 bg-white/75 p-8 text-center sm:p-14">{!transaction ? <><CircleAlert className="mx-auto text-brand-600" size={42} /><h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">We could not find the transaction reference.</h1><p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">Return to pricing and start the subscription request again.</p></> : <><CheckCircle2 className="mx-auto text-brand-600" size={48} /><h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900">Your subscription request was submitted.</h1><p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">Your DataSculpt plan request has been received. You can continue to your account or return to the platform.</p><div className="mx-auto mt-7 max-w-sm rounded-xl border border-brand-100 bg-brand-50 p-4 text-left"><p className="text-xs uppercase tracking-[0.14em] text-slate-500">Transaction reference</p><p className="mt-2 break-all font-mono text-sm font-semibold text-slate-900">{transaction}</p></div>{verification === 'loading' && <p className="mt-6 inline-flex items-center gap-2 text-sm text-slate-500"><LoaderCircle className="animate-spin" size={15} />Verifying transaction…</p>}{verification === 'verified' && <p className="mt-6 text-sm font-semibold text-brand-700">Transaction verified successfully.</p>}{verification === 'unavailable' && <p className="mx-auto mt-6 max-w-lg text-sm leading-6 text-slate-600">Your payment request was submitted. We could not verify the transaction details yet.</p>}</>}<div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/account/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-600">Go to account <ArrowRight size={15} /></Link><Link href="/products/" className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-5 py-3 text-sm font-semibold text-brand-700 hover:border-brand-400">Explore the platform <ArrowRight size={15} /></Link></div></GlassCard></Reveal></div>;
}
