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
        <div className="relative min-h-[700px] overflow-hidden rounded-[2rem] border border-[#1e293b] bg-[#090d16] shadow-2xl sm:min-h-[620px] lg:min-h-[560px]">
          <div
            className="absolute inset-0 bg-cover bg-[center_35%] opacity-85"
            style={{ backgroundImage: "url('/images/22.jpg')" }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,rgba(9,13,22,0.96)_0%,rgba(9,13,22,0.78)_48%,rgba(9,13,22,0.25)_100%)]"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,13,22,0.9)_0%,rgba(9,13,22,0.3)_40%,transparent_100%)]"
            aria-hidden="true"
          />
          <div className="relative z-10 flex min-h-[700px] flex-col p-6 sm:min-h-[620px] sm:p-10 lg:min-h-[560px] lg:p-14">
            <Reveal>
              <div className="max-w-xl">
                <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#fbbf24]">
                  THE VALUE OF A BETTER FOUNDATION
                </p>
                <h2
                  id="outcomes-title"
                  className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-[#ffffff] sm:text-5xl"
                >
                  The value is felt across the business.
                </h2>
                <p className="mt-5 max-w-lg text-base leading-7 text-[#e2e8f0]">
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
                    className="group h-full rounded-2xl border border-[#1e293b]/90 bg-[#0f172a]/85 p-5 shadow-2xl backdrop-blur-md transition hover:border-[#f59e0b]/70 hover:bg-[#0f172a]/95"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span
                        className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#f59e0b] shadow-[0_0_14px_rgba(245,158,11,0.6)]"
                        aria-hidden="true"
                      />
                      <ArrowUpRight
                        size={17}
                        className="text-[#fbbf24] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-6 text-lg font-semibold leading-6 text-[#ffffff]">
                      {outcome.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-[#cbd5e1]">
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
