'use client';

import React, { useMemo, useState } from 'react';
import {
  Bot,
  Check,
  CheckSquare,
  Code2,
  Copy,
  Download,
  Eye,
  FileText,
  LoaderCircle,
  Sparkles,
  Square,
} from 'lucide-react';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
  emptyMessage?: string;
  isGenerating?: boolean;
}

// Inline formatting parser
function renderInline(text: string): React.ReactNode[] {
  // Regex to match inline code, bold-italic, bold, italic, strikethrough, and links
  const regex = /(`[^`]+`|\*\*\*[^*]+\*\*\*|___[^_]+___|\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|\*[^*]+\*|_[^_]+_|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Inline code `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      const code = part.slice(1, -1);
      return (
        <code
          key={index}
          className="mx-0.5 rounded-md border border-[#4a4231] bg-[#29251c] px-1.5 py-0.5 font-mono text-[0.85em] font-medium text-[#f1cd68]"
        >
          {code}
        </code>
      );
    }

    // Bold-italic ***text*** or ___text___
    if (
      (part.startsWith('***') && part.endsWith('***') && part.length >= 6) ||
      (part.startsWith('___') && part.endsWith('___') && part.length >= 6)
    ) {
      return (
        <strong key={index} className="font-semibold italic text-[#fff6e0]">
          {part.slice(3, -3)}
        </strong>
      );
    }

    // Bold **text** or __text__
    if (
      (part.startsWith('**') && part.endsWith('**') && part.length >= 4) ||
      (part.startsWith('__') && part.endsWith('__') && part.length >= 4)
    ) {
      return (
        <strong key={index} className="font-semibold text-[#fff9eb]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    // Strikethrough ~~text~~
    if (part.startsWith('~~') && part.endsWith('~~') && part.length >= 4) {
      return (
        <del key={index} className="line-through opacity-70">
          {part.slice(2, -2)}
        </del>
      );
    }

    // Italic *text* or _text_
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length >= 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length >= 2)
    ) {
      return (
        <em key={index} className="italic text-[#ded6c2]">
          {part.slice(1, -1)}
        </em>
      );
    }

    // Link [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, linkText, linkUrl] = linkMatch;
      return (
        <a
          key={index}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#e5be58] underline decoration-[#e5be58]/40 underline-offset-2 transition hover:text-[#f8d97e] hover:decoration-[#e5be58]"
        >
          {linkText}
        </a>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

// Code Block with Copy function
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-[#3f3a2c] bg-[#171511]">
      <div className="flex items-center justify-between border-b border-[#332f24] bg-[#1f1d17] px-4 py-2 text-xs text-[#a49c89]">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#d9b642]">
          {language || 'text'}
        </span>
        <button
          type="button"
          onClick={copyCode}
          className="flex items-center gap-1.5 rounded px-2 py-1 transition hover:bg-[#2e2a21] hover:text-[#ece5d3]"
          title="Copy code"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-6 text-[#f3edde]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Markdown Block AST node definitions
type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; language: string; code: string }
  | { type: 'quote'; text: string }
  | { type: 'checklist'; items: { checked: boolean; text: string }[] }
  | { type: 'bullet-list'; items: string[] }
  | { type: 'numbered-list'; items: string[]; start: number }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'divider' };

function parseMarkdown(content: string): Block[] {
  const lines = content.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const language = line.trim().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // Skip closing ```
      blocks.push({
        type: 'code',
        language,
        code: codeLines.join('\n'),
      });
      continue;
    }

    // Horizontal rule: --- or *** or ___
    if (/^(\s*[-*_]\s*){3,}$/.test(line.trim())) {
      blocks.push({ type: 'divider' });
      i++;
      continue;
    }

    // Heading: #, ##, ###, ####, #####, ######
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      });
      i++;
      continue;
    }

    // Blockquote: > text
    if (line.trim().startsWith('>')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('>')) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ''));
        i++;
      }
      blocks.push({
        type: 'quote',
        text: quoteLines.join('\n'),
      });
      continue;
    }

    // Table: | Header 1 | Header 2 |
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }

      if (tableLines.length >= 2) {
        const splitRow = (r: string) =>
          r
            .trim()
            .slice(1, -1)
            .split('|')
            .map((c) => c.trim());

        const headers = splitRow(tableLines[0]);
        // line 1 is usually separator |---|---|
        const rows = tableLines.slice(2).map(splitRow);
        blocks.push({
          type: 'table',
          headers,
          rows,
        });
        continue;
      }
    }

    // Task Checklist: - [ ] or - [x]
    if (/^[-*+]\s+\[([ xX])\]\s+(.*)$/.test(line.trim())) {
      const items: { checked: boolean; text: string }[] = [];
      while (i < lines.length) {
        const m = lines[i].trim().match(/^[-*+]\s+\[([ xX])\]\s+(.*)$/);
        if (!m) break;
        items.push({
          checked: m[1].toLowerCase() === 'x',
          text: m[2],
        });
        i++;
      }
      blocks.push({
        type: 'checklist',
        items,
      });
      continue;
    }

    // Unordered list: - item or * item
    if (/^[-*+]\s+(.*)$/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].trim().match(/^[-*+]\s+(.*)$/);
        // Exclude checklist items if any
        if (!m || /^[-*+]\s+\[([ xX])\]/.test(lines[i].trim())) break;
        items.push(m[1]);
        i++;
      }
      blocks.push({
        type: 'bullet-list',
        items,
      });
      continue;
    }

    // Numbered list: 1. item, 2. item
    if (/^(\d+)\.\s+(.*)$/.test(line.trim())) {
      const items: string[] = [];
      const firstMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
      const start = firstMatch ? parseInt(firstMatch[1], 10) : 1;

      while (i < lines.length) {
        const m = lines[i].trim().match(/^\d+\.\s+(.*)$/);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      blocks.push({
        type: 'numbered-list',
        items,
        start,
      });
      continue;
    }

    // Blank line
    if (!line.trim()) {
      i++;
      continue;
    }

    // Paragraph: collect consecutive non-empty lines
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].trim().startsWith('#') &&
      !lines[i].trim().startsWith('>') &&
      !lines[i].trim().startsWith('|') &&
      !/^(\s*[-*_]\s*){3,}$/.test(lines[i].trim()) &&
      !/^[-*+]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }

    if (paragraphLines.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: paragraphLines.join(' '),
      });
    }
  }

  return blocks;
}

