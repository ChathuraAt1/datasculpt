'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Database,
  FileCode2,
  Gauge,
  Layers3,
  Network,
  Rows3,
  ScanSearch,
  Server,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusBadge } from '@/components/ui/StatusBadge';

type ProductId = 'transform' | 'velocity' | 'qualityguard' | 'ai-ready' | 'flow-ops';

type ProductModule = {
  id: ProductId;
  name: string;
  shortName: string;
  descriptor: string;
  icon: typeof Database;
  eyebrow: string;
  title: string;
  description: string;
  capabilities: string[];
};

const products: ProductModule[] = [
  {
    id: 'transform',
    name: 'DataSculpt Transform™',
    shortName: 'Transform',
    descriptor: 'AI-Assisted Data Transformation Engine',
    icon: Sparkles,
    eyebrow: '01 / INGESTION & TRANSFORMATION',
    title: 'Shape every source into trusted structure.',
    description: 'Transform turns inconsistent enterprise inputs into clean, strongly typed datasets ready for analytics, automation, and downstream intelligence.',
    capabilities: ['AI-assisted mapping from messy source fields to target schemas', 'Incremental transformations with lineage-ready outputs', 'Parquet-first delivery for analytical workloads and data lakes'],
  },
  {
    id: 'velocity',
    name: 'DataSculpt Velocity™',
    shortName: 'Velocity',
    descriptor: 'GPU-Accelerated Compute Engine',
    icon: Zap,
    eyebrow: '02 / COMPUTE ACCELERATION',
    title: 'Move from batch-bound to business-speed.',
    description: 'Velocity brings GPU-accelerated dataframe operations to transformation-heavy workloads, reducing the distance between raw data and a decision-ready result.',
    capabilities: ['NVIDIA cuDF and CUDA-X compatible compute patterns', 'Zero-copy Apache Arrow movement between processing stages', 'Elastic throughput for wide, high-volume transformation jobs'],
  },
  {
    id: 'qualityguard',
    name: 'DataSculpt QualityGuard™',
    shortName: 'QualityGuard',
    descriptor: 'Data Quality & Anomaly Validation',
    icon: ShieldCheck,
    eyebrow: '03 / QUALITY & TRUST',
    title: 'Make confidence measurable at every handoff.',
    description: 'QualityGuard continuously checks the shape, freshness, and behavior of your data so teams can act on trusted signals instead of chasing silent failures.',
    capabilities: ['Real-time schema monitoring and drift detection', 'Automated assertions for completeness, validity, and freshness', 'Actionable anomaly context for engineering and business owners'],
  },
  {
    id: 'ai-ready',
    name: 'DataSculpt AI-Ready™',
    shortName: 'AI-Ready',
    descriptor: 'LLM & Feature Dataset Preparation',
    icon: Layers3,
    eyebrow: '04 / AI DATA PREPARATION',
    title: 'Prepare enterprise data for intelligent systems.',
    description: 'AI-Ready organizes operational knowledge into retrieval, embedding, and feature-ready datasets that give enterprise AI systems useful context.',
    capabilities: ['RAG-aware document chunking and metadata preparation', 'Embedding-ready records with traceable source context', 'Feature dataset publishing patterns for enterprise ML workflows'],
  },
  {
    id: 'flow-ops',
    name: 'DataSculpt Flow (Ops)™',
    shortName: 'Flow (Ops)',
    descriptor: 'Pipeline Orchestration & Observability',
    icon: Workflow,
    eyebrow: '05 / CONTROL PLANE',
    title: 'Operate the whole data motion from one control plane.',
    description: 'Flow gives platform teams a clear operating surface for pipeline dependencies, execution state, throughput, and the next action when a run needs attention.',
    capabilities: ['Composable DAG building for repeatable data operations', 'Run-level telemetry with throughput and execution context', 'A shared operational view for engineering and data stakeholders'],
  },
];

