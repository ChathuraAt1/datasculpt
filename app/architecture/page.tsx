'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown,
  ArrowRight,
  Box,
  Check,
  ChevronRight,
  Cloud,
  Cpu,
  Database,
  Gauge,
  HardDrive,
  Layers3,
  LockKeyhole,
  Network,
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

type LayerId = 'ingestion' | 'velocity' | 'quality' | 'delivery';

type ArchitectureLayer = {
  id: LayerId;
  number: string;
  name: string;
  descriptor: string;
  description: string;
  icon: typeof Database;
  components: string[];
  latency: string;
  throughput: string;
  memory: string;
};

const layers: ArchitectureLayer[] = [
  {
    id: 'ingestion',
    number: '01',
    name: 'Multi-Source Ingestion Layer',
    descriptor: 'Connect everything. Normalize nothing prematurely.',
    description: 'A resilient entry layer for streaming, warehouse, lake, database, and edge inputs. Data arrives with source context intact so downstream contracts can shape it deliberately.',
    icon: Database,
    components: ['Kafka', 'AWS S3', 'Apache Iceberg', 'Delta Lake', 'Snowflake', 'Postgres', 'IoT edge feeds'],
    latency: '18 ms',
    throughput: '12.4 GB/s',
    memory: '22%',
  },
  {
    id: 'velocity',
    number: '02',
    name: 'DataSculpt Velocity Acceleration Core',
    descriptor: 'Keep compute close to the data.',
    description: 'A hardware-aware processing core built around GPU dataframe operations, CUDA-X primitives, and zero-copy memory movement for transformation-heavy workloads.',
    icon: Cpu,
    components: ['NVIDIA CUDA-X', 'cuDF', 'cuML', 'Triton Inference Server', 'Apache Arrow zero-copy memory'],
    latency: '11.2 ms',
    throughput: '42.8 GB/s',
    memory: '64%',
  },
  {
    id: 'quality',
    number: '03',
    name: 'Data Quality & Governance Engine',
    descriptor: 'Make trust observable at every boundary.',
    description: 'QualityGuard™ continuously observes data shape and behavior, isolating anomalies and surfacing schema drift before it becomes an incident downstream.',
    icon: ShieldCheck,
    components: ['Schema drift monitoring', 'Assertion rules engine', 'Anomaly isolation', 'Lineage-ready checks', 'Policy gates'],
    latency: '7.6 ms',
    throughput: '38.1 GB/s',
    memory: '41%',
  },
  {
    id: 'delivery',
    number: '04',
    name: 'AI & Enterprise Analytics Delivery Layer',
    descriptor: 'Deliver context wherever decisions happen.',
    description: 'A governed output layer for retrieval systems, feature stores, machine learning models, and BI surfaces, with the quality context carried through each handoff.',
    icon: Network,
    components: ['Vector DBs: Pinecone, Milvus', 'Feature stores', 'PyTorch models', 'BI dashboards', 'Enterprise APIs'],
    latency: '24 ms',
    throughput: '28.6 GB/s',
    memory: '36%',
  },
];

type TechnicalCard = { title: string; description: string; icon: typeof Database; metric: string; label: string };

const technicalCards: TechnicalCard[] = [
  { title: 'Zero-Copy Apache Arrow In-Memory Engine', description: 'Eliminates serialization overhead between CPU, RAM, and GPU VRAM so each stage can work from the same high-performance memory representation.', icon: Layers3, metric: '0-copy', label: 'memory handoffs' },
  { title: 'CUDA Tensor Core Offloading', description: 'Executes heavy SQL joins, aggregations, and window functions directly on GPU hardware when the workload benefits from parallel acceleration.', icon: Zap, metric: '100×', label: 'acceleration path' },
  { title: 'Out-of-Core Memory Streaming', description: 'Intelligently spills oversized datasets across NVMe storage, keeping pipelines resilient when working sets exceed available memory.', icon: HardDrive, metric: 'NVMe', label: 'spill safety net' },
];

const deploymentCards = [
  { title: 'Single-Tenant Isolated VPC', description: 'Deploy DataSculpt inside a dedicated cloud boundary with private networking, controlled ingress, and infrastructure ownership aligned to enterprise policy.', icon: Cloud, tags: ['AWS', 'GCP', 'Azure'] },
  { title: 'On-Premise GPU Cluster Integration', description: 'Connect to NVIDIA DGX systems or bare-metal GPU clusters when data locality, dedicated compute, or regulated environments require an on-premise operating model.', icon: Server, tags: ['NVIDIA DGX', 'Bare metal', 'Private network'] },
  { title: 'Security & Compliance Controls', description: 'Design for encryption in transit and at rest, SOC 2 Type II control environments, and HIPAA readiness workflows.', icon: LockKeyhole, tags: ['AES-256', 'SOC 2 Type II', 'HIPAA ready'] },
];

