'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  Database,
  FileCode2,
  Layers3,
  Network,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EditorialButton } from '@/components/ui/EditorialButton';
import { GlassCard } from '@/components/ui/GlassCard';
import { Reveal } from '@/components/home/Reveal';

type Stage = { label: string; title: string; description: string; icon: LucideIcon };
type ProductId = 'transform' | 'velocity' | 'qualityguard' | 'ai-ready' | 'flow-ops';
type Product = {
  id: ProductId;
  name: string;
  descriptor: string;
  headline: string;
  description: string;
  capabilities: string[];
  note: string;
  icon: LucideIcon;
};

const stages: Stage[] = [
  { label: 'Connect', title: 'Bring fragmented sources together.', description: 'Create one clearer starting point for the information already spread across your organization.', icon: Network },
  { label: 'Shape', title: 'Organize information into usable data.', description: 'Turn inconsistent inputs into structures that teams can understand, reuse, and build on.', icon: Layers3 },
  { label: 'Trust', title: 'Validate quality and consistency.', description: 'Give every workflow a stronger sense of what is ready, what changed, and what needs attention.', icon: ShieldCheck },
  { label: 'Activate', title: 'Prepare data for what comes next.', description: 'Move trusted information into AI, analytics, and the decisions that matter to the business.', icon: Sparkles },
];

const products: Product[] = [
  {
    id: 'transform', name: 'DataSculpt Transform™', descriptor: 'Make every source easier to use.', headline: 'Turn scattered information into a dependable starting point.',
    description: 'Transform helps teams make sense of inconsistent files, systems, and records so every downstream workflow begins with clearer structure.',
    capabilities: ['Map inconsistent fields into reusable structures', 'Create repeatable preparation workflows', 'Deliver clean data for analytics and intelligent applications'],
    note: 'Built around schema preparation, lineage-ready outputs, and Parquet-compatible delivery.', icon: Database,
  },
  {
    id: 'velocity', name: 'DataSculpt Velocity™', descriptor: 'Move important work forward faster.', headline: 'Spend less time waiting for data to become useful.',
    description: 'Velocity reduces the preparation burden around large workloads, helping engineering teams move from source complexity to usable results with less delay.',
    capabilities: ['Accelerate transformation-heavy workloads', 'Reduce repeated movement between processing stages', 'Support wider and more demanding data workflows'],
    note: 'Technical foundation includes NVIDIA cuDF, CUDA-X, and Apache Arrow patterns.', icon: Zap,
  },
  {
    id: 'qualityguard', name: 'DataSculpt QualityGuard™', descriptor: 'Know when your data is ready to trust.', headline: 'Make confidence part of every handoff.',
    description: 'QualityGuard gives teams early visibility into quality, freshness, and consistency issues before they become reporting or AI problems.',
    capabilities: ['Monitor changes in structure and completeness', 'Define checks for freshness and validity', 'Give owners useful context when something needs attention'],
    note: 'Designed for continuous assertions, drift awareness, and actionable anomaly context.', icon: ShieldCheck,
  },
  {
    id: 'ai-ready', name: 'DataSculpt AI-Ready™', descriptor: 'Give enterprise AI better information to work with.', headline: 'Prepare knowledge, signals, and context for intelligent systems.',
    description: 'AI-Ready organizes enterprise information for search, knowledge assistants, forecasting, and other workflows that depend on useful context.',
    capabilities: ['Prepare documents and records for retrieval', 'Preserve source context through preparation', 'Create feature-ready datasets for ML workflows'],
    note: 'Supports RAG-oriented chunking, embedding preparation, and feature dataset patterns.', icon: Sparkles,
  },
  {
    id: 'flow-ops', name: 'DataSculpt Flow (Ops)™', descriptor: 'Keep every important data workflow moving.', headline: 'Give teams a clearer view of the work in motion.',
    description: 'Flow helps teams coordinate dependencies, understand execution state, and respond to issues without losing sight of the bigger workflow.',
    capabilities: ['Organize repeatable workflow stages', 'Create shared visibility across teams', 'Keep ownership and next actions clear'],
    note: 'An operating surface for orchestration, workflow context, and observability concepts.', icon: Workflow,
  },
];

