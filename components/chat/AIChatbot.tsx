'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bot, Eraser, MessageCircle, Send, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { AuthApiError, authRequest } from '@/lib/auth';
import { renderAiResult } from '@/lib/ai';

type ChatMessage = { id: string; role: 'user' | 'assistant'; content: string };

const systemPrompt = `You are the DataSculpt Guide, a concise and helpful product guide for DataSculpt.lk. Answer questions about DataSculpt products, workflows, plans, AI readiness, and how to get started using only the product context provided in the conversation. Do not invent live integrations, telemetry, customer results, certifications, or unsupported backend capabilities. For account-specific questions, direct the visitor to sign in to the workspace. For sensitive architecture or deployment questions, recommend contacting the DataSculpt team at /contact/. Never ask for passwords, API keys, payment card details, credentials, or private datasets.`;
const welcomeMessage: ChatMessage = { id: 'welcome', role: 'assistant', content: 'Hi — I’m the DataSculpt Guide. Ask me about the platform, plans, workflows, AI readiness, or where to start.' };

export function AIChatbot() {
  const pathname = usePathname();
  const { token } = useAuth();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const hidden = pathname.startsWith('/auth') || pathname.startsWith('/checkout');

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', closeOnEscape);
    endRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [open, messages, reducedMotion]);

  if (hidden) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = draft.trim();
    if (!prompt || sending) return;

    const userMessage: ChatMessage = { id: makeId(), role: 'user', content: prompt };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft('');
    setError('');
    setSending(true);

    try {
      const envelope = await authRequest('/api/ai/generate', {
        method: 'POST',
        body: JSON.stringify({
          messages: [{ role: 'system', content: systemPrompt }, ...nextMessages.filter(({ id }) => id !== 'welcome').map(({ role, content }) => ({ role, content }))],
          max_tokens: 512,
          async: false,
        }),
      }, token);
      const answer = renderAiResult(envelope.data).trim();
      setMessages((current) => [...current, { id: makeId(), role: 'assistant', content: answer || 'The assistant returned an empty response. Please try again.' }]);
    } catch (requestError) {
      setError(chatErrorMessage(requestError));
    } finally {
      setSending(false);
    }
  }

  function clearConversation() {
    setMessages([welcomeMessage]);
    setDraft('');
    setError('');
  }

  return <>
    <motion.button type="button" whileHover={reducedMotion ? undefined : { y: -3 }} whileTap={reducedMotion ? undefined : { scale: 0.96 }} onClick={() => setOpen((value) => !value)} className="fixed bottom-24 right-5 z-[55] grid h-14 w-14 place-items-center rounded-full border border-brand-300 bg-brand-500 text-slate-50 shadow-[0_10px_30px_rgba(154,101,0,0.28)] transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffdf2]" aria-label={open ? 'Close DataSculpt AI assistant' : 'Open DataSculpt AI assistant'} aria-expanded={open} aria-controls="datasculpt-ai-chat"><MessageCircle size={23} /></motion.button>
    <AnimatePresence>
      {open && <motion.aside id="datasculpt-ai-chat" initial={{ opacity: 0, y: reducedMotion ? 0 : 18, scale: reducedMotion ? 1 : 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.98 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="fixed bottom-40 right-4 z-[56] flex h-[min(650px,70vh)] w-[min(92vw,390px)] flex-col overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-[0_20px_70px_rgba(81,50,0,0.2)]" aria-label="DataSculpt Guide chat">
        <div className="flex items-center justify-between border-b border-brand-100 bg-brand-50 px-4 py-3"><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl border border-brand-200 bg-white text-brand-700"><Bot size={18} /></span><div><p className="text-sm font-semibold text-slate-900">DataSculpt Guide</p><p className="text-[0.68rem] text-slate-500">Product guidance, on demand</p></div></div><div className="flex items-center gap-1"><button type="button" onClick={clearConversation} className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" aria-label="Clear conversation"><Eraser size={16} /></button><button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-white hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" aria-label="Close chat"><X size={17} /></button></div></div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-[#fbfaf5] p-4" aria-live="polite">{messages.map((message) => <div key={message.id} className={`max-w-[88%] rounded-2xl px-3.5 py-3 text-sm leading-6 ${message.role === 'user' ? 'ml-auto bg-brand-500 text-slate-50' : 'border border-brand-100 bg-white text-slate-700'}`}>{message.content}</div>)}{sending && <div className="max-w-[88%] rounded-2xl border border-brand-100 bg-white px-3.5 py-3 text-sm text-slate-500">Thinking…</div>}{error && <p className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-xs leading-5 text-brand-800" role="alert">{error}</p>}<div ref={endRef} /></div>
        <form onSubmit={submit} className="border-t border-brand-100 bg-white p-3"><label htmlFor="datasculpt-chat-input" className="sr-only">Ask the DataSculpt Guide</label><textarea id="datasculpt-chat-input" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} disabled={sending} maxLength={5000} rows={2} placeholder="Ask about products, plans, or workflows…" className="w-full resize-none rounded-xl border border-brand-100 bg-brand-50/50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:opacity-60" /><div className="mt-2 flex items-center justify-between gap-3"><p className="text-[0.65rem] leading-4 text-slate-500">Do not share secrets, credentials, or private datasets.</p><button type="submit" disabled={sending || !draft.trim()} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-brand-500 bg-brand-500 text-slate-50 transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" aria-label="Send message"><Send size={15} /></button></div></form>
      </motion.aside>}
    </AnimatePresence>
  </>;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function chatErrorMessage(error: unknown) {
  if (error instanceof AuthApiError) {
    if (error.status === 422) return 'Please rephrase your question and try again.';
    if (error.status === 429) return 'The assistant is receiving a lot of requests. Please wait a moment and try again.';
    if (error.status === 500) return 'The AI service is temporarily unavailable. Please try again shortly.';
    if (error.status === 0) return 'The AI service is not configured for this environment yet.';
  }
  return 'The assistant could not connect right now. Please try again or contact the DataSculpt team.';
}