export default function ArchitecturePage() {
  const [selectedLayer, setSelectedLayer] = useState<LayerId>('ingestion');
  const [previewLayer, setPreviewLayer] = useState<LayerId | null>(null);
  const activeLayer = layers.find((layer) => layer.id === (previewLayer ?? selectedLayer)) ?? layers[0];

  return <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-10 lg:px-8 lg:pt-14">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mx-auto max-w-4xl text-center">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-brand-300"><span>Home</span><ChevronRight size={14} /><span className="text-brand-300">System Architecture</span></Link>
      <div className="mt-8"><span className="inline-flex rounded-full border border-brand-500/30 bg-brand-950/40 px-3.5 py-1.5 font-mono text-xs tracking-[0.16em] text-brand-400">ENTERPRISE DATA ENGINE TOPOLOGY</span></div>
      <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">Built for Petabyte Scale. <span className="bg-gradient-to-r from-brand-200 via-brand-400 to-brand-300 bg-clip-text text-transparent">Zero Bottlenecks.</span></h1>
      <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-400 sm:text-lg">Explore DataSculpt&apos;s 4-layer hardware-accelerated architecture—from streaming ingestion and zero-copy Apache Arrow memory to CUDA GPU compute cores and vector DB outputs.</p>
    </motion.div>

    <section className="mt-16 scroll-mt-28" aria-labelledby="topology-heading">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="eyebrow">INTERACTIVE TOPOLOGY / REFERENCE MODEL</p><h2 id="topology-heading" className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">One system. Four deliberate layers.</h2></div><p className="max-w-sm text-sm leading-6 text-slate-500">Select or hover a layer to inspect its illustrative operating profile.</p></div>
      <div className="grid items-start gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
        <div className="space-y-3" onMouseLeave={() => setPreviewLayer(null)}>{layers.map((layer, index) => <LayerButton key={layer.id} layer={layer} index={index} active={activeLayer.id === layer.id} selected={selectedLayer === layer.id} onPreview={setPreviewLayer} onSelect={setSelectedLayer} />)}</div>
        <SpecPanel layer={activeLayer} />
      </div>
    </section>

    <section className="mt-24 scroll-mt-28 lg:mt-32" aria-labelledby="acceleration-heading"><SectionHeading eyebrow="HARDWARE ACCELERATION / CORE INNOVATIONS" title="Deep-tech primitives that remove the waiting." id="acceleration-heading" /><div className="mt-8 grid gap-5 md:grid-cols-3">{technicalCards.map((card, index) => <TechnicalCard key={card.title} card={card} index={index} />)}</div></section>

    <section className="mt-24 scroll-mt-28 lg:mt-32" aria-labelledby="deployment-heading"><SectionHeading eyebrow="DEPLOYMENT / SECURITY / COMPLIANCE" title="Designed around your operating boundary." id="deployment-heading" /><div className="mt-8 grid gap-5 lg:grid-cols-3">{deploymentCards.map((card, index) => <DeploymentCard key={card.title} card={card} index={index} />)}</div></section>

    <motion.section id="architecture-demo" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} className="mt-24 scroll-mt-28 rounded-2xl border border-brand-500/30 bg-gradient-to-r from-slate-900 via-brand-950/20 to-slate-900 p-7 text-center shadow-[0_0_30px_rgba(234,179,8,0.08)] sm:p-10 lg:mt-32"><p className="eyebrow">ARCHITECTURE REVIEW</p><h2 className="mx-auto mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">Need Custom Architecture Deployment?</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400">Bring your data boundary, workload shape, and compliance requirements. Map them to an acceleration path designed for your environment.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button href="#architecture-demo">Speak with a Data Architect <ArrowRight size={16} /></Button><Button href="#whitepaper" variant="ghost">Download Whitepaper <HardDrive size={15} /></Button></div><div id="whitepaper" className="mx-auto mt-8 flex max-w-2xl scroll-mt-28 items-center justify-center gap-2 border-t border-slate-800/80 pt-5 text-xs text-slate-500"><Box size={14} className="text-brand-400" /><span>Whitepaper reference placeholder — technical materials will be published here.</span></div></motion.section>
  </div>;
}

