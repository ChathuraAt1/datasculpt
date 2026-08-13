'use client';

import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { AuthShell } from '@/components/auth/AuthShell';

export default function VerifiedPage() { return <AuthShell eyebrow="EMAIL VERIFICATION" title="Your email is verified." description="Your DataSculpt account can now be used with the email address you confirmed."><div className="rounded-lg border border-brand-500/30 bg-brand-950/30 p-5 text-center"><CheckCircle2 className="mx-auto text-brand-300" size={30} /><p className="mt-3 text-sm leading-6 text-brand-200">Verification completed successfully.</p></div><div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href="/account/" className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-brand-300">Open account</Link><Link href="/auth/login/" className="inline-flex items-center justify-center rounded-lg border border-slate-800 px-4 py-3 text-sm font-semibold text-slate-300 hover:border-brand-500/60 hover:text-brand-200">Sign in</Link></div></AuthShell>; }

