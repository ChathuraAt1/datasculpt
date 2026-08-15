'use client';

import Link from 'next/link';
import { Cookie, X } from 'lucide-react';
import { useConsent } from '@/components/consent/ConsentContext';

export function CookieConsentBanner() {
  const { choice, hydrated, preferencesOpen, acceptAll, acceptNecessaryOnly, openPreferences, closePreferences } = useConsent();
  if (!hydrated) return null;

  const panelOpen = choice === 'pending' || preferencesOpen;
  return <>
    {panelOpen ? <div className="fixed inset-x-4 bottom-4 z-[70] mx-auto max-w-3xl rounded-2xl border border-brand-200 bg-white p-5 shadow-[0_18px_60px_rgba(81,50,0,0.18)] sm:inset-x-auto sm:left-6 sm:right-6 sm:p-6" role="dialog" aria-modal="false" aria-labelledby="cookie-consent-title">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand-200 bg-brand-50 text-brand-700"><Cookie size={19} /></span>
        <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><h2 id="cookie-consent-title" className="text-base font-semibold text-slate-900">Your privacy, your choice.</h2><p className="mt-2 text-sm leading-6 text-slate-600">DataSculpt uses necessary browser storage for sign-in and preferences. Optional services such as contact-form verification load only when you allow them.</p></div>{choice !== 'pending' && <button type="button" onClick={closePreferences} className="rounded-lg p-1.5 text-slate-500 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" aria-label="Close privacy preferences"><X size={17} /></button>}</div><p className="mt-2 text-xs leading-5 text-slate-500">The AI assistant uses the configured DataSculpt API and does not require advertising cookies. See our <Link href="/privacy/" className="font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-500">Privacy Policy</Link>.</p><div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={acceptNecessaryOnly} className="rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Use necessary only</button><button type="button" onClick={acceptAll} className="rounded-xl border border-brand-500 bg-brand-500 px-4 py-2.5 text-sm font-semibold text-slate-50 transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">Accept optional features</button></div></div>
      </div>
    </div> : <button type="button" onClick={openPreferences} className="fixed bottom-4 left-4 z-[60] inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3.5 py-2 text-xs font-semibold text-brand-700 shadow-panel transition hover:border-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" aria-label="Open privacy preferences"><Cookie size={14} />Privacy preferences</button>}
  </>;
}
