'use client';

import { useEffect } from 'react';
import { LogOut, Mail, UserRound } from 'lucide-react';
import { AuthMessage } from '@/components/auth/AuthShell';
import { useAuth } from '@/components/auth/AuthContext';

export default function AccountPage() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  useEffect(() => { if (!loading && !isAuthenticated) window.location.replace('/auth/login/?next=/account/'); }, [loading, isAuthenticated]);
  if (loading || !isAuthenticated || !user) return <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-5xl items-center justify-center px-5"><p className="text-sm text-slate-500">Loading secure workspace…</p></div>;
  const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'DataSculpt user';
  return <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8"><div className="mb-8"><p className="eyebrow">ACCOUNT CONSOLE</p><h1 className="mt-3 text-4xl font-semibold tracking-tight text-white">Welcome, {name}.</h1><p className="mt-3 text-slate-400">Your authenticated DataSculpt workspace is ready for the next operating step.</p></div><div className="grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6"><UserRound className="text-brand-300" size={22} /><h2 className="mt-4 text-lg font-semibold text-white">Account identity</h2><div className="mt-4 space-y-3 text-sm text-slate-400"><p><span className="text-slate-500">Username:</span> {user.username || 'Not provided'}</p><p className="flex items-center gap-2"><Mail size={14} className="text-brand-300" />{user.email || 'No email available'}</p><p><span className="text-slate-500">Provider:</span> {user.provider_name || 'Password account'}</p></div></div><div className="rounded-2xl border border-brand-500/30 bg-brand-950/20 p-6"><p className="eyebrow">SESSION STATUS</p><h2 className="mt-3 text-lg font-semibold text-white">Authenticated</h2><p className="mt-3 text-sm leading-6 text-slate-400">Your browser session is connected to the DataSculpt API through a Sanctum bearer token.</p><button onClick={() => void logout().then(() => window.location.replace('/auth/login/'))} className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950/70 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:border-brand-500/60 hover:text-brand-200"><LogOut size={15} />Sign out</button></div></div><div className="mt-6"><AuthMessage>Subscription and workspace controls can be added here as authenticated platform modules become available.</AuthMessage></div></div>;
}