function LayerButton({ layer, index, active, selected, onPreview, onSelect }: { layer: ArchitectureLayer; index: number; active: boolean; selected: boolean; onPreview: (id: LayerId | null) => void; onSelect: (id: LayerId) => void }) {
  const Icon = layer.icon;
  return <motion.button type="button" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08, duration: 0.35 }} onMouseEnter={() => onPreview(layer.id)} onFocus={() => onPreview(layer.id)} onBlur={() => onPreview(null)} onClick={() => { onSelect(layer.id); onPreview(null); }} aria-pressed={selected} className={`group relative flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:p-5 ${active ? 'border-brand-400/70 bg-brand-400 text-slate-950 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-brand-500/50 hover:text-brand-200'}`}><span className={`font-mono text-xs ${active ? 'text-brand-800' : 'text-slate-600'}`}>{layer.number}</span><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${active ? 'bg-slate-950/10 text-slate-950' : 'bg-slate-950/80 text-brand-300'}`}><Icon size={19} /></span><span className="min-w-0"><span className="block text-sm font-semibold sm:text-base">{layer.name}</span><span className={`mt-1 block truncate font-mono text-[0.62rem] ${active ? 'text-slate-800' : 'text-slate-500'}`}>{layer.descriptor}</span></span><span className="ml-auto"><ArrowRight size={17} className={active ? 'text-slate-950' : 'text-slate-600 transition group-hover:text-brand-300'} /></span></motion.button>;
}

function SpecPanel({ layer }: { layer: ArchitectureLayer }) {
  const Icon = layer.icon;
  return <motion.div key={layer.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}><GlassCard className="min-h-[390px] overflow-hidden p-5 sm:p-7"><div className="flex items-start justify-between gap-4 border-b border-slate-800/80 pb-5"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg border border-brand-500/30 bg-brand-400/10 text-brand-300"><Icon size={18} /></span><div><p className="eyebrow">LAYER {layer.number} / ACTIVE PROFILE</p><h3 className="mt-1 text-lg font-semibold text-white">{layer.name}</h3></div></div><StatusBadge>ACTIVE</StatusBadge></div><p className="mt-6 text-sm leading-7 text-slate-400">{layer.description}</p><div className="mt-6 flex flex-wrap gap-2">{layer.components.map((component) => <span key={component} className="rounded-md border border-slate-800 bg-slate-950/70 px-2.5 py-1.5 font-mono text-[0.62rem] text-slate-400">{component}</span>)}</div><div className="mt-7 grid grid-cols-3 gap-2 border-t border-slate-800/80 pt-5"><SpecMetric label="LATENCY" value={layer.latency} /><SpecMetric label="THROUGHPUT" value={layer.throughput} /><SpecMetric label="MEMORY" value={layer.memory} /></div></GlassCard></motion.div>;
}

function SpecMetric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-slate-950/80 p-3"><p className="font-mono text-[0.58rem] tracking-[0.14em] text-slate-600">{label}</p><p className="mt-2 font-mono text-base font-semibold text-brand-300 sm:text-lg">{value}</p></div>;
}

function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return <div><p className="eyebrow">{eyebrow}</p><h2 id={id} className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2></div>;
}

function TechnicalCard({ card, index }: { card: TechnicalCard; index: number }) {
  const Icon = card.icon;
  return <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08 }}><GlassCard className="h-full p-6 transition duration-200 hover:border-brand-500/50"><div className="flex items-start justify-between"><span className="grid h-11 w-11 place-items-center rounded-xl border border-brand-500/30 bg-brand-400/10 text-brand-300"><Icon size={20} /></span><span className="font-mono text-right"><span className="block text-lg font-semibold text-brand-300">{card.metric}</span><span className="text-[0.58rem] uppercase tracking-wider text-slate-600">{card.label}</span></span></div><h3 className="mt-6 text-lg font-semibold leading-6 text-white">{card.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{card.description}</p><div className="mt-6 flex items-center gap-2 border-t border-slate-800 pt-4 font-mono text-[0.62rem] uppercase tracking-wider text-brand-400"><Check size={14} />Architecture primitive</div></GlassCard></motion.div>;
}

function DeploymentCard({ card, index }: { card: typeof deploymentCards[number]; index: number }) {
  const Icon = card.icon;
  return <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08 }}><GlassCard className="h-full p-6 transition duration-200 hover:border-brand-500/50"><span className="grid h-11 w-11 place-items-center rounded-xl border border-brand-500/30 bg-brand-400/10 text-brand-300"><Icon size={20} /></span><h3 className="mt-6 text-lg font-semibold text-white">{card.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{card.description}</p><div className="mt-6 flex flex-wrap gap-2">{card.tags.map((tag) => <span key={tag} className="rounded-md border border-brand-500/20 bg-brand-950/30 px-2.5 py-1.5 font-mono text-[0.6rem] text-brand-300">{tag}</span>)}</div></GlassCard></motion.div>;
}
