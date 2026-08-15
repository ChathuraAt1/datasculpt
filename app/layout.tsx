import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthContext';
import { ConsentProvider } from '@/components/consent/ConsentContext';
import { AppFrame } from '@/components/layout/AppFrame';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'DataSculpt.lk | Enterprise AI Data Engineering',
  description: 'The intelligent data engineering and transformation platform for enterprise teams.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${inter.variable} ${mono.variable}`}><AuthProvider><ConsentProvider><AppFrame>{children}</AppFrame></ConsentProvider></AuthProvider></body></html>;
}
