'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, CreditCard, LockKeyhole, Sparkles } from 'lucide-react';
import type { ModuleEntitlement } from '@/lib/workspace';
import { productModules } from '@/lib/workspace';
import { useWorkspace } from '@/components/dashboard/WorkspaceContext';

const moduleHighlights: Record<string, string[]> = {
  transform: [
    'Interactive schema reshaping and field mapping',
    'Automated data cleansing and normalization',
    'Exportable pipeline transformation logic',
  ],
  velocity: [
    'Real-time throughput and execution planning',
    'Cluster latency and cost projections',
    'Compute architecture optimization presets',
  ],
  qualityguard: [
    'Automated schema anomaly and drift detection',
    'Configurable data completeness thresholds',
    'Real-time quality scoring and pipeline alerts',
  ],
  'ai-ready': [
    'Domain-specific LLM context engineering',
    'Synchronous AI preparation guidance generator',
    'Token-optimized knowledge structuring',
  ],
  flow: [
    'Unified multi-stage pipeline orchestration',
    'Visual dependency mapping and bottleneck detection',
    'End-to-end data lineage visibility',
  ],
};

type PlanUpgradeGateProps = {
  entitlement: ModuleEntitlement;
  children: React.ReactNode;
};

export function PlanUpgradeGate({ entitlement, children }: PlanUpgradeGateProps) {
  const { plan } = useWorkspace();

  if (entitlement.enabled) {
    return <>{children}</>;
  }

  const moduleDef = productModules.find((m) => m.id === entitlement.moduleId);
  const moduleName = moduleDef?.name || 'this module';
  const requiredPlan =
    entitlement.moduleId === 'transform' || entitlement.moduleId === 'flow'
      ? 'Developer'
      : 'Professional';
  const currentPlan = plan?.name || 'Starter';
  const highlights = moduleHighlights[entitlement.moduleId] || [
    'Full access to interactive operations and tooling',
    'Production data pipeline capabilities',
    'Direct workspace integration',
  ];

  return (
    <div className="relative isolate mt-8 overflow-hidden rounded-3xl">
      {/* Blurred background preview */}
      <div
        className="pointer-events-none select-none filter blur-[3px] opacity-35"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* High-visibility upgrade overlay modal */}
      <div className="absolute inset-0 z-20 flex items-center justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-lg rounded-3xl border border-brand-300/80 bg-white/95 p-6 sm:p-8 text-center shadow-[0_20px_50px_rgba(75,62,29,0.18)] backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-300/70 bg-gradient-to-br from-brand-100 to-brand-200 text-brand-800 shadow-brand">
            <LockKeyhole size={24} />
          </div>

          <p className="mt-4 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-brand-700">
            ACTIVE PLAN UPGRADE REQUIRED
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Unlock {moduleName}
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {moduleDef?.description ||
              'This module requires an upgraded plan to run operations in your workspace.'}
          </p>

          <div className="my-5 rounded-2xl border border-brand-100/90 bg-[#faf8f1] p-4 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#756e60]">
              Included with {requiredPlan} plan:
            </p>
            <ul className="mt-2.5 space-y-2">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 size={14} className="shrink-0 text-brand-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-500">
            <span>Your current plan:</span>
            <span className="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-800">
              {currentPlan}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/billing/"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-brand-500 bg-brand-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-brand transition hover:bg-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <CreditCard size={16} />
              Upgrade to {requiredPlan}
            </Link>
            <Link
              href="/pricing/"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dcd5c3] bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              Compare plans <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
