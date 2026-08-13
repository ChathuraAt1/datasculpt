"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

const outcomes = [
  {
    title: "Move from raw data to usable insight faster",
    description:
      "Give teams a clearer path from information to the decisions that matter.",
  },
  {
    title: "Build confidence into every data workflow",
    description:
      "Make quality and clarity part of the work, not a final checkpoint.",
  },
  {
    title: "Give AI teams cleaner, better-prepared foundations",
    description:
      "Help useful AI begin with information people can understand and trust.",
  },
] as const;

export function OutcomeStatements() {
  const reducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="outcomes-title"
      className="px-5 py-20 lg:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative min-h-[700px] overflow-hidden rounded-[2rem] border border-brand-200 bg-brand-100 shadow-panel sm:min-h-[620px] lg:min-h-[560px]">
          <div
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-br from-yellow-50/95 via-yellow-50/60 to-brand-200/65"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-900/35 via-transparent to-yellow-50/25"
            aria-hidden="true"
          />
          <div className="relative z-10 flex min-h-[700px] flex-col p-6 sm:min-h-[620px] sm:p-10 lg:min-h-[560px] lg:p-14">
            <Reveal>
              <div className="max-w-xl">
                <p className="eyebrow">THE VALUE OF A BETTER FOUNDATION</p>
                <h2
                  id="outcomes-title"
                  className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-slate-800 sm:text-5xl"
                >
                  The value is felt across the business.
                </h2>
                <p className="mt-5 max-w-lg text-base leading-7 text-slate-700">
                  When information is easier to trust and use, teams can spend
                  more energy moving the business forward.
                </p>
              </div>
            </Reveal>
            <div className="mt-auto grid gap-3 pt-16 md:grid-cols-2 lg:grid-cols-3">
              {outcomes.map((outcome, index) => (
                <Reveal key={outcome.title} delay={index * 0.1}>
                  <motion.div
                    whileHover={reducedMotion ? undefined : { y: -6 }}
                    transition={{ duration: reducedMotion ? 0 : 0.22 }}
                    className="group h-full rounded-2xl border border-white/80 bg-white/90 p-5 shadow-panel backdrop-blur-md transition hover:border-brand-400 hover:shadow-brand"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand-400 shadow-[0_0_14px_rgba(183,121,0,0.45)]"
                        aria-hidden="true"
                      />
                      <ArrowUpRight
                        size={17}
                        className="text-brand-500 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold leading-6 text-slate-800">
                      {outcome.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {outcome.description}
                    </p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
