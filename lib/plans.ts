import { isRecord } from '@/lib/auth';

export type BillingCycle = 'monthly' | 'annual';

export type SubscriptionPlan = {
  slug: string;
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  currency: string;
  features: string[];
  popular: boolean;
  isActive: boolean;
  fallback?: boolean;
};

export const planOrder = ['developer', 'professional', 'scale', 'enterprise'] as const;

export const fallbackPlans: SubscriptionPlan[] = [
  {
    slug: 'developer',
    name: 'Developer',
    description: 'For individual engineers and small AI prototypes building initial data pipelines.',
    monthlyPrice: 49,
    yearlyPrice: 39,
    currency: 'USD',
    features: ['Core ingestion connectors', '25M records / month', 'Community support', 'Standard CPU execution'],
    popular: false,
    isActive: true,
    fallback: true,
  },
  {
    slug: 'professional',
    name: 'Professional',
    description: 'For growing engineering teams needing GPU-accelerated data transformation.',
    monthlyPrice: 199,
    yearlyPrice: 159,
    currency: 'USD',
    features: ['GPU-accelerated transforms', '250M records / month', 'QualityGuard assertions', 'Priority support'],
    popular: true,
    isActive: true,
    fallback: true,
  },
  {
    slug: 'scale',
    name: 'Scale',
    description: 'For high-throughput enterprise AI workloads and vector feature store preparation.',
    monthlyPrice: 499,
    yearlyPrice: 399,
    currency: 'USD',
    features: ['Multi-cluster workloads', '1B records / month', 'AI-ready feature preparation', 'Advanced observability'],
    popular: false,
    isActive: true,
    fallback: true,
  },
  {
    slug: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations requiring custom VPC deployments and dedicated GPU clusters.',
    monthlyPrice: null,
    yearlyPrice: null,
    currency: 'USD',
    features: ['Custom VPC deployment', 'Dedicated GPU clusters', 'Security and SLA review', 'Architecture partnership'],
    popular: false,
    isActive: true,
    fallback: true,
  },
];

export function normalizePlan(value: unknown): SubscriptionPlan | null {
  if (!isRecord(value) || typeof value.slug !== 'string' || typeof value.name !== 'string') return null;
  const monthly = toPrice(value.monthly_price);
  const yearly = toPrice(value.yearly_price);
  const legacy = toPrice(value.price);
  return {
    slug: value.slug.trim().toLowerCase(),
    name: value.name,
    description: typeof value.description === 'string' ? value.description : '',
    monthlyPrice: monthly ?? (value.interval === 'monthly' ? legacy : null),
    yearlyPrice: yearly ?? (value.interval === 'yearly' ? legacy : null),
    currency: typeof value.currency === 'string' ? value.currency : 'USD',
    features: Array.isArray(value.features) ? value.features.filter((feature): feature is string => typeof feature === 'string') : [],
    popular: value.popular === true,
    isActive: value.is_active !== false,
  };
}

export function normalizePlanCatalog(value: unknown) {
  const plans = Array.isArray(value)
    ? value.map(normalizePlan).filter((plan): plan is SubscriptionPlan => Boolean(plan?.isActive))
    : [];
  const ordered = planOrder
    .map((slug) => plans.find((plan) => plan.slug === slug))
    .filter((plan): plan is SubscriptionPlan => Boolean(plan));
  const remaining = plans.filter((plan) => !planOrder.includes(plan.slug as (typeof planOrder)[number]));
  return [...ordered, ...remaining];
}

export function priceFor(plan: SubscriptionPlan, cycle: BillingCycle) {
  return cycle === 'annual' ? plan.yearlyPrice : plan.monthlyPrice;
}

export function formatPrice(value: number | null, currency = 'USD') {
  if (value === null) return 'Custom';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);
}

function toPrice(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value);
  return null;
}
