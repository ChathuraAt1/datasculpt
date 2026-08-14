'use client';

import { useState } from 'react';
import { ArrowDown, ArrowUp, GitBranch, ListChecks } from 'lucide-react';
import { useWorkspace } from '@/components/dashboard/WorkspaceContext';
import { AccessNotice, WorkspacePageHeader, WorkspacePanel } from '@/components/dashboard/WorkspaceUI';

const initialStages = [
  { id: 'connect', name: 'Connect', description: 'Bring the approved source context into view.' },
  { id: 'transform', name: 'Transform', description: 'Shape the source into a useful structure.' },
  { id: 'quality', name: 'Quality', description: 'Review the expectations that make it trustworthy.' },
  { id: 'ai', name: 'AI preparation', description: 'Prepare approved context for intelligent work.' },
  { id: 'deliver', name: 'Deliver', description: 'Make the result available to the intended team.' },
];

export default function FlowWorkspacePage() {
  const { accessFor } = useWorkspace();
  const entitlement = accessFor('flow');
  const [stages, setStages] = useState(initialStages);

  function move(index: number, direction: -1 | 1) {
    if (!entitlement.enabled) return;
    const destination = index + direction;
    if (destination < 0 || destination >= stages.length) return;
    setStages((current) => { const next = [...current]; [next[index], next[destination]] = [next[destination], next[index]]; return next; });
  }

  return <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10"><WorkspacePageHeader eyebrow="DataSculpt Flow" title="Keep the direction of every workflow clear." description="Arrange a local workflow outline that connects the product stages. This preview does not save, schedule, execute, or monitor production work." /><div className="mt-6"><AccessNotice entitlement={entitlement} /></div><section className="mt-8 grid gap-5 xl:grid-cols-[1fr_0.72fr]"><WorkspacePanel className="p-6"><div className="flex items-center justify-between"><div><p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-brand-700">Workflow composer</p><h2 className="mt-2 text-xl font-semibold text-[#29251d]">Arrange the product stages</h2></div><GitBranch className="text-brand-700" size={22} /></div><ol className="mt-6 space-y-3">{stages.map((stage, index) => <li key={stage.id} className="grid gap-4 rounded-xl border border-[#dfd9ca] bg-[#fbfaf6] p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center"><span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-800">{index + 1}</span><div><input aria-label={`Name for stage ${index + 1}`} value={stage.name} disabled={!entitlement.enabled} onChange={(event) => setStages((current) => current.map((item) => item.id === stage.id ? { ...item, name: event.target.value } : item))} className="w-full bg-transparent text-sm font-semibold text-[#353127] outline-none focus:ring-1 focus:ring-brand-500 disabled:text-[#6f695c]" /><input aria-label={`Description for ${stage.name}`} value={stage.description} disabled={!entitlement.enabled} onChange={(event) => setStages((current) => current.map((item) => item.id === stage.id ? { ...item, description: event.target.value } : item))} className="mt-1 w-full bg-transparent text-xs text-[#746e60] outline-none focus:ring-1 focus:ring-brand-500 disabled:text-[#8c8679]" /></div><div className="flex gap-2"><button type="button" disabled={!entitlement.enabled || index === 0} onClick={() => move(index, -1)} aria-label={`Move ${stage.name} earlier`} className="grid h-8 w-8 place-items-center rounded-lg border border-[#dcd5c3] text-[#635d50] hover:border-brand-400 hover:text-brand-800 disabled:opacity-30"><ArrowUp size={14} /></button><button type="button" disabled={!entitlement.enabled || index === stages.length - 1} onClick={() => move(index, 1)} aria-label={`Move ${stage.name} later`} className="grid h-8 w-8 place-items-center rounded-lg border border-[#dcd5c3] text-[#635d50] hover:border-brand-400 hover:text-brand-800 disabled:opacity-30"><ArrowDown size={14} /></button></div></li>)}</ol></WorkspacePanel><WorkspacePanel className="p-6"><ListChecks className="text-brand-700" size={21} /><p className="mt-5 text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-brand-700">Local workflow summary</p><div className="mt-5 space-y-1">{stages.map((stage, index) => <div key={stage.id} className="relative flex gap-4 pb-6 last:pb-0"><div className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#27241c] text-xs font-bold text-[#f0cc56]">{index + 1}</div>{index < stages.length - 1 && <span className="absolute left-[0.95rem] top-7 h-full w-px bg-brand-300" />}<div><p className="text-sm font-semibold text-[#39342a]">{stage.name || `Stage ${index + 1}`}</p><p className="mt-1 text-xs leading-5 text-[#777062]">{stage.description || 'No description added.'}</p></div></div>)}</div><p className="mt-6 rounded-xl border border-dashed border-[#d8cfb5] p-4 text-xs leading-5 text-[#756e5d]">This arrangement exists only in the current page state. No workflow has been saved or executed.</p></WorkspacePanel></section></div>;
}
