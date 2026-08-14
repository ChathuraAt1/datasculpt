'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CreditCard, RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { useWorkspace } from '@/components/dashboard/WorkspaceContext';
import { EmptyState, formatWorkspaceAmount, formatWorkspaceDate, WorkspacePageHeader, WorkspacePanel } from '@/components/dashboard/WorkspaceUI';
import { AuthApiError, authRequest, clearAuth } from '@/lib/auth';
import { normalizePaymentPage, type WorkspacePaymentPage } from '@/lib/workspace';

const emptyPage: WorkspacePaymentPage = { payments: [], currentPage: 1, lastPage: 1, total: 0 };

export default function BillingWorkspacePage() {
  const { token } = useAuth();
  const { plan, latestPayment, loading: planLoading, error: planError, refreshPlan } = useWorkspace();
  const [page, setPage] = useState(1);
  const [history, setHistory] = useState<WorkspacePaymentPage>(emptyPage);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = useCallback(async (requestedPage: number) => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const envelope = await authRequest(`/api/payments?page=${requestedPage}`, {}, token);
      const normalized = normalizePaymentPage(envelope.data);
      setHistory(normalized);
      setPage(normalized.currentPage);
    } catch (requestError) {
      if (requestError instanceof AuthApiError && requestError.status === 401) {
        clearAuth();
        window.location.replace(`/auth/login/?next=${encodeURIComponent('/dashboard/billing/')}`);
        return;
      }
      setError(requestError instanceof Error ? requestError.message : 'Billing history is temporarily unavailable.');
      setHistory(emptyPage);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { void loadHistory(page); }, [loadHistory, page]);

  return <div className="mx-auto max-w-[1350px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10"><WorkspacePageHeader eyebrow="Billing and plan" title="Keep your plan and payment history clear." description="Plan status and transaction history are loaded from the authenticated DataSculpt payment service. No refund, cancellation, or plan-revert controls are included here." actions={<Link href="/pricing/" className="inline-flex items-center gap-2 rounded-xl bg-[#211f18] px-4 py-2.5 text-sm font-semibold text-[#fff7d7] hover:bg-[#343126]">Review plans <ArrowRight size={15} /></Link>} />
    <section className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.72fr]"><WorkspacePanel className="p-6 sm:p-7"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-brand-700">Current plan</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#29251d]">{planLoading ? 'Checking plan…' : plan?.name || 'Starter'}</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#6e6859]">{plan?.description || 'Plan details are currently unavailable.'}</p></div><span className="self-start rounded-full border border-brand-200 bg-brand-100/65 px-3 py-1.5 text-xs font-semibold text-brand-800">{plan?.source === 'purchase' ? 'Purchased' : plan?.source === 'profile' ? 'Profile plan' : 'Starter access'}</span></div>{planError && <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-[#dfd19f] bg-[#fbf5de] p-4"><p className="text-xs leading-5 text-[#6a5f3b]">{planError}</p><button type="button" onClick={() => void refreshPlan()} className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-brand-800"><RefreshCw size={13} />Retry</button></div>}<div className="mt-6 flex flex-wrap gap-3"><Link href="/pricing/" className="inline-flex items-center gap-2 rounded-xl border border-brand-500 bg-brand-500 px-4 py-2.5 text-sm font-semibold text-[#211b0d]">Change or upgrade plan <ArrowRight size={14} /></Link><Link href="/contact/" className="inline-flex items-center gap-2 rounded-xl border border-[#dcd5c3] bg-white px-4 py-2.5 text-sm font-semibold text-[#4a453a] hover:border-brand-300">Discuss enterprise needs</Link></div></WorkspacePanel><WorkspacePanel className="p-6 sm:p-7"><CreditCard className="text-brand-700" size={21} /><p className="mt-5 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-brand-700">Latest plan transaction</p>{latestPayment ? <div className="mt-4"><p className="font-semibold capitalize text-[#302c22]">{latestPayment.planName || latestPayment.type || 'Plan payment'}</p><p className="mt-2 break-all font-mono text-xs text-[#6f6859]">{latestPayment.transactionId}</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-[#faf8f1] p-3"><p className="text-[0.62rem] uppercase tracking-wider text-[#817a6b]">Status</p><p className="mt-1 text-sm font-semibold capitalize text-brand-800">{latestPayment.status}</p></div><div className="rounded-xl bg-[#faf8f1] p-3"><p className="text-[0.62rem] uppercase tracking-wider text-[#817a6b]">Date</p><p className="mt-1 text-sm font-semibold text-[#39342a]">{formatWorkspaceDate(latestPayment.paidAt || latestPayment.createdAt)}</p></div></div></div> : <p className="mt-4 text-sm leading-6 text-[#716b5d]">No plan transaction has been returned for this account.</p>}</WorkspacePanel></section>

    <WorkspacePanel className="mt-5 overflow-hidden"><div className="flex flex-col justify-between gap-4 border-b border-[#e5dfd1] p-6 sm:flex-row sm:items-end"><div><p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-brand-700">Payment history</p><h2 className="mt-2 text-xl font-semibold text-[#29251d]">Authenticated transactions</h2></div><p className="text-xs text-[#777062]">{history.total} {history.total === 1 ? 'transaction' : 'transactions'}</p></div><div className="p-6">{loading ? <p className="text-sm text-[#716b5d]">Loading payment history…</p> : error ? <EmptyState title="Payment history is unavailable" description={error} action={<button type="button" onClick={() => void loadHistory(page)} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-800"><RefreshCw size={14} />Try again</button>} /> : history.payments.length ? <div className="overflow-x-auto"><table className="w-full min-w-[760px] border-collapse text-left"><thead><tr className="border-b border-[#e8e2d5] text-[0.62rem] uppercase tracking-[0.14em] text-[#80796a]"><th className="pb-3 font-semibold">Transaction</th><th className="pb-3 font-semibold">Plan or type</th><th className="pb-3 font-semibold">Amount</th><th className="pb-3 font-semibold">Status</th><th className="pb-3 text-right font-semibold">Date</th></tr></thead><tbody>{history.payments.map((payment) => <tr key={payment.id} className="border-b border-[#eee9de] last:border-0"><td className="py-4 pr-5 font-mono text-xs text-[#565044]">{payment.transactionId}</td><td className="py-4 pr-5 text-sm font-medium capitalize text-[#39342a]">{payment.planName || payment.type || 'Payment'}</td><td className="py-4 pr-5 text-sm font-semibold text-[#39342a]">{formatWorkspaceAmount(payment.amount, payment.currency)}</td><td className="py-4 pr-5"><span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold capitalize text-brand-800">{payment.status}</span></td><td className="py-4 text-right text-xs text-[#716b5d]">{formatWorkspaceDate(payment.paidAt || payment.createdAt)}</td></tr>)}</tbody></table></div> : <EmptyState title="No transactions yet" description="Completed subscription or payment requests will appear here." action={<Link href="/pricing/" className="text-sm font-semibold text-brand-800">Explore pricing</Link>} />}</div>{!loading && !error && history.lastPage > 1 && <div className="flex items-center justify-between border-t border-[#e5dfd1] px-6 py-4"><button type="button" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="inline-flex items-center gap-2 text-sm font-semibold text-[#514b3f] disabled:opacity-35"><ArrowLeft size={14} />Previous</button><span className="text-xs text-[#777062]">Page {history.currentPage} of {history.lastPage}</span><button type="button" disabled={page >= history.lastPage} onClick={() => setPage((current) => Math.min(history.lastPage, current + 1))} className="inline-flex items-center gap-2 text-sm font-semibold text-[#514b3f] disabled:opacity-35">Next<ArrowRight size={14} /></button></div>}</WorkspacePanel>
  </div>;
}