export default function ProductsPage() {
  const [activeProduct, setActiveProduct] = useState<ProductId>('transform');

  function selectProduct(id: ProductId) {
    setActiveProduct(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-10 lg:px-8 lg:pt-14">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-4xl text-center">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-brand-300"><span>Home</span><ChevronRight size={14} /><span className="text-brand-300">Products</span></Link>
      <div className="mt-8"><span className="inline-flex rounded-full border border-brand-500/30 bg-brand-950/40 px-3.5 py-1.5 font-mono text-xs tracking-[0.16em] text-brand-400">DATA ENGINEERING PRODUCT SUITE</span></div>
      <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">5 Modular Engines. <span className="bg-gradient-to-r from-brand-200 via-brand-400 to-brand-300 bg-clip-text text-transparent">One Unified AI Data Platform.</span></h1>
      <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg">Explore the specialized core technologies behind DataSculpt&apos;s high-throughput ingestion, GPU acceleration, continuous quality validation, and AI-ready feature preparation.</p>
    </motion.div>

    <div className="sticky top-0 z-10 -mx-5 mt-14 border-y border-slate-800/80 bg-slate-950/90 px-5 py-3 backdrop-blur-xl lg:-mx-8 lg:px-8">
      <nav aria-label="Product modules" className="mx-auto flex max-w-7xl gap-2 overflow-x-auto pb-1 scrollbar-none">
        {products.map((product) => { const Icon = product.icon; const isActive = activeProduct === product.id; return <button key={product.id} type="button" onClick={() => selectProduct(product.id)} aria-current={isActive ? 'page' : undefined} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:px-5 ${isActive ? 'bg-brand-400 font-semibold text-slate-950 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'border border-slate-800 bg-slate-900/80 text-slate-400 hover:text-brand-400'}`}><Icon size={15} /><span>{product.shortName}</span></button>; })}
      </nav>
    </div>

    <div className="mt-16 space-y-24 lg:space-y-32">
      {products.map((product, index) => <ProductSection key={product.id} product={product} index={index} onActiveChange={setActiveProduct} />)}
    </div>

    <motion.section id="architecture-demo" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="mt-24 scroll-mt-28 rounded-2xl border border-brand-500/30 bg-gradient-to-r from-slate-900 via-brand-950/20 to-slate-900 p-7 text-center shadow-[0_0_30px_rgba(234,179,8,0.08)] sm:p-10 lg:mt-32">
      <p className="eyebrow">BUILD THE NEXT DATA ADVANTAGE</p>
      <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Ready to Accelerate Your Enterprise Data Pipelines?</h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">Bring your highest-value data workflow and map the fastest path from source complexity to governed intelligence.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button href="#architecture-demo">Schedule Architecture Demo <ArrowRight size={16} /></Button><Button href="#technical-docs" variant="ghost">View Technical Docs <FileCode2 size={15} /></Button></div>
      <div id="technical-docs" className="mx-auto mt-8 flex max-w-2xl scroll-mt-28 items-center justify-center gap-2 border-t border-slate-800/80 pt-5 text-xs text-slate-500"><FileCode2 size={14} className="text-brand-400" /><span>Technical references align to the documented <code className="font-mono text-brand-300">/api</code> contract.</span></div>
    </motion.section>
  </div>;
}

function ProductSection({ product, index, onActiveChange }: { product: ProductModule; index: number; onActiveChange: (id: ProductId) => void }) {
  const Icon = product.icon;
  return <motion.section id={product.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} onViewportEnter={() => onActiveChange(product.id)} className="scroll-mt-32">
    <div className="mb-8 flex items-start gap-4"><div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-brand-500/30 bg-brand-950/40 text-brand-300 shadow-[0_0_20px_rgba(234,179,8,0.1)]"><Icon size={22} /></div><div><p className="eyebrow">{product.eyebrow}</p><h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{product.name}</h2><p className="mt-1 font-mono text-xs uppercase tracking-wider text-brand-400">{product.descriptor}</p></div><span className="ml-auto hidden font-mono text-xs text-slate-600 sm:block">0{index + 1} / 05</span></div>
    <div className="grid items-start gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      <div><h3 className="text-3xl font-semibold leading-tight tracking-tight text-slate-100 sm:text-4xl">{product.title}</h3><p className="mt-5 leading-7 text-slate-400">{product.description}</p><ul className="mt-7 space-y-4">{product.capabilities.map((capability) => <li key={capability} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-400/15 text-brand-300"><Check size={13} strokeWidth={3} /></span>{capability}</li>)}</ul>{product.id === 'transform' && <div className="mt-7 rounded-xl border border-brand-500/25 bg-brand-950/20 p-5"><p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-brand-400">THE PROBLEM SOLVED</p><p className="mt-3 text-sm leading-6 text-slate-300">Replace one-off cleanup scripts and fragile handoffs with a repeatable transformation contract that scales with source complexity.</p></div>}<Button href={product.id === 'transform' ? '#architecture-demo' : `#${product.id}`} variant={product.id === 'transform' ? 'primary' : 'ghost'} className="mt-8">{product.id === 'transform' ? 'Launch Ingestion Engine' : 'Explore module'} <ArrowRight size={15} /></Button></div>
      <ProductVisual id={product.id} />
    </div>
  </motion.section>;
}

function ProductVisual({ id }: { id: ProductId }) {
  if (id === 'transform') return <TransformVisual />;
  if (id === 'velocity') return <VelocityVisual />;
  if (id === 'qualityguard') return <QualityVisual />;
  if (id === 'ai-ready') return <AIReadyVisual />;
  return <FlowVisual />;
}

function TransformVisual() {
  return <GlassCard className="overflow-hidden p-5 sm:p-7"><VisualHeader label="SCHEMA TRANSFORM / PREVIEW" status="MAPPED" /><div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center"><CodePanel title="source.json" lines={['{', '  "cust_id": "00428",', '  "joined": "2026/08/13",', '  "spend": "1,240.50"', '}']} /><div className="mx-auto grid h-9 w-9 place-items-center rounded-full border border-brand-500/30 bg-brand-400/10 text-brand-300"><ArrowRight size={16} /></div><CodePanel title="customer.parquet" lines={['customer_id: int64', 'joined_at: timestamp', 'lifetime_value: decimal', 'quality: validated']} /></div><div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-5 font-mono text-[0.65rem] text-slate-500"><span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-brand-300" />4 fields mapped</span><span className="text-brand-300">strongly typed</span></div></GlassCard>;
}

function CodePanel({ title, lines }: { title: string; lines: string[] }) {
  return <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90"><div className="flex items-center gap-2 border-b border-slate-800 px-3 py-2 font-mono text-[0.62rem] text-slate-500"><FileCode2 size={13} className="text-brand-400" />{title}</div><pre className="overflow-x-auto p-4 font-mono text-[0.68rem] leading-6 text-brand-200"><code>{lines.join('\n')}</code></pre></div>;
}

function VelocityVisual() {
  return <GlassCard className="p-5 sm:p-7"><VisualHeader label="BENCHMARK / 100M ROWS" status="GPU READY" /><div className="mt-8 space-y-6"><BenchmarkRow label="CPU baseline" value="18m 42s" width="18%" muted /><BenchmarkRow label="Velocity / GPU" value="11.2s" width="96%" /><div className="flex items-center justify-between border-t border-slate-800 pt-5"><span className="flex items-center gap-2 font-mono text-xs text-slate-500"><Cpu size={15} className="text-brand-400" />cuDF + CUDA-X + Arrow</span><span className="font-mono text-lg font-semibold text-brand-300">100× <span className="text-xs font-normal text-slate-500">faster</span></span></div></div></GlassCard>;
}

function BenchmarkRow({ label, value, width, muted = false }: { label: string; value: string; width: string; muted?: boolean }) {
  return <div><div className="mb-2 flex justify-between font-mono text-xs"><span className="text-slate-400">{label}</span><span className={muted ? 'text-slate-500' : 'text-brand-300'}>{value}</span></div><div className="h-3 overflow-hidden rounded-full bg-slate-800"><motion.div initial={{ width: 0 }} whileInView={{ width }} viewport={{ once: true }} transition={{ duration: 0.9 }} className={`h-full rounded-full ${muted ? 'bg-slate-600' : 'bg-gradient-to-r from-brand-700 via-brand-500 to-brand-300'}`} /></div></div>;
}

function QualityVisual() {
  return <GlassCard className="p-5 sm:p-7"><VisualHeader label="QUALITYGUARD / LIVE SCORECARD" status="NO DRIFT" /><div className="mt-7 flex items-center gap-6"><div className="grid h-28 w-28 shrink-0 place-items-center rounded-full border-8 border-brand-400/20 bg-brand-400/10 text-center shadow-[0_0_25px_rgba(234,179,8,0.12)]"><div><p className="font-mono text-2xl font-semibold text-brand-300">99.8%</p><p className="font-mono text-[0.55rem] uppercase tracking-wider text-slate-500">confidence</p></div></div><div className="space-y-3"><StatusBadge>SCHEMA STABLE</StatusBadge><p className="text-sm leading-6 text-slate-400">All critical assertions are passing across the current production window.</p></div></div><div className="mt-7 space-y-2 border-t border-slate-800 pt-5">{['null_rate.customer_id < 0.1%', 'freshness.orders < 15 min', 'schema.orders — no drift'].map((log) => <div key={log} className="flex items-center gap-3 rounded-lg bg-slate-950/70 px-3 py-2.5 font-mono text-[0.65rem] text-slate-400"><CheckCircle2 size={14} className="shrink-0 text-brand-300" />{log}<span className="ml-auto text-brand-400">PASS</span></div>)}</div></GlassCard>;
}

function AIReadyVisual() {
  return <GlassCard className="p-5 sm:p-7"><VisualHeader label="AI-READY / CONTEXT FABRIC" status="PREPARED" /><div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"><PipelineNode icon={Database} label="Enterprise DBs" detail="tables · docs" /><div className="hidden h-px flex-1 bg-brand-500/50 sm:block" /><div className="mx-auto grid h-8 w-8 place-items-center rounded-full border border-brand-500/30 bg-brand-400/10 text-brand-300 sm:mx-0"><ArrowRight size={14} /></div><PipelineNode icon={Network} label="Context layer" detail="chunk · embed" /><div className="hidden h-px flex-1 bg-brand-500/50 sm:block" /><div className="mx-auto grid h-8 w-8 place-items-center rounded-full border border-brand-500/30 bg-brand-400/10 text-brand-300 sm:mx-0"><ArrowRight size={14} /></div><PipelineNode icon={Layers3} label="AI systems" detail="vectors · features" /></div><div className="mt-7 grid grid-cols-2 gap-3 border-t border-slate-800 pt-5"><MiniStat icon={Rows3} value="2.4M" label="chunks prepared" /><MiniStat icon={Sparkles} value="768d" label="embedding shape" /></div></GlassCard>;
}

function PipelineNode({ icon: Icon, label, detail }: { icon: typeof Database; label: string; detail: string }) {
  return <div className="flex-1 rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-center"><Icon size={19} className="mx-auto text-brand-300" /><p className="mt-2 text-xs font-semibold text-slate-200">{label}</p><p className="mt-1 font-mono text-[0.6rem] text-slate-500">{detail}</p></div>;
}

function FlowVisual() {
  return <GlassCard className="p-5 sm:p-7"><VisualHeader label="FLOW / PRODUCTION RUN 8F2A" status="RUNNING" /><div className="relative mt-8 grid grid-cols-[1fr_auto_1fr] items-center gap-3"><DAGNode label="extract" state="done" icon={Database} /><div className="h-px bg-brand-500/60" /><DAGNode label="transform" state="active" icon={Sparkles} /><div className="absolute left-1/2 top-1/2 hidden h-12 w-px -translate-x-1/2 translate-y-5 bg-brand-500/50 sm:block" /><div className="col-span-3 mx-auto h-8 w-px bg-brand-500/50" /><DAGNode label="quality_check" state="active" icon={ScanSearch} /><div className="h-px bg-brand-500/60" /><DAGNode label="publish" state="queued" icon={Server} /></div><div className="mt-8 grid grid-cols-2 gap-3 border-t border-slate-800 pt-5"><MiniStat icon={Gauge} value="4.8 GB/s" label="throughput" /><MiniStat icon={Activity} value="00:14:28" label="run time" /></div></GlassCard>;
}

function DAGNode({ label, state, icon: Icon }: { label: string; state: 'done' | 'active' | 'queued'; icon: typeof Database }) {
  const stateClass = state === 'active' ? 'border-brand-400/60 bg-brand-400/10' : state === 'done' ? 'border-brand-500/30 bg-brand-950/30' : 'border-slate-800 bg-slate-950/80';
  return <div className={`rounded-xl border p-3 text-center ${stateClass}`}><Icon size={18} className="mx-auto text-brand-300" /><p className="mt-2 truncate font-mono text-[0.62rem] text-slate-300">{label}</p><p className="mt-1 font-mono text-[0.55rem] uppercase tracking-wider text-slate-500">{state}</p></div>;
}

function MiniStat({ icon: Icon, value, label }: { icon: typeof Gauge; value: string; label: string }) {
  return <div className="rounded-lg bg-slate-950/70 p-3"><div className="flex items-center gap-2"><Icon size={14} className="text-brand-400" /><span className="font-mono text-sm font-semibold text-brand-300">{value}</span></div><p className="mt-1 font-mono text-[0.6rem] uppercase tracking-wider text-slate-500">{label}</p></div>;
}

function VisualHeader({ label, status }: { label: string; status: string }) {
  return <div className="flex items-center justify-between border-b border-slate-800/80 pb-4"><p className="font-mono text-[0.65rem] tracking-[0.16em] text-slate-500">{label}</p><StatusBadge>{status}</StatusBadge></div>;
}