const useCases = [
  { title: 'Prepare data for enterprise AI', description: 'Create more useful context for search, assistants, forecasting, and experimentation.', product: 'DataSculpt AI-Ready™', target: 'ai-ready', icon: Sparkles },
  { title: 'Improve reporting confidence', description: 'Give analysts and decision-makers a stronger foundation for important numbers.', product: 'DataSculpt QualityGuard™', target: 'qualityguard', icon: ShieldCheck },
  { title: 'Reduce manual data preparation', description: 'Replace repeated cleanup work with clearer, reusable ways to shape information.', product: 'DataSculpt Transform™', target: 'transform', icon: Layers3 },
  { title: 'Modernize data workflows', description: 'Bring structure and visibility to the work that keeps your data moving.', product: 'DataSculpt Flow (Ops)™', target: 'flow-ops', icon: Workflow },
];

const technicalTopics = [
  ['Transformation and schema preparation', 'Use repeatable mapping, typed structures, Parquet-compatible outputs, and lineage-ready preparation patterns.'],
  ['Compute acceleration', 'Explore NVIDIA cuDF, CUDA-X, and Apache Arrow concepts for workloads that need more processing headroom.'],
  ['Quality and governance', 'Define assertions around schema, freshness, completeness, and validity so issues become visible earlier.'],
  ['AI-ready preparation', 'Prepare retrieval context, embedding inputs, and feature datasets using documented AI generation concepts.'],
  ['Workflow visibility', 'Organize stages, dependencies, ownership, and execution context around the workflows your teams operate.'],
] as const;

