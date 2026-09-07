"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { aiOutcomes } from "./homeData";
import { Reveal } from "./Reveal";
import Image from "next/image";

export function AIOutcomes() {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);
  const phrases = [
    "Find what matters.",
    "See what’s next.",
    "Understand every signal.",
    "Act with confidence.",
  ];
  return (
    <section
      aria-labelledby="ai-outcomes-title"
      className="-mt-20 overflow-hidden bg-yellow-50 lg:-mt-28"
    >
      <div className="grid items-stretch lg:grid-cols-2">
        <div className="order-2 px-5 sm:px-10 lg:order-1 lg:px-[max(2rem,calc((100vw-80rem)/2))] lg:py-28">
          <Reveal>
            <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-brand-600">
              AI-READY BY DESIGN
            </p>
            <h2
              id="ai-outcomes-title"
              className="mt-4 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-[#0f172a] sm:text-5xl"
            >
              Make AI useful from the foundation up.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#334155]">
              DataSculpt helps teams prepare trusted information for the moments
              when better answers, clearer forecasts, and confident action
              matter most.
            </p>
            <Button href="/products/" variant="ghost" className="mt-7">
              See how the platform helps <ArrowRight size={15} />
            </Button>
          </Reveal>
          <div className="mt-14 space-y-3 sm:mt-20">
            {aiOutcomes.map(([title, description, icon], index) => (
              <motion.article
                key={title}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
                className={`border-l-2 px-5 py-7 transition sm:px-7 ${hovered === index ? "border-brand-500 bg-white/85 shadow-panel" : "border-brand-200/80 bg-white/55 hover:border-brand-300 hover:bg-white/75"}`}
                whileHover={reducedMotion ? undefined : { x: 4 }}
              >
                <span className="flex items-start gap-4">
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${hovered === index ? "border-brand-500 bg-brand-500 text-slate-950" : "border-brand-200 bg-brand-50 text-brand-700"}`}
                  >
                    <Image src={icon} alt={title} width={34} height={34} />
                  </span>
                  <span>
                    <span className="block text-xl font-semibold text-[#0f172a]">
                      {title}
                    </span>
                    <span className="mt-2 block max-w-lg text-sm leading-6 text-[#475569]">
                      {description}
                    </span>
                  </span>
                </span>
              </motion.article>
            ))}
          </div>
        </div>
        <div className="order-1 flex items-center justify-center p-6 sm:p-10 lg:order-2 lg:py-20 lg:pr-[max(2rem,calc((100vw-80rem)/2))]">
          <div className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-brand-300/80 bg-[#ffffff] shadow-2xl">
            <div className="relative aspect-[322/500] w-full overflow-hidden bg-[#fbfaf5]">
              <Image
                src="/images/20.webp"
                alt="AI Data Engineering and Transformation"
                fill
                sizes="(min-width: 1024px) 448px, 90vw"
                className="object-cover object-top"
                priority
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,13,22,0.85)_0%,rgba(9,13,22,0.2)_45%,transparent_100%)]" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={hovered ?? "default"}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: reducedMotion ? 0 : 0.2 }}
                  className="absolute bottom-6 left-6 right-6 z-10 rounded-2xl border border-white/20 bg-black/65 p-5 shadow-2xl backdrop-blur-md"
                >
                  <p className="font-mono text-[0.62rem] font-semibold tracking-[0.2em] text-[#fbbf24]">
                    AI-READY FOUNDATION
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[#ffffff]">
                    {hovered === null
                      ? "Trusted data for what comes next."
                      : phrases[hovered]}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
