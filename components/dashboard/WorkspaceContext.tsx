'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { AuthApiError, authRequest, clearAuth, isRecord } from '@/lib/auth';
import { fallbackPlans, normalizePlan } from '@/lib/plans';
import {
  entitlementFor,
  normalizePayment,
  starterPlan,
  type ModuleEntitlement,
  type ProductModuleId,
  type WorkspacePayment,
  type WorkspacePlan,
  type WorkspaceState,
} from '@/lib/workspace';

type WorkspaceContextValue = {
  plan: WorkspacePlan | null;
  latestPayment: WorkspacePayment | null;
  state: WorkspaceState;
  loading: boolean;
  error: string;
  refreshPlan: () => Promise<void>;
  accessFor: (moduleId: ProductModuleId) => ModuleEntitlement;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { token, user, loading: authLoading, isAuthenticated } = useAuth();
  const [plan, setPlan] = useState<WorkspacePlan | null>(null);
  const [latestPayment, setLatestPayment] = useState<WorkspacePayment | null>(null);
  const [state, setState] = useState<WorkspaceState>('idle');
  const [error, setError] = useState('');

  const refreshPlan = useCallback(async () => {
    if (!token || !isAuthenticated) return;
    setState('loading');
    setError('');
    try {
      const envelope = await authRequest('/api/payments/last-plan', {}, token);
      const data = isRecord(envelope.data) ? envelope.data : {};
      const payment = normalizePayment(data.payment);
      const directPlan = normalizePlan(data.plan);
      const returnedSlug = isRecord(data.plan) && typeof data.plan.slug === 'string' ? data.plan.slug : null;
      const planSlug = directPlan?.slug || returnedSlug || user?.current_plan || null;
      let resolvedPlan = directPlan;

      if (!resolvedPlan && planSlug) {
        try {
          const planEnvelope = await authRequest(`/api/subscription-plans/${encodeURIComponent(planSlug)}`, {}, token);
          resolvedPlan = normalizePlan(planEnvelope.data);
        } catch (planError) {
          if (planError instanceof AuthApiError && planError.status === 401) throw planError;
          resolvedPlan = fallbackPlans.find((item) => item.slug === planSlug.toLowerCase()) || null;
        }
      }

      setPlan(resolvedPlan ? { ...resolvedPlan, source: directPlan ? 'purchase' : 'profile' } : starterPlan());
      setLatestPayment(payment);
      setState('ready');
    } catch (requestError) {
      if (requestError instanceof AuthApiError && requestError.status === 401) {
        clearAuth();
        const next = `${window.location.pathname}${window.location.search}`;
        window.location.replace(`/auth/login/?next=${encodeURIComponent(next)}`);
        return;
      }
      const profilePlan = fallbackPlans.find((item) => item.slug === user?.current_plan?.toLowerCase());
      setPlan(profilePlan ? { ...profilePlan, source: 'profile' } : starterPlan());
      setLatestPayment(null);
      setError(requestError instanceof Error ? requestError.message : 'Plan information is temporarily unavailable.');
      setState('error');
    }
  }, [isAuthenticated, token, user?.current_plan]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || !token) {
      setPlan(null);
      setLatestPayment(null);
      setState('idle');
      return;
    }
    void refreshPlan();
  }, [authLoading, isAuthenticated, refreshPlan, token]);

  const accessFor = useCallback((moduleId: ProductModuleId) => entitlementFor(plan?.slug, moduleId), [plan?.slug]);
  const value = useMemo(() => ({ plan, latestPayment, state, loading: state === 'loading' || (authLoading && state === 'idle'), error, refreshPlan, accessFor }), [accessFor, authLoading, error, latestPayment, plan, refreshPlan, state]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error('useWorkspace must be used within WorkspaceProvider.');
  return value;
}
