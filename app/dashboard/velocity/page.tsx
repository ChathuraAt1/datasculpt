'use client';

import { useMemo, useState } from 'react';
import { Gauge, Layers3, Route } from 'lucide-react';
import { useWorkspace } from '@/components/dashboard/WorkspaceContext';
import { AccessNotice, SelectField, WorkspacePageHeader, WorkspacePanel } from '@/components/dashboard/WorkspaceUI';

const profiles: Record<string, Record<string, { title: string; approach: string; consideration: string }>> = {
  transform: {
    focused: { title: 'Focused transform profile', approach: 'Start with a single accelerated worker and columnar memory planning.', consideration: 'Confirm schema complexity and run frequency before allocating production capacity.' },
    balanced: { title: 'Balanced production profile', approach: 'Plan parallel transformation stages with reusable columnar data handoffs.', consideration: 'Validate source partitioning and expected concurrency with the architecture team.' },
    urgent: { title: 'Priority processing profile', approach: 'Design for wider parallel execution and reduced intermediate movement.', consideration: 'A production benchmark is required before capacity or completion time can be committed.' },
  },
  joins: {
    focused: { title: 'Join preparation profile', approach: 'Reduce unnecessary columns and organize join keys before acceleration.', consideration: 'Dataset skew and key cardinality materially affect the final architecture.' },
    balanced: { title: 'Parallel join profile', approach: 'Plan partition-aware processing with a balanced compute footprint.', consideration: 'Use representative data during architecture validation.' },
    urgent: { title: 'High-priority join profile', approach: 'Evaluate multi-worker partitioning and memory-safe spill behavior.', consideration: 'This recommendation is a planning reference, not a performance guarantee.' },
  },
  features: {
    focused: { title: 'Feature preparation profile', approach: 'Prioritize repeatable transformations and consistent feature definitions.', consideration: 'Confirm downstream freshness and publishing requirements.' },
    balanced: { title: 'Production feature profile', approach: 'Plan reusable preparation stages with quality checks at key handoffs.', consideration: 'Final worker capacity depends on transformation complexity.' },
    urgent: { title: 'High-volume feature profile', approach: 'Evaluate parallel preparation and controlled out-of-core processing.', consideration: 'Review production volume with DataSculpt before deployment.' },
  },
};

export default function VelocityWorkspacePage() {
  const { accessFor } = useWorkspace();
  const entitlement = accessFor('velocity');
  const [workload, setWorkload] = useState('transform');
  const [size, setSize] = useState('growing');
  const [priority, setPriority] = useState('balanced');
  const profile = useMemo(() => profiles[workload][priority], [priority, workload]);

  return <div className="mx-auto max-w-[1350px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10"><WorkspacePageHeader eyebrow="DataSculpt Velocity" title="Plan how important work moves forward." description="Explore a processing approach for your workload without presenting estimates as live execution, measured performance, or guaranteed capacity." /><div className="mt-6"><AccessNotice entitlement={entitlement} /></div><section className="mt-8 grid gap-5 xl:grid-cols-[0.68fr_1.32fr]"><WorkspacePanel className="p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-800"><Gauge size={19} /></span><h2 className="font-semibold text-[#2d291f]">Workload planner</h2></div><div className="mt-6 space-y-5"><SelectField label="Workload type" value={workload} onChange={setWorkload} disabled={!entitlement.enabled} options={[{ value: 'transform', label: 'Large transformations' }, { value: 'joins', label: 'Joins and aggregations' }, { value: 'features', label: 'AI feature preparation' }]} /><SelectField label="Data size" value={size} onChange={setSize} disabled={!entitlement.enabled} options={[{ value: 'exploring', label: 'Exploring' }, { value: 'growing', label: 'Growing production workload' }, { value: 'high', label: 'High-volume enterprise workload' }]} /><SelectField label="Processing priority" value={priority} onChange={setPriority} disabled={!entitlement.enabled} options={[{ value: 'focused', label: 'Cost-conscious planning' }, { value: 'balanced', label: 'Balanced production planning' }, { value: 'urgent', label: 'Completion-time priority' }]} /></div></WorkspacePanel><WorkspacePanel className="overflow-hidden"><div className="border-b border-[#e4dece] bg-[#fbfaf5] p-6"><p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-brand-700">Reference recommendation</p><h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#29251d]">{profile.title}</h2></div><div className="grid gap-5 p-6 md:grid-cols-2"><div className="rounded-2xl border border-brand-200 bg-brand-100/50 p-5"><Layers3 className="text-brand-800" size={20} /><p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-brand-800">Suggested approach</p><p className="mt-3 text-sm leading-6 text-[#5d5541]">{profile.approach}</p></div><div className="rounded-2xl border border-[#dfd9ca] bg-[#faf8f2] p-5"><Route className="text-brand-700" size={20} /><p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-brand-800">Architecture consideration</p><p className="mt-3 text-sm leading-6 text-[#625c4f]">{profile.consideration}</p></div></div><div className="mx-6 mb-6 rounded-xl border border-dashed border-[#d8cfb5] p-4 text-xs leading-5 text-[#756e5d]">Selected context: <strong className="capitalize text-[#3d382e]">{workload}</strong> · <strong className="capitalize text-[#3d382e]">{size}</strong> · <strong className="capitalize text-[#3d382e]">{priority}</strong>. No compute job has been created.</div></WorkspacePanel></section></div>;
}
