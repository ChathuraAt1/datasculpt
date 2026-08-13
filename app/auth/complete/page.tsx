'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LoaderCircle, ShieldAlert } from 'lucide-react';
import { AuthMessage, AuthShell } from '@/components/auth/AuthShell';
import { useAuth } from '@/components/auth/AuthContext';
import { authRequest, clearAuth, errorMessage, extractUser, persistAuth, storedToken } from '@/lib/auth';

const ACCOUNT_PATH = '/account/';
const CALLBACK_PATH = '/auth/complete/';

export default function AuthCompletePage() {
  const { refreshUser } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function completeAuthentication() {
      const params = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const token = params.get('token') || hashParams.get('token') || storedToken();

      // Remove the sensitive OAuth token before making any API request or redirect.
      window.history.replaceState({}, document.title, CALLBACK_PATH);

      if (!token) {
        setError('The authentication callback did not include a token. Please start sign-in again.');
        return;
      }

      // Persist immediately so a valid token is not lost if the first user request is slow.
      persistAuth(token);

      try {
        const envelope = await authRequest('/api/user', {}, token);
        const user = extractUser(envelope.data);
        if (!user) throw new Error('The authenticated user response was invalid.');

        persistAuth(token, user);
        await refreshUser();
        if (!cancelled) window.location.replace(ACCOUNT_PATH);
      } catch (callbackError) {
        clearAuth();
        if (!cancelled) setError(errorMessage(callbackError, 'We could not complete social sign-in. Please try again.'));
      }
    }

    void completeAuthentication();
    return () => { cancelled = true; };
  }, [refreshUser]);

  return <AuthShell eyebrow="OAUTH HANDOFF" title={error ? 'Sign-in needs attention.' : 'Completing secure sign-in…'} description="We are validating the provider response and preparing your DataSculpt workspace.">{error ? <><AuthMessage error><ShieldAlert className="mr-2 inline-block" size={16} />{error}</AuthMessage><Link href="/auth/login/" className="mt-6 inline-flex w-full items-center justify-center rounded-lg border border-brand-500/50 px-4 py-3 text-sm font-semibold text-brand-200 hover:border-brand-300">Return to sign in</Link></> : <div className="flex items-center justify-center gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-300"><LoaderCircle className="animate-spin text-brand-300" size={18} />Verifying your account…</div>}</AuthShell>;
}
