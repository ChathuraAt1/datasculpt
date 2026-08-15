'use client';

import { FormEvent, useState } from 'react';
import { Bot, Copy, LoaderCircle, Send, Sparkles } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { useWorkspace } from '@/components/dashboard/WorkspaceContext';
import { AccessNotice, WorkspaceButton, WorkspacePageHeader, WorkspacePanel } from '@/components/dashboard/WorkspaceUI';
import { AuthApiError, authRequest } from '@/lib/auth';
import { renderAiResult } from '@/lib/ai';

const presets = [
  { label: 'Knowledge assistant', prompt: 'Create a concise preparation checklist for turning approved enterprise documents into useful context for an internal knowledge assistant.' },
  { label: 'Forecasting workflow', prompt: 'Outline the data quality and preparation steps an enterprise forecasting workflow should complete before model training.' },
  { label: 'Customer intelligence', prompt: 'Describe a governed data preparation approach for creating a unified customer intelligence view from approved business sources.' },
];

export default function AiReadyWorkspacePage() {
  const { token } = useAuth();
  const { accessFor } = useWorkspace();
  const entitlement = accessFor('ai-ready');
  const [prompt, setPrompt] = useState(presets[0].prompt);
  const [maxTokens, setMaxTokens] = useState(512);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!entitlement.enabled || !token || !prompt.trim()) return;
    setSubmitting(true);
    setError('');
    setOutput('');
    try {
      const envelope = await authRequest('/api/ai/generate', { method: 'POST', body: JSON.stringify({ prompt: prompt.trim(), max_tokens: maxTokens, async: false }) }, token);
      setOutput(renderAiResult(envelope.data));
    } catch (requestError) {
      if (requestError instanceof AuthApiError && requestError.status === 429) setError('The AI request limit has been reached. Please wait before trying again.');
      else if (requestError instanceof AuthApiError && requestError.status === 422) setError('Review the prompt and token limit, then try again.');
      else setError(requestError instanceof Error ? requestError.message : 'The AI preparation request could not be completed.');
    } finally { setSubmitting(false); }
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10"><WorkspacePageHeader eyebrow="DataSculpt AI-Ready" title="Give enterprise AI better information to work with." description="Use the documented synchronous AI service to explore preparation guidance. Requests run only after you submit and are not presented as saved jobs or account history." /><div className="mt-6"><AccessNotice entitlement={entitlement} /></div><section className="mt-8 grid gap-5 xl:grid-cols-[0.78fr_1.22fr]"><WorkspacePanel className="p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-800"><Sparkles size={19} /></span><div><p className="font-semibold text-[#2d291f]">Preparation starting points</p><p className="text-xs text-[#777062]">Choose a customer-focused prompt or write your own.</p></div></div><div className="mt-6 space-y-3">{presets.map((preset) => <button key={preset.label} type="button" disabled={!entitlement.enabled} onClick={() => setPrompt(preset.prompt)} className={`w-full rounded-xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:cursor-not-allowed ${prompt === preset.prompt ? 'border-brand-300 bg-brand-100/50' : 'border-[#dfd9ca] bg-[#faf8f2] hover:border-brand-200'}`}><span className="text-sm font-semibold text-[#39342a]">{preset.label}</span><span className="mt-1 block text-xs leading-5 text-[#756e60]">{preset.prompt}</span></button>)}</div><p className="mt-5 text-xs leading-5 text-[#777061]">Professional or higher is required in the workspace UI. This is product guidance only; backend entitlement enforcement must be added separately.</p></WorkspacePanel><WorkspacePanel className="p-6"><form onSubmit={generate}><label className="block text-sm font-semibold text-[#39342a]">Preparation request<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} disabled={!entitlement.enabled || submitting} maxLength={5000} rows={8} className="mt-2 w-full resize-y rounded-xl border border-[#dcd5c3] bg-[#fbfaf5] px-4 py-3 text-sm leading-6 text-[#29251b] outline-none transition focus:border-brand-500 focus:ring-1 focus:ring-brand-500 disabled:bg-[#efede6]" /></label><div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><label className="text-sm font-medium text-[#484338]">Response length<select value={maxTokens} onChange={(event) => setMaxTokens(Number(event.target.value))} disabled={!entitlement.enabled || submitting} className="mt-2 block rounded-xl border border-[#dcd5c3] bg-[#fbfaf5] px-3.5 py-2.5 text-sm text-[#29251b] outline-none focus:border-brand-500"><option value={256}>Concise · 256 tokens</option><option value={512}>Balanced · 512 tokens</option><option value={1024}>Detailed · 1024 tokens</option></select></label><WorkspaceButton type="submit" disabled={!entitlement.enabled || submitting || !prompt.trim()}>{submitting ? <LoaderCircle className="animate-spin" size={16} /> : <Send size={16} />}{submitting ? 'Preparing…' : 'Generate guidance'}</WorkspaceButton></div></form>{error && <div role="alert" className="mt-5 rounded-xl border border-brand-300 bg-[#fbf3d2] p-4 text-sm leading-6 text-brand-900">{error}</div>}<div className="mt-6 min-h-[280px] rounded-2xl bg-[#211f19] p-5 text-[#ece5d3]"><div className="flex items-center justify-between border-b border-[#3d392d] pb-4"><span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#d9b642]"><Bot size={15} />Generated preparation guidance</span><button type="button" disabled={!output} onClick={() => void copyOutput()} className="inline-flex items-center gap-2 text-xs text-[#bdb5a2] hover:text-[#f2d366] disabled:opacity-40"><Copy size={14} />{copied ? 'Copied' : 'Copy'}</button></div>{output ? <pre aria-live="polite" className="mt-5 whitespace-pre-wrap font-sans text-sm leading-7 text-[#ece5d3]">{output}</pre> : <p className="mt-5 text-sm leading-6 text-[#aaa18d]">{entitlement.enabled ? 'Your synchronous result will appear here after submission.' : 'Upgrade to Professional or higher to use the AI preparation request surface.'}</p>}</div></WorkspacePanel></section></div>;
}
