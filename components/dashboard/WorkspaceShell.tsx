'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CreditCard, LayoutDashboard, LogOut, Menu, Settings, Sparkles, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { useWorkspace } from '@/components/dashboard/WorkspaceContext';
import { productModules } from '@/lib/workspace';

const fixedLinks = [
  { label: 'Overview', href: '/dashboard/', icon: LayoutDashboard },
  ...productModules.map((module) => ({ label: module.shortName, href: module.href, icon: module.icon })),
  { label: 'Billing', href: '/dashboard/billing/', icon: CreditCard },
  { label: 'Account', href: '/account/', icon: Settings },
];

function activePath(pathname: string, href: string) {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return href === '/dashboard/' ? path === href : path.startsWith(href);
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const { plan, loading: planLoading } = useWorkspace();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (authLoading || isAuthenticated) return;
    const next = `${window.location.pathname}${window.location.search}`;
    window.location.replace(`/auth/login/?next=${encodeURIComponent(next)}`);
  }, [authLoading, isAuthenticated]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);

  const pageLabel = useMemo(() => fixedLinks.find((link) => activePath(pathname, link.href))?.label || 'Workspace', [pathname]);

  if (authLoading || !isAuthenticated || !user) {
    return <main className="grid min-h-screen place-items-center bg-[#f5f4ed]"><div className="flex items-center gap-3 text-sm font-medium text-[#615b4d]"><span className="h-2 w-2 animate-pulse rounded-full bg-brand-400" />Preparing your secure workspace…</div></main>;
  }

  const name = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || 'DataSculpt user';

  return <div className="min-h-screen bg-[#f5f4ed] text-[#273142]">
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 border-r border-[#3c382d] bg-[#171611] lg:flex lg:flex-col">
      <SidebarContent name={name} planName={planLoading ? 'Loading plan…' : plan?.name || 'Starter'} pathname={pathname} activeLayoutId="workspace-active-desktop" reducedMotion={Boolean(reducedMotion)} onSignOut={() => void logout().then(() => window.location.replace('/auth/login/'))} />
    </aside>

    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#ded8c8] bg-[#faf9f3]/95 px-4 backdrop-blur-xl lg:ml-72 lg:px-8">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open workspace navigation" aria-expanded={mobileOpen} aria-controls="workspace-mobile-navigation" className="grid h-10 w-10 place-items-center rounded-xl border border-[#ded8c8] bg-white text-[#4c4639] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 lg:hidden"><Menu size={19} /></button>
        <Link href="/dashboard/" className="flex items-center gap-2 lg:hidden" aria-label="DataSculpt workspace home">
          <Image
            src="/images/datasculpt_logo.webp"
            alt="DataSculpt"
            width={110}
            height={33}
            className="h-6 w-auto object-contain"
          />
          <span className="rounded bg-brand-400/15 px-1.5 py-0.5 font-mono text-[0.55rem] font-semibold text-brand-700">
            .lk
          </span>
        </Link>
        <div className="hidden sm:block">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-brand-600">DataSculpt workspace</p>
          <p className="text-sm font-semibold text-[#242117]">{pageLabel}</p>
        </div>
      </div>
      <div className="flex items-center gap-3"><span className="hidden rounded-full border border-brand-200 bg-brand-100/65 px-3 py-1.5 text-xs font-semibold text-brand-800 sm:inline-flex">{planLoading ? 'Loading…' : `${plan?.name || 'Starter'} plan`}</span><span className="grid h-9 w-9 place-items-center rounded-full bg-[#242117] text-xs font-bold text-[#f6d96b]" aria-label={`Signed in as ${name}`}>{name.slice(0, 1).toUpperCase()}</span></div>
    </header>

    <main className="min-h-[calc(100vh-4rem)] overflow-x-hidden lg:ml-72">{children}</main>

    <AnimatePresence>
      {mobileOpen && <motion.div className="fixed inset-0 z-[60] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.18 }}>
        <button type="button" aria-label="Close workspace navigation" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-[#171611]/65 backdrop-blur-sm" />
        <motion.aside id="workspace-mobile-navigation" initial={{ x: reducedMotion ? 0 : -320 }} animate={{ x: 0 }} exit={{ x: reducedMotion ? 0 : -320 }} transition={{ type: reducedMotion ? 'tween' : 'spring', stiffness: 340, damping: 34 }} className="relative flex h-full w-[min(88vw,18rem)] flex-col border-r border-[#3c382d] bg-[#171611] shadow-2xl">
          <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close workspace navigation" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg border border-[#3c382d] text-[#d6cfba] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"><X size={18} /></button>
          <SidebarContent name={name} planName={plan?.name || 'Starter'} pathname={pathname} activeLayoutId="workspace-active-mobile" reducedMotion={Boolean(reducedMotion)} onSignOut={() => void logout().then(() => window.location.replace('/auth/login/'))} />
        </motion.aside>
      </motion.div>}
    </AnimatePresence>
  </div>;
}

function SidebarContent({ name, planName, pathname, activeLayoutId, reducedMotion, onSignOut }: { name: string; planName: string; pathname: string; activeLayoutId: string; reducedMotion: boolean; onSignOut: () => void }) {
  return <>
    <div className="border-b border-[#353126] px-5 py-5">
      <Link href="/dashboard/" className="group flex items-center justify-between gap-3">
        <div className="flex items-center rounded-xl bg-[#fffdf2] px-3 py-1.5 shadow-sm transition group-hover:bg-white">
          <Image
            src="/images/datasculpt_logo.webp"
            alt="DataSculpt"
            width={120}
            height={36}
            className="h-7 w-auto object-contain"
            priority
          />
        </div>
        <span className="rounded border border-[#3c382d] bg-[#242219] px-2 py-1 font-mono text-[0.58rem] font-semibold tracking-wider text-[#e0b536]">
          .lk
        </span>
      </Link>
    </div>
    <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5" aria-label="Workspace navigation">{fixedLinks.map((link) => { const active = activePath(pathname, link.href); const Icon = link.icon; return <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined} className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3.5 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${active ? 'text-[#171611]' : 'text-[#aaa38f] hover:bg-[#242219] hover:text-[#f8f1dd]'}`}>{active && <motion.span layoutId={activeLayoutId} className="absolute inset-0 bg-[#e0b536]" transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} />}<Icon className="relative z-10" size={17} /><span className="relative z-10">{link.label}</span></Link>; })}</nav>
    <div className="border-t border-[#353126] p-4"><div className="rounded-2xl border border-[#3c382d] bg-[#201e17] p-4"><p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-[#8e8775]">Current access</p><p className="mt-2 text-sm font-semibold text-[#fff9e7]">{planName}</p><Link href="/pricing/" className="mt-3 inline-flex text-xs font-semibold text-[#e0b536] hover:text-[#f3d56d]">Review plans</Link></div><div className="mt-4 flex items-center justify-between gap-3 px-1"><div className="min-w-0"><p className="truncate text-xs font-semibold text-[#e8e1cf]">{name}</p><p className="text-[0.62rem] text-[#817a68]">Authenticated</p></div><button type="button" onClick={onSignOut} aria-label="Sign out" className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[#3c382d] text-[#aaa38f] transition hover:border-brand-500/60 hover:text-[#f3c94d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"><LogOut size={16} /></button></div></div>
  </>;
}
