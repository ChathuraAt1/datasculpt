'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { storedToken } from '@/lib/auth';

type GuestGuardProps = {
  children: React.ReactNode;
  fallbackUrl?: string;
};

export function GuestGuard({ children, fallbackUrl = '/dashboard/' }: GuestGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tokenExists = Boolean(storedToken());
    setHasToken(tokenExists);

    const nextParam = new URLSearchParams(window.location.search).get('next');
    const destination = nextParam && nextParam.startsWith('/') ? nextParam : fallbackUrl;

    if (isAuthenticated || tokenExists) {
      window.location.replace(destination);
    }
  }, [isAuthenticated, fallbackUrl]);

  // If already authenticated or restoring a session, prevent any flash of auth forms
  if (!mounted || loading || isAuthenticated || hasToken) {
    if (mounted && !loading && !isAuthenticated && !hasToken) {
      return <>{children}</>;
    }

    return (
      <main className="grid min-h-screen place-items-center bg-slate-950">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-400">
          <span className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />
          Redirecting to your workspace…
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
