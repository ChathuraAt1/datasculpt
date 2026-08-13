import Link from 'next/link';
import { ArrowUpRight, Command, Menu } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const links = [
  { label: 'Products', href: '/products/' },
  { label: 'Architecture', href: '#architecture' },
  { label: 'Operations', href: '#operations' },
  { label: 'Documentation', href: '#documentation' },
  { label: 'Pricing', href: '#pricing' },
];

export function Navbar() {
  return <header className="relative z-20 border-b border-slate-800/70 bg-slate-950/70 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
      <Link href="/" className="group flex items-center gap-2.5" aria-label="DataSculpt home">
        <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-brand-400/50 bg-brand-400/10 text-brand-300 shadow-brand">
          <Command size={19} strokeWidth={2.5} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-brand-300" />
        </span>
        <span className="text-lg font-bold tracking-tight text-white">DataSculpt<span className="ml-1.5 rounded bg-brand-400/10 px-1.5 py-0.5 font-mono text-[0.58rem] font-semibold tracking-wider text-brand-300">.lk</span></span>
      </Link>
      <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
        {links.map((link) => <Link key={link.label} href={link.href} className="text-sm text-slate-400 transition hover:text-brand-300">{link.label}</Link>)}
      </nav>
      <div className="hidden items-center gap-3 md:flex">
        <span className="inline-flex items-center gap-2 font-mono text-[0.62rem] font-semibold tracking-wider text-brand-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-300 shadow-[0_0_10px_#fde047]" />SYSTEM ONLINE</span>
        <Button href="/products/" variant="secondary" className="px-3.5 py-2 text-xs">Launch Ops Center <ArrowUpRight size={14} /></Button>
      </div>
      <button className="rounded-md border border-slate-800 p-2 text-slate-300 md:hidden" aria-label="Open navigation menu"><Menu size={20} /></button>
    </div>
  </header>;
}
