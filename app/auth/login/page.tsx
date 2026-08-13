'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, LogIn } from 'lucide-react';
import { AuthDivider, AuthField, AuthLinks, AuthMessage, AuthShell, OAuthButtons } from '@/components/auth/AuthShell';
import { errorMessage } from '@/lib/auth';
import { useAuth } from '@/components/auth/AuthContext';

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false); const [next, setNext] = useState('/account/');
  useEffect(() => { const value = new URLSearchParams(window.location.search).get('next'); if (value?.startsWith('/')) setNext(value); }, []);
  useEffect(() => { if (!loading && isAuthenticated) window.location.replace(next); }, [loading, isAuthenticated, next]);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitting(true); setError(''); try { await login({ email, password }); window.location.replace(next); } catch (submissionError) { setError(errorMessage(submissionError, 'Unable to sign in. Check your email and password.')); } finally { setSubmitting(false); } }
  return <AuthShell eyebrow="SECURE SIGN IN" title="Welcome back." description="Sign in to manage your DataSculpt workspace and enterprise data operations."><OAuthButtons /><AuthDivider />{error && <AuthMessage error>{error}</AuthMessage>}<form onSubmit={submit} className="space-y-5"><AuthField label="Work email" name="email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" autoComplete="email" /><AuthField label="Password" name="password" type="password" value={password} onChange={setPassword} placeholder="Enter your password" autoComplete="current-password" /><div className="flex justify-end"><Link href="/auth/forgot-password/" className="text-sm text-brand-300 hover:text-brand-200">Forgot password?</Link></div><button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-300/70 bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-brand transition hover:bg-brand-300 disabled:cursor-wait disabled:opacity-70">{submitting ? 'Signing in…' : 'Sign in'}<LogIn size={16} /></button></form><AuthLinks /><Link href="/products/" className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-600 hover:text-brand-300">Explore the platform <ArrowRight size={13} /></Link></AuthShell>;
}