export default function ProductsPage() {
  const reducedMotion = useReducedMotion();
  const [selectedStage, setSelectedStage] = useState(0);
  const [hoveredStage, setHoveredStage] = useState<number | null>(null);
  const [selectedUseCase, setSelectedUseCase] = useState(0);
  const [openTechnical, setOpenTechnical] = useState<number | null>(null);
  const visibleStage = hoveredStage ?? selectedStage;
  const activeUseCase = useCases[selectedUseCase];

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 sm:pt-12 lg:px-8">
      <Reveal>
        <header className="grid items-end gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-brand-600"><span>Home</span><ChevronRight size={14} /><span className="text-brand-600">Products</span></Link>
            <p className="eyebrow mt-10">THE DATASCULPT PLATFORM</p>
            <h1 className="mt-4 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.06em] text-slate-900 sm:text-6xl lg:text-7xl">Turn fragmented data into a foundation for what comes next.</h1>
          </div>
          <div className="lg:pb-2">
            <p className="max-w-xl text-lg leading-8 text-slate-600">DataSculpt helps teams create trusted, usable information for better decisions, stronger workflows, and enterprise AI that can work with real business context.</p>
            <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center"><EditorialButton href="/contact/" icon={<Workflow size={17} />}>See your workflow</EditorialButton><Link href="#product-journey" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Explore the five capabilities <ArrowDownRight size={16} /></Link></div>
          </div>
        </header>
      </Reveal>

      <Reveal delay={0.08}><div className="relative mt-14 h-[360px] overflow-hidden rounded-[2rem] border border-brand-100 bg-brand-100/70 sm:h-[440px] lg:h-[500px]" aria-hidden="true"><div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,253,242,0.98),rgba(249,223,112,0.32),rgba(183,121,0,0.36))]" /><div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-45" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=80')" }} /><div className="absolute -bottom-24 left-[12%] h-72 w-72 rounded-full bg-brand-300/40 blur-3xl" /><div className="absolute right-[10%] top-[16%] h-48 w-48 rounded-full border border-white/60" /><div className="absolute right-[14%] top-[24%] h-32 w-32 rounded-full border border-brand-500/35" /><div className="absolute bottom-8 left-7 rounded-2xl border border-white/80 bg-white/80 px-5 py-4 text-sm font-semibold text-slate-800 shadow-panel backdrop-blur-md sm:left-10"><span className="block text-[0.65rem] uppercase tracking-[0.18em] text-brand-600">One platform, many starting points</span><span className="mt-1 block text-lg">Make information easier to move forward.</span></div></div></Reveal>

      <Reveal><section id="product-journey" className="scroll-mt-24 pt-28"><div className="max-w-2xl"><p className="eyebrow">HOW THE PLATFORM FITS TOGETHER</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl">A clearer way from scattered information to useful intelligence.</h2></div><div className="relative mt-12"><div className="absolute left-[8%] right-[8%] top-9 hidden h-px bg-brand-200 lg:block" /><motion.div animate={{ width: `${(visibleStage / (stages.length - 1)) * 84 + 8}%` }} transition={{ duration: reducedMotion ? 0 : 0.45 }} className="absolute left-[8%] top-9 hidden h-0.5 bg-brand-500 lg:block" /><div className="grid gap-4 lg:grid-cols-4">{stages.map((stage, index) => { const Icon = stage.icon; const active = visibleStage === index; return <motion.button key={stage.label} type="button" aria-pressed={selectedStage === index} onClick={() => setSelectedStage(index)} onMouseEnter={() => setHoveredStage(index)} onMouseLeave={() => setHoveredStage(null)} onFocus={() => setHoveredStage(index)} onBlur={() => setHoveredStage(null)} whileHover={reducedMotion ? undefined : { y: -4 }} whileTap={reducedMotion ? undefined : { scale: 0.99 }} className={`relative z-10 rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4 focus-visible:ring-offset-[#f5f5f1] ${active ? 'border-brand-400 bg-white shadow-panel' : 'border-brand-100 bg-white/45 hover:border-brand-300'}`}><span className={`grid h-9 w-9 place-items-center rounded-full border transition ${active ? 'border-brand-500 bg-brand-500 text-white' : 'border-brand-200 bg-brand-50 text-brand-500'}`}><Icon size={17} /></span><p className="mt-5 text-lg font-semibold text-slate-900">{stage.label}</p><p className="mt-2 text-sm leading-6 text-slate-600">{active ? stage.description : stage.title}</p>{active && <p className="mt-4 text-sm font-semibold text-brand-700">{stage.title}</p>}</motion.button>; })}</div></div></section></Reveal>

      <section className="space-y-24 pt-28">{products.map((product, index) => <ProductChapter key={product.id} product={product} index={index} reducedMotion={reducedMotion} />)}</section>

      <Reveal><section className="pt-32"><div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start"><div><p className="eyebrow">START WITH THE OUTCOME</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl">Start with the outcome you need next.</h2><p className="mt-5 max-w-md leading-7 text-slate-600">Different teams begin in different places. Choose the priority closest to your work and see where DataSculpt can help you start.</p><EditorialButton href="/contact/" icon={<ArrowRight size={17} />} className="mt-7">Explore your use case</EditorialButton></div><div className="grid gap-3 sm:grid-cols-2">{useCases.map((useCase, index) => { const Icon = useCase.icon; const active = selectedUseCase === index; return <button key={useCase.title} type="button" aria-pressed={active} onClick={() => setSelectedUseCase(index)} className={`rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${active ? 'border-brand-400 bg-white shadow-panel' : 'border-brand-100 bg-white/50 hover:border-brand-300'}`}><Icon size={20} className={active ? 'text-brand-600' : 'text-brand-400'} /><p className="mt-5 font-semibold text-slate-900">{useCase.title}</p><p className="mt-2 text-sm leading-6 text-slate-600">{useCase.description}</p></button>; })}<div className="sm:col-span-2 rounded-2xl border border-brand-300/60 bg-brand-100/55 p-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-700">RECOMMENDED STARTING POINT</p><div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="font-semibold text-slate-900">{activeUseCase.product}</p><p className="mt-1 text-sm text-slate-600">A practical first step for {activeUseCase.title.toLowerCase()}.</p></div><Link href={`#${activeUseCase.target}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:text-brand-500">View capability <ArrowRight size={15} /></Link></div></div></div></div></section></Reveal>

      <Reveal><section className="pt-32"><div className="mx-auto max-w-3xl text-center"><p className="eyebrow">FOR THE TEAMS WHO WANT TO GO DEEPER</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl">Built for the teams who want to go deeper.</h2><p className="mt-5 leading-7 text-slate-600">Explore the technical concepts behind the customer experience when you are ready for more detail.</p></div><div className="mx-auto mt-10 max-w-4xl divide-y divide-brand-100 rounded-2xl border border-brand-100 bg-white/60">{technicalTopics.map(([title, body], index) => { const open = openTechnical === index; return <div key={title}><button type="button" aria-expanded={open} onClick={() => setOpenTechnical(open ? null : index)} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-semibold text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 sm:px-7"><span>{title}</span><ChevronDown size={18} className={`shrink-0 text-brand-600 transition-transform ${open ? 'rotate-180' : ''}`} /></button><AnimatePresence initial={false}>{open && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.22 }} className="overflow-hidden"><p className="px-5 pb-6 text-sm leading-7 text-slate-600 sm:px-7">{body}</p></motion.div>}</AnimatePresence></div>; })}</div></section></Reveal>

      <Reveal><section className="mt-32 grid gap-8 overflow-hidden rounded-[2rem] border border-brand-300/60 bg-white shadow-panel lg:grid-cols-[0.95fr_1.05fr]"><div className="p-8 sm:p-12 lg:p-16"><p className="eyebrow">A CLEARER NEXT STEP</p><h2 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-900 sm:text-5xl">Find the clearest path for your data workflow.</h2><p className="mt-5 max-w-xl leading-7 text-slate-600">Bring us the workflow you want to improve, and we will help you find the most useful place to begin.</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><EditorialButton href="/contact/" icon={<Workflow size={17} />}>See your workflow</EditorialButton><Button href="#product-journey" variant="ghost">Explore the platform <ArrowRight size={15} /></Button></div></div><div className="relative min-h-[300px] bg-cover bg-center" aria-hidden="true" style={{ backgroundImage: "linear-gradient(135deg, rgba(249,223,112,.72), rgba(255,253,242,.12)), url('https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80')" }}><div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/70 bg-white/80 p-5 text-sm font-semibold text-slate-800 backdrop-blur-md">Trusted data. Better decisions. Stronger AI foundations.</div></div></section></Reveal>
    </div>
  );
}

function ProductChapter({ product, index, reducedMotion }: { product: Product; index: number; reducedMotion: boolean | null }) {
  const Icon = product.icon;
  const reverse = index % 2 === 1;
  return <Reveal><section id={product.id} className="scroll-mt-24"><div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${reverse ? 'lg:[&>div:first-child]:order-2' : ''}`}><div><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl border border-brand-200 bg-brand-50 text-brand-600"><Icon size={21} /></span><p className="eyebrow">0{index + 1} / 05 · {product.name}</p></div><p className="mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-brand-600">{product.descriptor}</p><h2 className="mt-3 text-4xl font-semibold leading-tight tracking-[-0.04em] text-slate-900 sm:text-5xl">{product.headline}</h2><p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">{product.description}</p><ul className="mt-7 space-y-3">{product.capabilities.map((capability) => <li key={capability} className="flex gap-3 text-sm leading-6 text-slate-700"><Check size={18} className="mt-0.5 shrink-0 text-brand-600" />{capability}</li>)}</ul><p className="mt-7 max-w-lg border-l-2 border-brand-400 pl-4 text-sm leading-6 text-slate-500">{product.note}</p><Link href="/contact/" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Explore this capability <ArrowRight size={15} /></Link></div><ProductChapterVisual product={product} reducedMotion={reducedMotion} /></div></section></Reveal>;
}

