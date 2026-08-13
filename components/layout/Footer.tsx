import Link from 'next/link';
import { Globe2 } from 'lucide-react';

const columns = [
  { title: 'Platform Modules', links: ['Data Ingestion', 'AI Transformation', 'Data Quality', 'Governance Layer'] },
  { title: 'Engineering Stack', links: ['RAPIDS', 'cuDF', 'CUDA', 'Kubernetes'] },
  { title: 'Resources', links: ['API Documentation', 'Architecture Guide', 'Security Overview', 'Contact Engineering'] },
  { title: 'Enterprise', links: ['Compliance', 'Trust Center', 'SLA & Support', 'Partner Network'] },
];

export function Footer() {
  return <footer className="border-t border-slate-800/80 bg-slate-950/80">
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => <div key={column.title}><h2 className="mb-4 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">{column.title}</h2><ul className="space-y-3">{column.links.map((link) => <li key={link}><Link href="#" className="text-sm text-slate-400 transition hover:text-cyan-300">{link}</Link></li>)}</ul></div>)}
      </div>
      <div className="mt-14 flex flex-col gap-5 border-t border-slate-800/80 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
        <p>© 2026 DataSculpt.lk. Enterprise data, intelligently transformed.</p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3"><Link href="#" className="hover:text-slate-300">Privacy Policy</Link><Link href="#" className="hover:text-slate-300">Terms of Service</Link><label className="flex items-center gap-2 text-slate-400"><Globe2 size={14} className="text-cyan-400" /><span className="sr-only">Regional infrastructure</span><select defaultValue="colombo" className="cursor-pointer bg-transparent text-xs text-slate-300 outline-none"><option value="colombo" className="bg-slate-900">US East / Colombo Nodes</option></select></label></div>
      </div>
    </div>
  </footer>;
}
