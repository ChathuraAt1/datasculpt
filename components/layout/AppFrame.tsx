'use client';

import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { WorkspaceProvider } from '@/components/dashboard/WorkspaceContext';
import { WorkspaceShell } from '@/components/dashboard/WorkspaceShell';

export function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const workspaceRoute = pathname === '/account/' || pathname === '/account' || pathname.startsWith('/dashboard');

  if (workspaceRoute) {
    return <WorkspaceProvider><WorkspaceShell>{children}</WorkspaceShell></WorkspaceProvider>;
  }

  return <><Navbar /><main className="relative min-h-screen overflow-hidden bg-slate-950"><div className="pointer-events-none absolute inset-0 bg-hero-radial" /><div className="grid-fade pointer-events-none absolute inset-0 opacity-20" />{children}</main><Footer /></>;
}
