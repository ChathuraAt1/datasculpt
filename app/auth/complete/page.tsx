'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LoaderCircle, ShieldAlert } from 'lucide-react';
import { AuthMessage, AuthShell } from '@/components/auth/AuthShell';
import { authRequest, errorMessage, extractUser, persistAuth } from '@/lib/auth';
import { useAuth } from '@/components/auth/AuthContext';

export default function AuthCompletePage() {
  const { refreshUser } = useAuth(); const [error, setError] = useState('');
  useEffect(() => { let cancelled = false; void (async () => { const params = new URLSearchParams(window.location.search); const token = params.get('token'); window.history.replaceState({}, document.title, '/auth/complete/'); if (!token) { setError('The authentication callback did not include a token.'); return; } try { const envelope = await authRequest('/api/user', {}, token); const user = extractUser(envelope.data); if (!user) throw new Error('The authenticated user response was invalid.'); persistAuth(token, user); await refreshUser(); if (!cancelled) window.location.replace('/account/'); } catch (callbackError) { if (!cancelled) setError(errorMessage(callbackError, 'We could not complete social sign-in.')); } })(); return () => { cancelled = true; }; }, [refreshUser]);
  return <AuthShell eyebrow="OAUTH HANDOFF" title={error ? 'Sign-in needs attention.' : 'Completing secure sign-in…'} description="We are validating the provider response and preparing your DataSculpt workspace.">{error ? <><AuthMessage error><ShieldAlert className="mr-2 inline-block" size={16} />{error}</AuthMessage><Link href="/auth/login/" className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-brand-500/50 px-4 py-3 text-sm font-semibold text-brand-200 hover:border-brand-300">Return to sign in</Link></> : <div className="flex items-center justify-center gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-300"><LoaderCircle className="animate-spin text-brand-300" size={18} />Verifying your account…</div>}</AuthShell>;
}

