'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Command, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/components/auth/AuthContext';

const desktopLinks = [
  { label: 'Products', href: '/products/' },
  { label: 'Pricing', href: '/pricing/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

const mobileLinks = [...desktopLinks.slice(0, 1), { label: 'Architecture', href: '/architecture/' }, ...desktopLinks.slice(1)];

function isActivePath(pathname: string, href: string) {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return path === href || (href !== '/' && path.startsWith(href));
}

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(154,101,0,0.08)]">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
      <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="DataSculpt home">
        <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-brand-400/50 bg-brand-400/10 text-brand-300 shadow-brand transition group-hover:border-brand-300">
          <Command size={19} strokeWidth={2.5} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-brand-300" />
        </span>
        <span className="text-lg font-bold tracking-tight text-white">DataSculpt<span className="ml-1.5 rounded bg-brand-400/10 px-1.5 py-0.5 font-mono text-[0.58rem] font-semibold tracking-wider text-brand-300">.lk</span></span>
      </Link>

      <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
        {desktopLinks.map((link) => <NavLink key={link.href} {...link} active={isActivePath(pathname, link.href)} />)}
      </nav>

      <div className="hidden items-center gap-3 md:flex">
        <span className="inline-flex items-center gap-2 font-mono text-[0.62rem] font-semibold tracking-wider text-brand-300"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-300 shadow-[0_0_10px_#fde047]" />SYSTEM ONLINE</span>
        {!loading && (isAuthenticated ? <><Button href="/account/" variant="ghost" className="px-3.5 py-2 text-xs">Account</Button><button onClick={() => void logout()} className="rounded px-1 text-xs text-slate-500 transition hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300">Sign out</button></> : <Button href="/auth/login/" variant="ghost" className="px-3.5 py-2 text-xs">Sign in</Button>)}
        <Button href="/products/" variant="secondary" className="px-3.5 py-2 text-xs">Launch Ops Center <ArrowUpRight size={14} /></Button>
      </div>

      <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-md border border-slate-800 p-2 text-slate-300 transition hover:border-brand-500/60 hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 md:hidden" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation"><span className="sr-only">{menuOpen ? 'Close' : 'Open'} navigation menu</span>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
    </div>

    <AnimatePresence>
      {menuOpen && <motion.div id="mobile-navigation" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-slate-800/80 bg-slate-950/95 md:hidden">
        <nav className="mx-auto max-w-7xl space-y-1 px-5 py-4" aria-label="Mobile navigation">
          {mobileLinks.map((link) => <MobileNavLink key={link.href} {...link} active={isActivePath(pathname, link.href)} />)}
          <div className="mt-4 grid gap-3 border-t border-slate-800 pt-4 sm:grid-cols-2">
            {!loading && (isAuthenticated ? <><Button href="/account/" variant="ghost" className="w-full" >Account</Button><button type="button" onClick={() => { setMenuOpen(false); void logout(); }} className="rounded-lg border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-brand-500/60 hover:text-brand-200">Sign out</button></> : <Button href="/auth/login/" variant="ghost" className="w-full">Sign in</Button>)}
            <Button href="/products/" variant="primary" className="w-full">Launch Ops Center <ArrowUpRight size={15} /></Button>
          </div>
        </nav>
      </motion.div>}
    </AnimatePresence>
  </header>;
}

function NavLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return <Link href={href} aria-current={active ? 'page' : undefined} className={`relative rounded-lg px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${active ? 'text-slate-950' : 'text-slate-400 hover:text-brand-300'}`}>
    {active && <motion.span layoutId="desktop-active-nav" className="absolute inset-0 -z-10 rounded-lg bg-brand-400 shadow-[0_0_18px_rgba(234,179,8,0.18)]" transition={{ type: 'spring', stiffness: 420, damping: 30 }} />}
    <span className="relative">{label}</span>
  </Link>;
}

function MobileNavLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return <Link href={href} aria-current={active ? 'page' : undefined} className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 ${active ? 'bg-brand-400 text-slate-950' : 'text-slate-300 hover:bg-slate-900 hover:text-brand-300'}`}><span>{label}</span><ChevronDown size={15} className="-rotate-90" /></Link>;
}
