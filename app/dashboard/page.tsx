'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CreditCard, RefreshCw, Settings, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthContext';
import { useWorkspace } from '@/components/dashboard/WorkspaceContext';
import { EmptyState, formatWorkspaceAmount, formatWorkspaceDate, WorkspacePageHeader, WorkspacePanel } from '@/components/dashboard/WorkspaceUI';
import { authRequest, isRecord } from '@/lib/auth';
import { normalizePaymentPage, productModules, type WorkspacePayment } from '@/lib/workspace';

export default function DashboardPage() {
  const reducedMotion = useReducedMotion();
  const { user, token } = useAuth();
  const { plan, latestPayment, loading: planLoading, error: planError, refreshPlan, accessFor } = useWorkspace();
  const [payments, setPayments] = useState<WorkspacePayment[]>([]);
  const [paymentLoading, setPaymentLoading] = useState(true);
  const [paymentError, setPaymentError] = useState('');

  const loadPayments = useCallback(async () => {
    if (!token) return;
    setPaymentLoading(true);
    setPaymentError('');
    try {
      const envelope = await authRequest('/api/payments?page=1', {}, token);
      setPayments(normalizePaymentPage(envelope.data).payments.slice(0, 3));
    } catch (error) {
      setPayments([]);
      setPaymentError(error instanceof Error ? error.message : 'Payment history is temporarily unavailable.');
    } finally { setPaymentLoading(false); }
  }, [token]);

  useEffect(() => { void loadPayments(); }, [loadPayments]);

  const name = user?.first_name || user?.username || 'there';
  const recommendation = useMemo(() => {
    switch (plan?.slug) {
      case 'developer': return { title: 'Start by shaping a representative source.', body: 'Transform and Flow are available as browser workspaces on your Developer plan.', href: '/dashboard/transform/', label: 'Open Transform' };
      case 'professional': return { title: 'Prepare a trusted AI context.', body: 'Your plan includes the complete AI-Ready workspace and all product planning modules.', href: '/dashboard/ai-ready/', label: 'Open AI-Ready' };
      case 'scale': return { title: 'Design an advanced operating path.', body: 'Use Flow to coordinate how transformation, quality, and AI preparation fit together.', href: '/dashboard/flow/', label: 'Open Flow' };
      case 'enterprise': return { title: 'Align the workspace with your deployment.', body: 'Review each module, then work with DataSculpt on environment and governance requirements.', href: '/contact/', label: 'Contact architecture' };
      default: return { title: 'Choose the right starting point.', body: 'Explore every module in preview mode, then select the plan that fits your next workflow.', href: '/pricing/', label: 'Review plans' };
    }
  }, [plan?.slug]);

  return <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
    <WorkspacePageHeader eyebrow="Workspace overview" title={`Welcome back, ${name}.`} description="Choose a DataSculpt product, understand what your current plan includes, and continue from the clearest next step." actions={<Link href="/products/" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-brand-600">View platform guide <ArrowRight size={15} /></Link>} />

    {(planError || !planLoading) && <div className="mt-6 flex flex-col justify-between gap-3 rounded-xl border border-[#ded8c8] bg-white px-4 py-3 sm:flex-row sm:items-center"><p className="text-xs leading-5 text-[#6b6556]">{planError ? `Plan service notice: ${planError}` : 'Access labels are a workspace guide. Backend authorization remains the final security boundary.'}</p>{planError && <button type="button" onClick={() => void refreshPlan()} className="inline-flex items-center gap-2 text-xs font-semibold text-brand-800"><RefreshCw size={13} />Retry plan check</button>}</div>}

    <section className="mt-8 grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <WorkspacePanel className="p-6 sm:p-7"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-brand-700">Current access</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#242117]">{planLoading ? 'Checking your plan…' : `${plan?.name || 'Starter'} workspace`}</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-[#696354]">{plan?.description || 'Your workspace modules are being prepared.'}</p></div><span className="self-start rounded-full border border-brand-300 bg-brand-100/70 px-3 py-1.5 text-xs font-semibold text-brand-800">{plan?.source === 'purchase' ? 'Purchased plan' : plan?.source === 'profile' ? 'Profile plan' : 'Starter access'}</span></div><div className="mt-7 flex flex-wrap gap-2">{productModules.map((module) => { const access = accessFor(module.id); return <span key={module.id} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${access.enabled ? 'border-brand-200 bg-brand-100/60 text-brand-800' : 'border-[#ddd7c7] bg-[#f7f5ee] text-[#797365]'}`}>{module.shortName}: {access.label}</span>; })}</div></WorkspacePanel>
      <WorkspacePanel className="overflow-hidden border-brand-200 bg-[#f3df91] p-6 sm:p-7"><Sparkles className="text-brand-800" size={21} /><p className="mt-5 text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-brand-800">Recommended next step</p><h2 className="mt-2 text-xl font-semibold text-[#29230f]">{recommendation.title}</h2><p className="mt-3 text-sm leading-6 text-[#655729]">{recommendation.body}</p><Link href={recommendation.href} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#211f18] px-4 py-2.5 text-sm font-semibold text-[#fff7d7] hover:bg-[#343126]">{recommendation.label}<ArrowRight size={15} /></Link></WorkspacePanel>
    </section>

    <section className="mt-10"><div className="flex items-end justify-between gap-4"><div><p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-brand-700">Product workspaces</p><h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#242117]">Five capabilities, one connected direction.</h2></div></div><div className="mt-5 grid gap-4 md:grid-cols-2 2xl:grid-cols-5">{productModules.map((module, index) => { const access = accessFor(module.id); const Icon = module.icon; return <motion.article key={module.id} initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} whileHover={reducedMotion ? undefined : { y: -4 }} transition={{ delay: reducedMotion ? 0 : index * 0.04 }} className="flex min-h-[255px] flex-col rounded-2xl border border-[#ded8c8] bg-white p-5 shadow-[0_12px_36px_rgba(75,62,29,0.05)] transition hover:border-brand-300"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-800"><Icon size={19} /></span><span className={`rounded-full px-2.5 py-1 text-[0.62rem] font-semibold ${access.enabled ? 'bg-brand-100 text-brand-800' : 'bg-[#efede7] text-[#756f62]'}`}>{access.label}</span></div><h3 className="mt-5 font-semibold text-[#29251d]">{module.name}</h3><p className="mt-2 flex-1 text-sm leading-6 text-[#6c6658]">{module.description}</p><Link href={module.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-800 hover:text-brand-600">{access.enabled ? 'Open workspace' : 'View preview'} <ArrowRight size={14} /></Link></motion.article>; })}</div></section>

    <section className="mt-10 grid gap-5 xl:grid-cols-[1fr_0.55fr]">
      <WorkspacePanel className="p-6 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-brand-700">Recent billing activity</p><h2 className="mt-2 text-xl font-semibold text-[#29251d]">Your latest transactions</h2></div><Link href="/dashboard/billing/" className="text-xs font-semibold text-brand-800 hover:text-brand-600">View billing</Link></div><div className="mt-6">{paymentLoading ? <p className="text-sm text-[#716b5d]">Loading payment history…</p> : paymentError ? <EmptyState title="Payment history is unavailable" description={paymentError} action={<button type="button" onClick={() => void loadPayments()} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800"><RefreshCw size={14} />Try again</button>} /> : payments.length ? <div className="divide-y divide-[#ebe6da]">{payments.map((payment) => <div key={payment.id} className="grid gap-2 py-4 first:pt-0 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-6"><div><p className="text-sm font-semibold capitalize text-[#302c22]">{payment.planName || payment.type || 'Payment'}</p><p className="mt-1 font-mono text-[0.68rem] text-[#817a6b]">{payment.transactionId}</p></div><p className="text-sm font-semibold text-[#39342a]">{formatWorkspaceAmount(payment.amount, payment.currency)}</p><div className="sm:text-right"><p className="text-xs font-semibold capitalize text-brand-800">{payment.status}</p><p className="mt-1 text-xs text-[#817a6b]">{formatWorkspaceDate(payment.paidAt || payment.createdAt)}</p></div></div>)}</div> : <EmptyState title="No payment history yet" description="When you complete a plan request, its transaction will appear here." action={<Link href="/pricing/" className="text-sm font-semibold text-brand-800">Explore pricing</Link>} />}</div></WorkspacePanel>
      <WorkspacePanel className="p-6 sm:p-7"><p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-brand-700">Workspace links</p><div className="mt-5 space-y-3"><Link href="/dashboard/billing/" className="flex items-center justify-between rounded-xl border border-[#e1dac9] bg-[#faf8f1] p-4 text-sm font-semibold text-[#39342a] hover:border-brand-300"><span className="flex items-center gap-3"><CreditCard size={17} className="text-brand-700" />Billing and plan</span><ArrowRight size={14} /></Link><Link href="/account/" className="flex items-center justify-between rounded-xl border border-[#e1dac9] bg-[#faf8f1] p-4 text-sm font-semibold text-[#39342a] hover:border-brand-300"><span className="flex items-center gap-3"><Settings size={17} className="text-brand-700" />Account settings</span><ArrowRight size={14} /></Link></div>{latestPayment && <p className="mt-5 text-xs leading-5 text-[#777061]">Latest plan transaction: <span className="font-mono text-[#494438]">{latestPayment.transactionId}</span></p>}</WorkspacePanel>
    </section>
  </div>;
}
