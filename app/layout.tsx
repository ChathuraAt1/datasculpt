import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'DataSculpt.lk | Enterprise AI Data Engineering',
  description: 'The intelligent data engineering and transformation platform for enterprise teams.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${inter.variable} ${mono.variable}`}><Navbar /><main className="relative min-h-screen overflow-hidden bg-slate-950"><div className="pointer-events-none absolute inset-0 bg-hero-radial" /><div className="grid-fade pointer-events-none absolute inset-0 opacity-20" />{children}</main><Footer /></body></html>;
}
