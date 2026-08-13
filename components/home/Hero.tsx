'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Database, GitBranch, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

const stages = [
  { label: 'INGEST', title: 'Raw sources', detail: 'APIs · streams · lakes', icon: Database, color: 'text-blue-300', line: 'from-blue-500/70' },
  { label: 'SCULPT', title: 'AI transforms', detail: 'RAPIDS · cuDF · CUDA', icon: Sparkles, color: 'text-cyan-300', line: 'from-cyan-500/70' },
  { label: 'GOVERN', title: 'Trusted output', detail: 'Quality · lineage · policy', icon: ShieldCheck, color: 'text-emerald-300', line: 'from-emerald-500/70' },
];

export function Hero() {
  return <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
    <div className="grid items-center gap-16 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
      <div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}><StatusBadge>AI DATA ENGINEERING / V1</StatusBadge></motion.div>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.6 }} className="mt-7 max-w-3xl text-balance text-5xl font-semibold leading-[1.04] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.4rem]">Turn raw data into <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300 bg-clip-text text-transparent">operational intelligence.</span></motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg">DataSculpt gives enterprise teams a high-performance control plane to ingest, transform, govern, and activate trusted data with AI at the core.</motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28, duration: 0.6 }} className="mt-9 flex flex-col gap-3 sm:flex-row"><Button href="/products/">Explore the platform <ArrowRight size={16} /></Button><Button href="#architecture" variant="ghost">See how it works</Button></motion.div>
        <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[0.68rem] uppercase tracking-wider text-slate-500"><span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" />Built for scale</span><span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" />Governed by design</span></div>
      </div>
      <PipelineVisual />
    </div>
    <div className="mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-800/80 bg-slate-800/80 sm:grid-cols-4"><Metric value="10×" label="faster transforms" /><Metric value="99.9%" label="pipeline uptime" /><Metric value="< 50ms" label="query latency" /><Metric value="24/7" label="operational visibility" /></div>
  </section>;
}

function PipelineVisual() {
  return <GlassCard className="relative overflow-hidden p-5 sm:p-7" >
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
    <div className="mb-8 flex items-center justify-between"><div><p className="eyebrow">LIVE PIPELINE / DS-042</p><p className="mt-2 text-sm font-medium text-slate-200">Customer intelligence fabric</p></div><StatusBadge tone="green">Healthy</StatusBadge></div>
    <div className="relative space-y-4">
      {stages.map((stage, index) => { const Icon = stage.icon; return <div key={stage.label} className="relative"><motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + index * 0.16, duration: 0.45 }} className="relative z-10 flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-950/80 p-4"><div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-900 ${stage.color}`}><Icon size={19} /></div><div className="min-w-0"><p className="font-mono text-[0.6rem] tracking-[0.18em] text-slate-500">{stage.label}</p><p className="mt-1 text-sm font-semibold text-slate-100">{stage.title}</p><p className="mt-1 truncate font-mono text-[0.68rem] text-slate-500">{stage.detail}</p></div><div className="ml-auto flex items-center gap-2 font-mono text-[0.62rem] text-emerald-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />SYNCED</div></motion.div>{index < stages.length - 1 && <div className={`ml-9 h-4 w-px bg-gradient-to-b ${stage.line} to-transparent`} />}</div>; })}
    </div>
    <div className="mt-7 flex items-center justify-between border-t border-slate-800/80 pt-5"><span className="flex items-center gap-2 font-mono text-[0.65rem] text-slate-500"><GitBranch size={14} className="text-cyan-400" />production / main</span><span className="flex items-center gap-2 font-mono text-[0.65rem] text-cyan-300"><Zap size={13} />42,810 rows/s</span></div>
  </GlassCard>;
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="bg-slate-950/90 px-4 py-5 sm:px-6"><p className="font-mono text-xl font-semibold tracking-tight text-cyan-300 sm:text-2xl">{value}</p><p className="mt-1 text-[0.68rem] uppercase tracking-wider text-slate-500">{label}</p></div>;
}
