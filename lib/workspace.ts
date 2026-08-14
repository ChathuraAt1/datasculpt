import type { LucideIcon } from 'lucide-react';
import { Bot, Gauge, GitBranch, ShieldCheck, WandSparkles } from 'lucide-react';
import { isRecord } from '@/lib/auth';
import type { SubscriptionPlan } from '@/lib/plans';

export type ProductModuleId = 'transform' | 'velocity' | 'qualityguard' | 'ai-ready' | 'flow';
export type PlanAccessLevel = 'preview' | 'basic' | 'included' | 'advanced' | 'enterprise';
export type KnownPlanSlug = 'starter' | 'developer' | 'professional' | 'scale' | 'enterprise';

export type ModuleEntitlement = {
  moduleId: ProductModuleId;
  level: PlanAccessLevel;
  enabled: boolean;
  label: string;
};

export type WorkspacePlan = SubscriptionPlan & { source: 'purchase' | 'profile' | 'starter' };

export type WorkspacePayment = {
  id: string;
  transactionId: string;
  planName: string | null;
  amount: number | null;
  currency: string;
  status: string;
  type: string | null;
  createdAt: string | null;
  paidAt: string | null;
};

export type WorkspaceState = 'idle' | 'loading' | 'ready' | 'error';

export type WorkspacePaymentPage = {
  payments: WorkspacePayment[];
  currentPage: number;
  lastPage: number;
  total: number;
};

export type ProductModuleDefinition = {
  id: ProductModuleId;
  name: string;
  shortName: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const productModules: ProductModuleDefinition[] = [
  { id: 'transform', name: 'DataSculpt Transform', shortName: 'Transform', description: 'Shape fragmented source structures into data your teams can use.', href: '/dashboard/transform/', icon: WandSparkles },
  { id: 'velocity', name: 'DataSculpt Velocity', shortName: 'Velocity', description: 'Plan the right processing approach for demanding data work.', href: '/dashboard/velocity/', icon: Gauge },
  { id: 'qualityguard', name: 'DataSculpt QualityGuard', shortName: 'QualityGuard', description: 'Build quality expectations into every important handoff.', href: '/dashboard/qualityguard/', icon: ShieldCheck },
  { id: 'ai-ready', name: 'DataSculpt AI-Ready', shortName: 'AI-Ready', description: 'Prepare useful context for search, forecasting, and intelligent work.', href: '/dashboard/ai-ready/', icon: Bot },
  { id: 'flow', name: 'DataSculpt Flow', shortName: 'Flow', description: 'Bring product stages into one visible, understandable workflow.', href: '/dashboard/flow/', icon: GitBranch },
];

const accessMatrix: Record<KnownPlanSlug, Record<ProductModuleId, PlanAccessLevel>> = {
  starter: { transform: 'preview', velocity: 'preview', qualityguard: 'preview', 'ai-ready': 'preview', flow: 'preview' },
  developer: { transform: 'basic', velocity: 'preview', qualityguard: 'preview', 'ai-ready': 'preview', flow: 'basic' },
  professional: { transform: 'included', velocity: 'included', qualityguard: 'included', 'ai-ready': 'included', flow: 'included' },
  scale: { transform: 'advanced', velocity: 'advanced', qualityguard: 'advanced', 'ai-ready': 'advanced', flow: 'advanced' },
  enterprise: { transform: 'enterprise', velocity: 'enterprise', qualityguard: 'enterprise', 'ai-ready': 'enterprise', flow: 'enterprise' },
};

const accessLabels: Record<PlanAccessLevel, string> = {
  preview: 'Preview',
  basic: 'Basic access',
  included: 'Included',
  advanced: 'Advanced',
  enterprise: 'Enterprise',
};

export function knownPlanSlug(slug?: string | null): KnownPlanSlug {
  const normalized = slug?.trim().toLowerCase();
  return normalized === 'developer' || normalized === 'professional' || normalized === 'scale' || normalized === 'enterprise' ? normalized : 'starter';
}

export function entitlementFor(slug: string | null | undefined, moduleId: ProductModuleId): ModuleEntitlement {
  const level = accessMatrix[knownPlanSlug(slug)][moduleId];
  return { moduleId, level, enabled: level !== 'preview', label: accessLabels[level] };
}

export function starterPlan(): WorkspacePlan {
  return {
    slug: 'starter',
    name: 'Starter',
    description: 'Explore the DataSculpt workspace before selecting a production plan.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    currency: 'USD',
    features: ['Product workspace previews', 'Plan guidance'],
    popular: false,
    isActive: true,
    source: 'starter',
  };
}

export function normalizePayment(value: unknown): WorkspacePayment | null {
  if (!isRecord(value)) return null;
  const transactionId = typeof value.transaction_id === 'string' ? value.transaction_id : '';
  const fallbackId = typeof value.id === 'number' || typeof value.id === 'string' ? String(value.id) : '';
  if (!transactionId && !fallbackId) return null;
  return {
    id: fallbackId || transactionId,
    transactionId: transactionId || fallbackId,
    planName: typeof value.plan_name === 'string' ? value.plan_name : null,
    amount: numericValue(value.amount),
    currency: typeof value.currency === 'string' ? value.currency : 'USD',
    status: typeof value.status === 'string' ? value.status : 'unknown',
    type: typeof value.type === 'string' ? value.type : null,
    createdAt: typeof value.created_at === 'string' ? value.created_at : null,
    paidAt: typeof value.paid_at === 'string' ? value.paid_at : null,
  };
}

export function normalizePaymentPage(value: unknown): WorkspacePaymentPage {
  if (!isRecord(value)) return { payments: [], currentPage: 1, lastPage: 1, total: 0 };
  const payments = Array.isArray(value.data)
    ? value.data.map(normalizePayment).filter((payment): payment is WorkspacePayment => Boolean(payment))
    : [];
  return {
    payments,
    currentPage: positiveInteger(value.current_page, 1),
    lastPage: positiveInteger(value.last_page, 1),
    total: positiveInteger(value.total, payments.length),
  };
}

function numericValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return null;
}


function positiveInteger(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : fallback;
}
