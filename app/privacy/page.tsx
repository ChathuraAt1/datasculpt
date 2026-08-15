"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  CircleUserRound,
  Cloud,
  Cpu,
  FileKey2,
  Globe2,
  HardDrive,
  LockKeyhole,
  Mail,
  Network,
  ScanSearch,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";

type PolicySection = {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
  icon: LucideIcon;
};
type Highlight = { title: string; description: string; icon: LucideIcon };

const highlights: Highlight[] = [
  {
    title: "Zero AI Model Training",
    description:
      "Your enterprise data and feature vectors are never used to train foundational AI or LLM models.",
    icon: ShieldCheck,
  },
  {
    title: "Zero-Copy In-Memory Isolation",
    description:
      "Data transforms execute inside ephemeral GPU VRAM buffers and are purged after the pipeline run.",
    icon: HardDrive,
  },
  {
    title: "Sovereign Regional Storage",
    description:
      "Deploy pipelines in specific geographic jurisdictions including US East, EU Frankfurt, and APAC nodes.",
    icon: Globe2,
  },
  {
    title: "SOC 2 & Encryption at Rest",
    description:
      "The policy framework covers AES-256 encryption at rest and TLS 1.3 in transit across ingestion nodes.",
    icon: LockKeyhole,
  },
];

const sections: PolicySection[] = [
  {
    id: "information-collected",
    title: "Information We Collect",
    summary:
      "We collect the information needed to operate accounts, provide support, secure the platform, and deliver contracted data workflows.",
    icon: CircleUserRound,
    paragraphs: [
      "Account and contact information may include names, business email addresses, organization details, workspace settings, support correspondence, and billing administration details.",
      "Customers may submit datasets, schemas, pipeline configurations, prompts, derived artifacts, and feature representations for processing. Customers determine the purpose and lawful basis for those submissions.",
    ],
  },
  {
    id: "ephemeral-processing",
    title: "Ephemeral GPU Data Processing Architecture",
    summary:
      "The platform is designed to process transformation workloads in isolated, short-lived memory contexts.",
    icon: Cpu,
    paragraphs: [
      "Where the selected deployment supports it, pipeline transforms use ephemeral CPU, RAM, and GPU VRAM buffers, including Apache Arrow-compatible in-memory representations. Processing buffers are cleared after the relevant run according to the configured execution and retention policy.",
      "Temporary operational copies may exist when required for orchestration, retries, security, backup, or audit operations. The applicable deployment and order terms define those exceptions and retention windows.",
    ],
  },
  {
    id: "account-telemetry",
    title: "How We Use Account Telemetry",
    summary:
      "Telemetry helps operate, secure, troubleshoot, and improve the contracted service without becoming a training corpus for public models.",
    icon: ScanSearch,
    paragraphs: [
      "Account telemetry may include login and access events, pipeline execution metadata, resource utilization, error traces, configuration changes, latency, throughput, and support diagnostics.",
      "We use telemetry to provide service visibility, detect abuse and security incidents, measure reliability, produce billing records, and improve platform operations. We do not use customer datasets, feature vectors, or private content to train public foundation models.",
    ],
  },
  {
    id: "data-isolation",
    title: "Data Isolation & Single-Tenant VPC Options",
    summary:
      "Enterprise deployments can use stronger isolation boundaries and region-specific operating models.",
    icon: Cloud,
    paragraphs: [
      "Depending on the contracted architecture, workloads may run in shared service boundaries, isolated environments, or single-tenant VPC and private-cluster deployments. Access controls, network boundaries, encryption, and administrative separation are selected during deployment review.",
      "Regional placement may be requested for supported environments. Customers remain responsible for confirming that the selected region and deployment model satisfy their legal, regulatory, and contractual requirements.",
    ],
  },
  {
    id: "subprocessors",
    title: "Third-Party Integrations & Subprocessors",
    summary:
      "The service may rely on infrastructure and delivery providers to provide networking, compute, storage, and platform operations.",
    icon: Network,
    paragraphs: [
      "The reference infrastructure model may include Cloudflare for CDN and edge delivery, AWS for cloud infrastructure and storage services, and NVIDIA infrastructure or GPU technologies for accelerated workloads. Specific subprocessors and services depend on the customer deployment and contract.",
      "We use contractual, technical, and operational controls appropriate to the service relationship. Enterprise customers may request additional subprocessor, region, and security information through the DPO or security contact.",
    ],
  },
  {
    id: "privacy-rights",
    title: "Your Rights under GDPR & CCPA",
    summary:
      "Depending on applicable law and role, individuals may request access, correction, deletion, portability, restriction, or objection regarding personal information.",
    icon: FileKey2,
    paragraphs: [
      "To submit a data subject access request, email info@datasculpt.lk with your identity, organization, request type, affected account or data scope, and preferred response channel. We may verify identity and authority before responding.",
      "We will assess requests under applicable law, respond within the required period, and explain any lawful limitation or exception. Requests may also be made through an authorized representative where applicable.",
    ],
  },
  {
    id: "retention-deletion",
    title: "Data Retention & Permanent Deletion",
    summary:
      "Retention depends on service delivery, customer configuration, security, billing, legal, and audit requirements.",
    icon: Trash2,
    paragraphs: [
      "Customers may request deletion of account data, submitted content, derived artifacts, or telemetry by contacting the DPO or security team. Include the workspace, data category, requested scope, and desired completion window.",
      "Deletion requests are reviewed against backup, fraud-prevention, security, billing, dispute, and legal-retention obligations. Once required retention ends, data is deleted or irreversibly de-identified according to the applicable policy and deployment controls.",
    ],
  },
  {
    id: "security-contact",
    title: "Security Officer Contact Information",
    summary:
      "Security, privacy, incident, and data-rights questions are routed to the designated privacy and security contacts.",
    icon: Mail,
    paragraphs: [
      "Contact the Data Protection Officer at info@datasculpt.lk for privacy rights, DSAR, retention, and processing questions. Contact info@datasculpt.lk for suspected security incidents, access concerns, vulnerability reports, or enterprise security documentation.",
      "When reporting an incident, include the affected workspace, approximate time, observed behavior, and a safe callback channel. Do not include secrets, credentials, or unnecessary personal data in the initial report.",
    ],
  },
];

