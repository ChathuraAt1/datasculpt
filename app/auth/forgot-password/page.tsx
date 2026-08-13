'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { AuthField, AuthMessage, AuthShell } from '@/components/auth/AuthShell';
import { authRequest, errorMessage } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [submitting, setSubmitting] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSubmitting(true); setError(''); setMessage(''); try { const envelope = await authRequest('/api/auth/password/forgot', { method: 'POST', body: JSON.stringify({ email }) }); setMessage(typeof envelope.message === 'string' ? envelope.message : 'If an account exists, we will send a password reset link.'); } catch (submissionError) { setError(errorMessage(submissionError, 'We could not request a reset link.')); } finally { setSubmitting(false); } }
  return <AuthShell eyebrow="ACCOUNT RECOVERY" title="Reset your password." description="Enter your account email and we will provide the next step without revealing whether an account exists.">{error && <AuthMessage error>{error}</AuthMessage>}{message && <div className="mb-5"><AuthMessage>{message}</AuthMessage></div>}<form onSubmit={submit} className="space-y-5"><AuthField label="Account email" name="email" type="email" value={email} onChange={setEmail} placeholder="you@company.com" autoComplete="email" /><button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-300/70 bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 shadow-brand transition hover:bg-brand-300 disabled:cursor-wait disabled:opacity-70">{submitting ? 'Requesting link…' : 'Request reset link'}<Mail size={16} /></button></form><Link href="/auth/login/" className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-brand-300"><ArrowLeft size={14} />Back to sign in</Link></AuthShell>;
}

