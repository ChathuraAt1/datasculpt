'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Braces, FileJson2, Sparkles } from 'lucide-react';
import { useWorkspace } from '@/components/dashboard/WorkspaceContext';
import { AccessNotice, SelectField, WorkspaceButton, WorkspacePageHeader, WorkspacePanel } from '@/components/dashboard/WorkspaceUI';

const sourceFields = ['customer_id', 'fullName', 'last_order', 'accountValue'];
const targetOptions = ['customer_id', 'customer_name', 'last_order_at', 'lifetime_value', 'Ignore field'];

export default function TransformWorkspacePage() {
  const { accessFor } = useWorkspace();
  const entitlement = accessFor('transform');
  const [source, setSource] = useState('json');
  const [target, setTarget] = useState('parquet');
  const [mappings, setMappings] = useState<Record<string, string>>({ customer_id: 'customer_id', fullName: 'customer_name', last_order: 'last_order_at', accountValue: 'lifetime_value' });
  const [reviewed, setReviewed] = useState(false);
  const summary = useMemo(() => sourceFields.filter((field) => mappings[field] !== 'Ignore field').map((field) => `${field} → ${mappings[field]}`), [mappings]);

  return <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
    <WorkspacePageHeader eyebrow="DataSculpt Transform" title="Make every source easier to use." description="Create a clear transformation draft for a representative source. This workspace runs entirely in your browser and does not upload or persist customer data." />
    <div className="mt-6"><AccessNotice entitlement={entitlement} /></div>

    <section className="mt-8 grid gap-5 xl:grid-cols-[0.72fr_1.28fr]">
      <WorkspacePanel className="p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-800"><FileJson2 size={19} /></span><div><p className="font-semibold text-[#2d291f]">Transformation context</p><p className="text-xs text-[#777062]">Choose a representative source and destination.</p></div></div><div className="mt-6 space-y-5"><SelectField label="Source structure" value={source} onChange={setSource} disabled={!entitlement.enabled} options={[{ value: 'json', label: 'Nested JSON records' }, { value: 'csv', label: 'Delimited CSV file' }, { value: 'database', label: 'Relational database table' }, { value: 'events', label: 'Event stream messages' }]} /><SelectField label="Target structure" value={target} onChange={setTarget} disabled={!entitlement.enabled} options={[{ value: 'parquet', label: 'Typed Parquet dataset' }, { value: 'table', label: 'Analytics-ready table' }, { value: 'documents', label: 'AI-ready documents' }]} /></div><div className="mt-6 rounded-xl border border-[#ded8c8] bg-[#faf8f1] p-4"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-700">Local-only draft</p><p className="mt-2 text-xs leading-5 text-[#6e6859]">No file is uploaded. The controls below demonstrate how source fields could be organized before a backend transformation service is connected.</p></div></WorkspacePanel>

      <WorkspacePanel className="p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-brand-700">Field mapping</p><h2 className="mt-2 text-xl font-semibold text-[#29251d]">Shape the destination</h2></div><Braces className="text-brand-700" size={21} /></div><div className="mt-6 space-y-3">{sourceFields.map((field) => <div key={field} className="grid items-center gap-3 rounded-xl border border-[#e2dccd] bg-[#fbfaf6] p-3 sm:grid-cols-[1fr_auto_1fr]"><code className="rounded-lg bg-[#eee9dc] px-3 py-2 text-xs text-[#4d473a]">{field}</code><ArrowRight className="hidden text-brand-600 sm:block" size={16} /><select aria-label={`Destination for ${field}`} disabled={!entitlement.enabled} value={mappings[field]} onChange={(event) => { setReviewed(false); setMappings((current) => ({ ...current, [field]: event.target.value })); }} className="rounded-lg border border-[#d9d2c0] bg-white px-3 py-2 text-xs text-[#332f25] outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:bg-[#efede6]">{targetOptions.map((option) => <option key={option}>{option}</option>)}</select></div>)}</div><WorkspaceButton disabled={!entitlement.enabled} onClick={() => setReviewed(true)} className="mt-6"><Sparkles size={16} />Review transformation draft</WorkspaceButton></WorkspacePanel>
    </section>

    <WorkspacePanel className="mt-5 p-6"><p className="text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-brand-700">Representative output</p><div className="mt-5 grid gap-5 lg:grid-cols-2"><div className="rounded-xl bg-[#211f19] p-5 text-[#e9e1ce]"><p className="text-xs font-semibold text-[#d7b84f]">SOURCE · {source.toUpperCase()}</p><pre className="mt-4 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6">{`{\n  \"customer_id\": \"C-1042\",\n  \"fullName\": \"A. Perera\",\n  \"last_order\": \"2026/08/14\",\n  \"accountValue\": \"18450.00\"\n}`}</pre></div><div className="rounded-xl border border-brand-200 bg-brand-100/45 p-5"><p className="text-xs font-semibold text-brand-800">TARGET · {target.toUpperCase()}</p><div className="mt-4 space-y-2">{summary.map((line) => <code key={line} className="block rounded-lg border border-white/70 bg-white/70 px-3 py-2 text-xs text-[#4c4534]">{line}</code>)}</div>{reviewed && <p role="status" className="mt-4 text-xs font-semibold text-brand-800">Draft reviewed locally. No data was submitted or saved.</p>}</div></div></WorkspacePanel>
  </div>;
}