export function MarkdownPreview({
  content,
  className = '',
  emptyMessage = 'Submit a prompt above to generate synchronous enterprise data guidance.',
  isGenerating = false,
}: MarkdownPreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);

  const blocks = useMemo(() => {
    if (!content) return [];
    return parseMarkdown(content);
  }, [content]);

  // Statistics
  const stats = useMemo(() => {
    if (!content) return { words: 0, lines: 0, characters: 0 };
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const lines = content.split('\n').length;
    const characters = content.length;
    return { words, lines, characters };
  }, [content]);

  const copyFullContent = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const downloadMarkdown = () => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `datasculpt-ai-guidance-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`mt-6 min-h-[300px] rounded-2xl border border-[#383327] bg-[#1e1c16] text-[#ede6d5] shadow-xl ${className}`}>
      {/* Control Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#363124] bg-[#24211a] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#d9b642]">
            <Bot size={15} />
            Generated Guidance
          </span>
          {content && (
            <span className="hidden items-center gap-1.5 rounded-full border border-[#443d2c] bg-[#1a1813] px-2.5 py-0.5 text-[11px] text-[#a9a18f] sm:inline-flex">
              <Sparkles size={11} className="text-[#e2be5a]" />
              {stats.words} words · {stats.lines} lines
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* View Switcher: Preview vs Raw */}
          {content && (
            <div className="flex rounded-lg border border-[#443d2c] bg-[#191712] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  viewMode === 'preview'
                    ? 'bg-[#d9b642] text-slate-950 shadow-xs'
                    : 'text-[#a9a18f] hover:text-[#ede6d5]'
                }`}
                title="Formatted Markdown Preview"
              >
                <Eye size={13} />
                <span>Preview</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('raw')}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  viewMode === 'raw'
                    ? 'bg-[#d9b642] text-slate-950 shadow-xs'
                    : 'text-[#a9a18f] hover:text-[#ede6d5]'
                }`}
                title="Raw Markdown Source"
              >
                <Code2 size={13} />
                <span>Raw</span>
              </button>
            </div>
          )}

          {/* Download Button */}
          {content && (
            <button
              type="button"
              onClick={downloadMarkdown}
              className="flex items-center gap-1.5 rounded-lg border border-[#443d2c] bg-[#191712] px-2.5 py-1.5 text-xs text-[#bcb39f] transition hover:border-[#574e38] hover:text-[#f2d366]"
              title="Download as .md file"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          {/* Copy Button */}
          <button
            type="button"
            disabled={!content}
            onClick={copyFullContent}
            className="flex items-center gap-1.5 rounded-lg border border-[#443d2c] bg-[#191712] px-3 py-1.5 text-xs font-medium text-[#bcb39f] transition hover:border-[#574e38] hover:text-[#f2d366] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6">
        {content ? (
          viewMode === 'raw' ? (
            <div className="relative">
              <pre
                aria-live="polite"
                className="overflow-x-auto rounded-xl border border-[#343026] bg-[#171511] p-5 font-mono text-xs leading-6 text-[#ded7c4]"
              >
                {content}
              </pre>
            </div>
          ) : (
            <article aria-live="polite" className="space-y-4 text-sm leading-7 text-[#ede6d5]">
              {blocks.map((block, idx) => {
                switch (block.type) {
                  case 'heading': {
                    if (block.level === 1) {
                      return (
                        <h1
                          key={idx}
                          className="mt-6 border-b border-[#3b3629] pb-3 font-serif text-2xl font-bold tracking-tight text-[#fcedc2]"
                        >
                          {renderInline(block.text)}
                        </h1>
                      );
                    }
                    if (block.level === 2) {
                      return (
                        <h2
                          key={idx}
                          className="mt-5 border-b border-[#332e22] pb-2 text-xl font-bold tracking-tight text-[#f5e3b3]"
                        >
                          {renderInline(block.text)}
                        </h2>
                      );
                    }
                    if (block.level === 3) {
                      return (
                        <h3
                          key={idx}
                          className="mt-4 text-base font-semibold text-[#ebd59f]"
                        >
                          {renderInline(block.text)}
                        </h3>
                      );
                    }
                    return (
                      <h4
                        key={idx}
                        className="mt-3 text-sm font-semibold uppercase tracking-wider text-[#d8c38d]"
                      >
                        {renderInline(block.text)}
                      </h4>
                    );
                  }

                  case 'paragraph': {
                    return (
                      <p key={idx} className="text-[#dfd7c5]">
                        {renderInline(block.text)}
                      </p>
                    );
                  }

                  case 'code': {
                    return <CodeBlock key={idx} code={block.code} language={block.language} />;
                  }

                  case 'quote': {
                    return (
                      <blockquote
                        key={idx}
                        className="my-4 rounded-r-xl border-l-4 border-[#d9b642] bg-[#25221b] py-3 pl-4 pr-4 text-[#cfc7b4]"
                      >
                        {block.text.split('\n').map((line, lIdx) => (
                          <p key={lIdx} className="italic">
                            {renderInline(line)}
                          </p>
                        ))}
                      </blockquote>
                    );
                  }

                  case 'checklist': {
                    return (
                      <ul key={idx} className="my-3 space-y-2 pl-1">
                        {block.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2.5 text-[#dfd7c5]">
                            <span className="mt-1 text-[#d9b642]">
                              {item.checked ? (
                                <CheckSquare size={16} className="text-emerald-400" />
                              ) : (
                                <Square size={16} className="text-[#7d7564]" />
                              )}
                            </span>
                            <span className={item.checked ? 'text-[#a9a18f] line-through' : ''}>
                              {renderInline(item.text)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  case 'bullet-list': {
                    return (
                      <ul key={idx} className="my-3 space-y-2 pl-2">
                        {block.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2.5 text-[#dfd7c5]">
                            <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d9b642]" />
                            <div>{renderInline(item)}</div>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  case 'numbered-list': {
                    return (
                      <ol key={idx} start={block.start} className="my-3 space-y-2 pl-2">
                        {block.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-3 text-[#dfd7c5]">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-[#4a4231] bg-[#27241d] font-mono text-xs font-medium text-[#e2be5a]">
                              {block.start + itemIdx}
                            </span>
                            <div className="pt-0.5">{renderInline(item)}</div>
                          </li>
                        ))}
                      </ol>
                    );
                  }

                  case 'table': {
                    return (
                      <div key={idx} className="my-5 overflow-x-auto rounded-xl border border-[#3b3628]">
                        <table className="w-full text-left text-xs">
                          <thead className="border-b border-[#3b3628] bg-[#26231b] font-semibold text-[#f1cd68]">
                            <tr>
                              {block.headers.map((h, hIdx) => (
                                <th key={hIdx} className="px-4 py-2.5">
                                  {renderInline(h)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#302c21] bg-[#1a1813]">
                            {block.rows.map((row, rIdx) => (
                              <tr key={rIdx} className="transition hover:bg-[#232019]">
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="px-4 py-2 text-[#dfd7c5]">
                                    {renderInline(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  case 'divider': {
                    return <hr key={idx} className="my-6 border-[#363124]" />;
                  }

                  default:
                    return null;
                }
              })}
            </article>
          )
        ) : isGenerating ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center py-8 text-center text-xs leading-6 text-[#9a917e]">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-brand-300/40 bg-brand-500/10 text-brand-300 shadow-sm">
              <LoaderCircle size={24} className="animate-spin text-[#d9b642]" />
            </div>
            <p className="max-w-md font-semibold text-[#f1cd68]">
              Synthesizing enterprise data guidance…
            </p>
            <p className="mt-1 max-w-sm text-[11px] text-[#8e8574]">
              Processing prompt tokens and preparing structured markdown guidance.
            </p>
          </div>
        ) : (
          <div className="flex min-h-[220px] flex-col items-center justify-center py-8 text-center text-xs leading-6 text-[#9a917e]">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl border border-[#383327] bg-[#24211a] text-[#867d6c]">
              <FileText size={22} />
            </div>
            <p className="max-w-md font-medium text-[#bdb4a1]">{emptyMessage}</p>
            <p className="mt-1 max-w-sm text-[11px] text-[#736a59]">
              Output will render in styled markdown preview with formatted headings, lists, checklists, and code syntax blocks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
