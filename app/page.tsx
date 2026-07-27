"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, CheckCircle2, ScanText, ShieldCheck } from "lucide-react";
import { InputCard } from "@/components/documentation/InputCard";
import { OutputCards } from "@/components/documentation/OutputCards";

export default function HomeWorkspacePage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative isolate min-h-[calc(100vh-76px)] overflow-hidden bg-[#f4f4f0]">
      <WorkbenchBackground reducedMotion={Boolean(reduceMotion)} />

      <section className="relative z-10 mx-auto w-full max-w-[1760px] px-4 pb-12 pt-7 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mb-8 grid gap-8 border-b border-black/15 pb-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end"
        >
          <div>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 border border-black bg-black px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                <ScanText className="h-3.5 w-3.5 text-[#86bc25]" />
                Support intelligence workspace
              </span>
              <span className="inline-flex items-center gap-2 border border-black/15 bg-white/75 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black/65">
                <ShieldCheck className="h-3.5 w-3.5" />
                Transcript-grounded
              </span>
            </div>

            <h1 className="max-w-5xl text-balance text-[clamp(3rem,7vw,7.4rem)] font-extrabold leading-[0.84] tracking-[-0.075em] text-[#111]">
              Turn support noise
              <span className="block text-[#5d810e]">into clear notes.</span>
            </h1>
          </div>

          <div className="border-l-4 border-[#86bc25] pl-5">
            <p className="text-pretty text-base leading-7 text-black/68">
              Paste the complete chat, call, Zoom, or screen-sharing interaction. The tool removes conversational filler and produces accurate, concise ServiceNow-ready documentation without inventing outcomes.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-px bg-black/15">
              {["Issue & impact", "Actions by owner", "Links & purpose", "Outcome & next step"].map((item) => (
                <div key={item} className="flex items-center gap-2 bg-[#f4f4f0] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-black/65">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#5d810e]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mb-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-black/45">
          <span>01 · Source interaction</span>
          <ArrowDown className="h-3 w-3" />
          <span>02 · Structured documentation</span>
        </div>

        <div className="grid items-stretch gap-4 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <InputCard />
          <OutputCards />
        </div>
      </section>
    </div>
  );
}

function WorkbenchBackground({ reducedMotion }: { reducedMotion: boolean }) {
  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 24, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#f4f4f0]" />
      <div className="absolute inset-0 opacity-[0.38] [background-image:linear-gradient(rgba(17,17,17,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.055)_1px,transparent_1px)] [background-size:48px_48px]" />

      <motion.div
        className="absolute right-[-8%] top-[2%] h-[360px] w-[360px] rounded-full bg-[#86bc25]/18 blur-[90px]"
        animate={reducedMotion ? undefined : { x: [0, -28, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={transition}
      />
      <div className="absolute -left-16 top-[36%] h-44 w-44 rotate-12 border-[28px] border-black/[0.025]" />
    </div>
  );
}
