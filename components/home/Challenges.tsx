"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { challenges } from "./homeData";
import { Reveal } from "./Reveal";
import Image from "next/image";

export function Challenges() {
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  return (
    <section
      aria-labelledby="challenge-title"
      className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28"
    >
      <div className="grid items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <Reveal>
          <div className="relative min-h-[500px] overflow-hidden rounded-[2rem] border border-[#1e293b] bg-[#090d16] p-7 shadow-2xl sm:min-h-[560px] sm:p-10">
            <div
              className="absolute inset-0 bg-cover bg-[center_top] opacity-85"
              style={{ backgroundImage: "url('/images/18.jpg')" }}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(to_top,#090d16_0%,rgba(9,13,22,0.82)_45%,rgba(9,13,22,0.35)_100%)]"
              aria-hidden="true"
            />
            <div className="relative z-10 flex h-full min-h-[440px] flex-col">
              <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-[#fbbf24]">
                WHY TEAMS LOOK FOR A BETTER WAY
              </p>
              <h2
                id="challenge-title"
                className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-[#ffffff] sm:text-4xl"
              >
                Complexity is the cost of disconnected data.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[#e2e8f0]">
                Your teams should be building what comes next — not repeatedly
                preparing the same information.
              </p>
              <div className="mt-auto rounded-xl border border-[#d97706]/40 bg-[#0f172a]/90 p-5 backdrop-blur-md">
                <div className="border-l-2 border-[#f59e0b] pl-4">
                  <p className="text-sm font-semibold text-[#fef3c7]">
                    A clearer foundation creates momentum.
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#cbd5e1]">
                    Bring the important pieces together, then give every team a
                    more dependable way to work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
        <div className="space-y-3">
          {challenges.map(
            ({ label, title, description, icon: icon }, index) => {
              const active = selected === index;
              return (
                <Reveal key={title} delay={index * 0.08}>
                  <motion.button
                    type="button"
                    onClick={() => setSelected(index)}
                    aria-pressed={active}
                    whileHover={reducedMotion ? undefined : { x: 7 }}
                    className={`group relative block w-full overflow-hidden rounded-2xl border p-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 sm:p-6 ${active ? "border-brand-400 bg-white/90 shadow-brand" : "border-brand-100 bg-white/60 opacity-75 hover:border-brand-300/70 hover:opacity-100"}`}
                  >
                    <span
                      className="absolute inset-y-0 left-0 w-1 bg-brand-400"
                      aria-hidden="true"
                    />
                    <span className="flex items-start gap-4">
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${active ? "bg-brand-400 text-slate-950" : "bg-brand-100 text-brand-600"}`}
                      >
                        <Image src={icon} alt={title} width={34} height={34} />
                      </span>
                      <span>
                        <span className="block font-mono text-[0.62rem] font-semibold tracking-[0.16em] text-brand-600">
                          {label}
                        </span>
                        <span className="mt-2 block text-xl font-semibold text-slate-800">
                          {title}
                        </span>
                        <span className="mt-2 block text-sm leading-6 text-slate-500">
                          {description}
                        </span>
                      </span>
                    </span>
                  </motion.button>
                </Reveal>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}