export default function PrivacyPage() {
  const [activeId, setActiveId] = useState(sections[0].id);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          )[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.1, 0.5] },
    );
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative mx-auto max-w-7xl px-5 pb-24 pt-10 lg:px-8 lg:pt-14">
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-4xl text-center"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-brand-300"
        >
          <span>Home</span>
          <ChevronRight size={14} />
          <span className="text-brand-300">Privacy Policy</span>
        </Link>
        <div className="mt-8">
          <span className="inline-flex rounded-full border border-brand-500/30 bg-brand-950/40 px-3.5 py-1.5 font-mono text-xs tracking-[0.16em] text-brand-400">
            DATA PRIVACY &amp; SECURITY GUARANTEES
          </span>
        </div>
        <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
          Privacy &amp; Data Protection Policy
        </h1>
        <p className="mt-4 font-mono text-sm text-slate-500">
          Last Updated: August 2026{" "}
          <span className="mx-2 text-brand-500">|</span> SOC 2 Type II &amp;
          GDPR Compliant Framework
        </p>
      </motion.header>
      <section className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((highlight, index) => (
          <HighlightCard
            key={highlight.title}
            highlight={highlight}
            index={index}
          />
        ))}
      </section>
      <div className="mt-16 grid items-start gap-10 lg:grid-cols-[0.27fr_0.73fr] lg:gap-14">
        <aside className="lg:sticky lg:top-8">
          <div className="mb-4 flex items-center gap-2">
            <FileKey2 size={16} className="text-brand-300" />
            <p className="eyebrow">PRIVACY TOPICS</p>
          </div>
          <nav aria-label="Privacy policy sections" className="space-y-1">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`block border-l-2 px-3 py-2 text-sm transition ${activeId === section.id ? "border-brand-400 bg-brand-950/20 font-medium text-brand-300" : "border-slate-800 text-slate-500 hover:border-brand-500/40 hover:text-brand-300"}`}
              >
                {section.title}
              </a>
            ))}
          </nav>
        </aside>
        <main className="min-w-0">
          <div className="mb-8 flex gap-3 rounded-xl border-l-4 border-brand-400 bg-brand-950/20 p-5 text-sm leading-6 text-slate-300">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-brand-300" />
            <p>
              <strong className="text-brand-300">Policy framework:</strong> This
              page describes the intended privacy and security model for
              DataSculpt. Qualified privacy and security counsel should review
              it against the final deployment, contract, and applicable
              jurisdiction before publication or reliance.
            </p>
          </div>
          <div className="space-y-10">
            {sections.map((section) => (
              <PrivacySection key={section.id} section={section} />
            ))}
          </div>
          <GlassCard className="mt-12 border-brand-500/30 p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="eyebrow">DATA PROTECTION OFFICER</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Privacy and security questions have a direct path.
                </h2>
                <div className="mt-4 space-y-2 text-sm">
                  <a
                    href="mailto:dpo@datasculpt.lk"
                    className="flex items-center gap-2 text-brand-300 hover:text-brand-200"
                  >
                    <Mail size={15} />
                    info@datasculpt.lk
                  </a>
                  <a
                    href="mailto:info@datasculpt.lk"
                    className="flex items-center gap-2 text-brand-300 hover:text-brand-200"
                  >
                    <Mail size={15} />
                    info@datasculpt.lk
                  </a>
                </div>
              </div>
              <div className="space-y-4 md:text-right">
                <StatusBadge>
                  <ShieldCheck size={13} />
                  SOC 2 TYPE II READY | ISO 27001 AUDITED
                </StatusBadge>
                <p className="max-w-sm text-xs leading-5 text-slate-500">
                  Reference status language subject to final audit and
                  enterprise documentation.
                </p>
              </div>
            </div>
          </GlassCard>
        </main>
      </div>
    </div>
  );
}

