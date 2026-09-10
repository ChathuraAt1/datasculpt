import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Globe2, Radio } from "lucide-react";
import {
  FaLinkedin,
  FaFacebook,
  FaXTwitter,
  FaPinterest,
  FaYoutube,
} from "react-icons/fa6";

const platformLinks = [
  ["Products", "/products/"],
  ["Architecture", "/architecture/"],
  ["Pricing", "/pricing/"],
] as const;

const companyLinks = [
  ["About DataSculpt", "/about/"],
  ["Contact Engineering", "/contact/"],
  ["LinkedIn", "https://www.linkedin.com/company/data-sculpt/"],
  ["Crunchbase", "https://www.crunchbase.com/organization/datasculpt-6d0b"],
  ["F6S", "https://www.f6s.com/datasculpt"],
] as const;
const socialLinks = [
  {
    icon: <FaFacebook size={24} />,
    name: "Facebook",
    url: "https://www.facebook.com/datasculpt/",
  },
  {
    icon: <FaPinterest size={24} />,
    name: "Pinterest",
    url: "https://www.pinterest.com/datasculpt/",
  },
  {
    icon: <FaYoutube size={24} />,
    name: "Youtube",
    url: "https://www.youtube.com/@datasculpt1",
  },
  {
    icon: <FaXTwitter size={24} />,
    name: "X",
    url: "https://x.com/datasculpt01",
  },
];

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
            <div className="space-y-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 transition opacity-95 hover:opacity-100"
                aria-label="DataSculpt home"
              >
                <Image
                  src="/images/datasculpt_logo.webp"
                  alt="DataSculpt"
                  width={160}
                  height={48}
                  className="h-9 w-auto object-contain"
                />
                <span className="rounded bg-brand-400/15 px-1.5 py-0.5 font-mono text-[0.58rem] font-semibold tracking-wider text-brand-700">
                  .lk
                </span>
              </Link>
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[#64748b]">
                Enterprise data, intelligently transformed.
              </p>
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
            <div className="flex mt-2 gap-4 justify-start items-center">
              <Link
                href="/products/"
                className=" inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
              >
                See the platform <ArrowUpRight size={15} />
              </Link>
              <a
                href="https://www.linkedin.com/company/data-sculpt/"
                target="_blank"
                rel="noopener noreferrer"
                className=" inline-flex items-center gap-2 text-sm font-semibold text-brand-300 transition hover:text-brand-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
              >
                Follow DataSculpt on <FaLinkedin size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <FooterColumn title="Platform" links={platformLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Trust & Legal" links={trustLinks} />
          {/* Different social icon footer colmun horizontal */}
          <div className="">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center p-2 gap-1.5 text-xs text-slate-400 transition hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-5 border-t border-slate-800/80 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 DataSculpt.lk. Enterprise data, intelligently transformed.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href="https://www.linkedin.com/company/data-sculpt/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 transition hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
              aria-label="DataSculpt on LinkedIn"
            >
              <FaLinkedin size={15} className="text-brand-300" />
              <span>LinkedIn</span>
            </a>
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
        {links.map(([label, href]) => {
          const isExternal = href.startsWith("http");
          return (
            <li key={href}>
              {isExternal ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                >
                  <span>{label}</span>
                  <ArrowUpRight size={13} className="text-slate-500" />
                </a>
              ) : (
                <Link
                  href={href}
                  className="text-sm text-slate-400 transition hover:text-brand-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300"
                >
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
