'use client';

import Link from 'next/link';
import { ArrowRight, LockKeyhole, MonitorCog } from 'lucide-react';
import type { ModuleEntitlement } from '@/lib/workspace';

export function WorkspacePageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: string; description: string; actions?: React.ReactNode }) {
  return <header className="flex flex-col justify-between gap-6 border-b border-[#ded8c8] pb-8 xl:flex-row xl:items-end"><div><p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-600">{eyebrow}</p><h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-[#211f18] sm:text-4xl">{title}</h1><p className="mt-3 max-w-3xl text-sm leading-7 text-[#686252] sm:text-base">{description}</p></div>{actions && <div className="shrink-0">{actions}</div>}</header>;
}

export function WorkspacePanel({ children, className = '', as: Tag = 'div' }: { children: React.ReactNode; className?: string; as?: 'div' | 'section' | 'article' }) {
  return <Tag className={`rounded-2xl border border-[#ded8c8] bg-white shadow-[0_16px_45px_rgba(75,62,29,0.06)] ${className}`}>{children}</Tag>;
}

export function AccessNotice({ entitlement, children }: { entitlement: ModuleEntitlement; children?: React.ReactNode }) {
  if (entitlement.enabled) return <div className="flex flex-col justify-between gap-4 rounded-2xl border border-brand-200 bg-brand-100/60 px-5 py-4 sm:flex-row sm:items-center"><div className="flex gap-3"><MonitorCog className="mt-0.5 shrink-0 text-brand-700" size={19} /><div><p className="text-sm font-semibold text-[#29251b]">{entitlement.label} workspace access</p><p className="mt-1 text-xs leading-5 text-[#6c6249]">This workspace is available. Actions stay limited to documented backend capabilities; unsupported processing and persistence remain disabled.</p></div></div>{children}</div>;
  const requiredPlan = entitlement.moduleId === 'transform' || entitlement.moduleId === 'flow' ? 'Developer' : 'Professional';
  return <div className="flex flex-col justify-between gap-4 rounded-2xl border border-[#d8c995] bg-[#fbf6df] px-5 py-4 sm:flex-row sm:items-center"><div className="flex gap-3"><LockKeyhole className="mt-0.5 shrink-0 text-brand-700" size={19} /><div><p className="text-sm font-semibold text-[#29251b]">Preview access</p><p className="mt-1 text-xs leading-5 text-[#6c6249]">Explore the interface and representative output. Select {requiredPlan} or higher to enable this workspace experience.</p></div></div><Link href="/pricing/" className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-brand-800 hover:text-brand-600">Review plans <ArrowRight size={14} /></Link></div>;
}

export function WorkspaceButton({ children, disabled = false, onClick, type = 'button', className = '' }: { children: React.ReactNode; disabled?: boolean; onClick?: () => void; type?: 'button' | 'submit'; className?: string }) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`inline-flex items-center justify-center gap-2 rounded-xl border border-brand-500 bg-brand-500 px-4 py-2.5 text-sm font-semibold text-slate-50 shadow-[0_8px_22px_rgba(154,101,0,0.13)] transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-[#ddd6c5] disabled:bg-[#ece8dd] disabled:text-[#938d7e] disabled:shadow-none ${className}`}>{children}</button>;
}

export function SelectField({ label, value, onChange, options, disabled = false }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; disabled?: boolean }) {
  return <label className="block text-sm font-medium text-[#484338]">{label}<select value={value} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-[#dcd5c3] bg-[#fbfaf5] px-3.5 py-3 text-sm text-[#29251b] outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-[#efede6] disabled:text-[#8c8779]">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-[#d4ccba] bg-[#faf8f1] p-7 text-center"><p className="font-semibold text-[#2b281f]">{title}</p><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#6f695a]">{description}</p>{action && <div className="mt-5">{action}</div>}</div>;
}

export function formatWorkspaceDate(value: string | null) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
}

export function formatWorkspaceAmount(amount: number | null, currency: string) {
  if (amount === null) return 'Amount unavailable';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(amount);
}