function HighlightCard({
  highlight,
  index,
}: {
  highlight: Highlight;
  index: number;
}) {
  const Icon = highlight.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <GlassCard className="h-full p-5 transition hover:border-brand-500/50">
        <span className="grid h-10 w-10 place-items-center rounded-lg border border-brand-500/30 bg-brand-400/10 text-brand-300">
          <Icon size={19} />
        </span>
        <h2 className="mt-5 text-base font-semibold text-white">
          {highlight.title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          {highlight.description}
        </p>
      </GlassCard>
    </motion.div>
  );
}
function PrivacySection({ section }: { section: PolicySection }) {
  const Icon = section.icon;
  return (
    <motion.section
      id={section.id}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="scroll-mt-8"
    >
      <div className="flex items-start gap-4">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-brand-500/30 bg-brand-400/10 text-brand-300">
          <Icon size={18} />
        </span>
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {section.title}
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-400">
            {section.summary}
          </p>
        </div>
      </div>
      <div className="mt-5 space-y-4 border-l border-slate-800 pl-5 text-sm leading-7 text-slate-300 sm:pl-14">
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        {section.id === "information-collected" && (
          <PrivacyCallout>
            No public-model training: customer datasets, private content, and
            feature vectors are not used to train public foundational AI or LLM
            models.
          </PrivacyCallout>
        )}
        {section.id === "ephemeral-processing" && (
          <PrivacyCallout>
            Processing boundary: ephemeral GPU buffers are designed to be purged
            after the relevant run, subject to documented operational, backup,
            security, and legal-retention exceptions.
          </PrivacyCallout>
        )}
        {section.id === "data-isolation" && (
          <PrivacyCallout>
            Regional control: customers can request supported geographic and
            single-tenant deployment options during architecture and contracting
            review.
          </PrivacyCallout>
        )}
        {section.id === "retention-deletion" && (
          <PrivacyCallout>
            Deletion request: email the DPO or security team with the workspace,
            data category, requested scope, and preferred response channel so
            the request can be verified and processed.
          </PrivacyCallout>
        )}
      </div>
    </motion.section>
  );
}
function PrivacyCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-r-xl border-l-4 border-brand-400 bg-slate-900/90 p-5 text-sm leading-6 text-slate-300">
      <span className="font-semibold text-brand-300">
        Plain-English summary:{" "}
      </span>
      {children}
    </div>
  );
}