function ProductChapterVisual({ product, reducedMotion }: { product: Product; reducedMotion: boolean | null }) {
  const Icon = product.icon;
  return <motion.div initial={{ opacity: 0, x: reducedMotion ? 0 : 22 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: reducedMotion ? 0 : 0.55 }} className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-brand-100 bg-brand-50 p-6 sm:min-h-[430px] sm:p-9"><div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl" /><div className="relative flex h-full min-h-[310px] flex-col justify-between"><div className="flex items-center justify-between"><span className="rounded-full bg-white/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">DataSculpt / {product.name.replace('DataSculpt ', '').replace('™', '')}</span><Icon size={22} className="text-brand-600" /></div><VisualContent id={product.id} /><div className="flex items-center gap-2 text-sm font-semibold text-brand-700"><CircleCheck size={17} />Ready for the next step</div></div></motion.div>;
}

function VisualContent({ id }: { id: ProductId }) {
  if (id === 'transform') return <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center"><MiniVisual title="Scattered" lines={['customer_id', 'joined date', 'order value']} /><ArrowRight className="mx-auto text-brand-500" /><MiniVisual title="Usable" lines={['customer_id', 'joined_at', 'lifetime_value']} /></div>;
  if (id === 'velocity') return <div className="space-y-7"><p className="max-w-sm text-3xl font-semibold tracking-tight text-slate-900">Less waiting between the question and the answer.</p><div className="space-y-4"><FlowBar label="Before" width="42%" /><FlowBar label="With Velocity" width="88%" /></div></div>;
  if (id === 'qualityguard') return <div className="grid place-items-center"><div className="grid h-48 w-48 place-items-center rounded-full border-[14px] border-brand-200 bg-white shadow-panel"><div className="text-center"><p className="text-4xl font-semibold text-slate-900">Ready</p><p className="mt-2 text-xs uppercase tracking-[0.15em] text-brand-600">quality checked</p></div></div><div className="mt-6 grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600"><span className="rounded-full bg-white px-3 py-2">Fresh</span><span className="rounded-full bg-white px-3 py-2">Complete</span><span className="rounded-full bg-white px-3 py-2">Consistent</span></div></div>;
  if (id === 'ai-ready') return <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"><VisualNode icon={Database} label="Knowledge" /><ArrowRight className="rotate-90 text-brand-500 sm:rotate-0" /><VisualNode icon={Sparkles} label="Signals" /><ArrowRight className="rotate-90 text-brand-500 sm:rotate-0" /><VisualNode icon={Layers3} label="Decisions" /></div>;
  return <div className="grid gap-3 sm:grid-cols-3"><VisualNode icon={Database} label="Prepare" /><VisualNode icon={Workflow} label="Coordinate" /><VisualNode icon={ScanSearch} label="Respond" /></div>;
}

function MiniVisual({ title, lines }: { title: string; lines: string[] }) { return <div className="rounded-2xl border border-brand-100 bg-white/85 p-4 shadow-sm"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-600">{title}</p><div className="mt-4 space-y-2 font-mono text-xs text-slate-600">{lines.map((line) => <p key={line} className="rounded-lg bg-brand-50 px-3 py-2">{line}</p>)}</div></div>; }
function FlowBar({ label, width }: { label: string; width: string }) { return <div><div className="mb-2 flex justify-between text-sm font-semibold text-slate-700"><span>{label}</span><span className="text-brand-600">moving forward</span></div><div className="h-3 overflow-hidden rounded-full bg-white"><motion.div initial={{ width: 0 }} whileInView={{ width }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="h-full rounded-full bg-brand-500" /></div></div>; }
function VisualNode({ icon: Icon, label }: { icon: LucideIcon; label: string }) { return <div className="grid min-w-28 place-items-center rounded-2xl border border-brand-100 bg-white/85 px-4 py-5 text-center shadow-sm"><Icon size={22} className="text-brand-600" /><span className="mt-3 text-sm font-semibold text-slate-800">{label}</span></div>; }
