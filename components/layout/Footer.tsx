import Link from "next/link";
import { ArrowUpRight, Globe2, Radio } from "lucide-react";

const platformLinks = [
  ["Products", "/products/"],
  ["Architecture", "/architecture/"],
  ["Pricing", "/pricing/"],
] as const;

const companyLinks = [
  ["About DataSculpt", "/about/"],
  ["Contact Engineering", "/contact/"],
] as const;

const trustLinks = [
  ["Privacy Policy", "/privacy/"],
  ["Terms of Service", "/terms/"],
] as const;

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/90">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 rounded-2xl border border-slate-800 bg-slate-900/45 p-6 shadow-panel sm:p-8 lg:grid-cols-[1fr_0.85fr] lg:p-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-brand-400/50 bg-brand-400/10 text-brand-300">
                <Radio size={19} />
              </span>
              <div>
                <p className="text-lg font-bold tracking-tight text-white">
                  DataSculpt
                  <span className="ml-1.5 rounded bg-brand-400/10 px-1.5 py-0.5 font-mono text-[0.58rem] font-semibold tracking-wider text-brand-300">
                    .lk
                  </span>
                </p>
                <p className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-slate-600">
                  Enterprise data, intelligently transformed.
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-6 text-slate-400">
              A focused operating layer for high-throughput ingestion,
              transformation, quality, and AI-ready data workflows.
            </p>
          </div>
          <div className="rounded-xl border border-brand-500/25 bg-brand-950/20 p-5">
            <p className="eyebrow">FOR WHAT COMES NEXT</p>
            <p className="mt-4 text-lg font-semibold text-white">
              A clearer foundation for every next step.
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              DataSculpt helps teams make more of the information they already
              have.
            </p>
            <Link
              href="/products/"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            >
              See the platform <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Trust & Legal" links={trustLinks} />
          <div>
            <h2 className="mb-4 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
              Engineering Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {["RAPIDS", "cuDF", "CUDA", "Apache Arrow"].map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-slate-800 bg-slate-900/70 px-2.5 py-1.5 font-mono text-[0.65rem] text-slate-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-slate-800/80 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 DataSculpt.lk. Enterprise data, intelligently transformed.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <label className="flex items-center gap-2 text-slate-400">
              <Globe2 size={14} className="text-brand-300" />
              <span className="sr-only">Regional infrastructure</span>
              <select
                defaultValue="colombo"
                aria-label="Regional infrastructure reference"
                className="cursor-pointer bg-transparent text-xs text-slate-300 outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
              >
                <option value="colombo" className="bg-slate-900">
                  US East / Colombo Nodes
                </option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly (readonly [string, string])[];
}) {
  return (
    <div>
      <h2 className="mb-4 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
        {title}
      </h2>
      <ul className="space-y-3">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-slate-400 transition hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
