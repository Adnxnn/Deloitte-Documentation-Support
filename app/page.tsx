"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowDown,
  CheckCircle2,
  Circle,
  Command,
  ScanText,
  ShieldCheck,
} from "lucide-react";
import { InputCard } from "@/components/documentation/InputCard";
import { OutputCards } from "@/components/documentation/OutputCards";

export default function HomeWorkspacePage() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative isolate min-h-[calc(100vh-76px)] overflow-hidden bg-[#eceee8]">
      <WorkbenchBackground reducedMotion={Boolean(reduceMotion)} />

      <section className="relative z-10 mx-auto w-full max-w-[1840px] px-3 pb-12 pt-5 sm:px-5 lg:px-7">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
          className="relative mb-4 overflow-hidden border border-black bg-[#dfe3da] shadow-[8px_8px_0_#111]"
        >
          <div className="grid min-h-[400px] lg:grid-cols-[minmax(0,1fr)_430px]">
            <div className="relative z-10 flex flex-col justify-between border-b border-black p-5 sm:p-7 lg:border-b-0 lg:border-r lg:p-9">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 bg-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white">
                  <ScanText className="h-3.5 w-3.5 text-[#86bc25]" />
                  Support intelligence workspace
                </span>
                <span className="inline-flex items-center gap-2 border border-black bg-[#f5f6f2] px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-black">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#86bc25] opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5d810e]" />
                  </span>
                  Engine ready
                </span>
              </div>

              <div className="py-10 sm:py-14">
                <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-black/55">
                  From conversation / To evidence
                </p>
                <h1 className="max-w-6xl text-balance font-display text-[clamp(3.6rem,8.6vw,9.5rem)] font-black uppercase leading-[0.72] tracking-[-0.085em] text-[#111]">
                  Support
                  <span className="block translate-x-[0.04em] text-[#5d810e]">Noise→Notes</span>
                </h1>
              </div>

              <div className="grid gap-px border border-black bg-black sm:grid-cols-4">
                {["Issue + impact", "Actions + owners", "Links + purpose", "Outcome + next"].map((item, index) => (
                  <div key={item} className="group flex items-center gap-2 bg-[#f5f6f2] px-3 py-3 text-[10px] font-black uppercase tracking-[0.08em] text-black transition-colors hover:bg-[#86bc25]">
                    <span className="font-mono text-black/45">0{index + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[360px] overflow-hidden bg-[#111] p-6 text-white lg:min-h-full">
              <DocumentOrb reducedMotion={Boolean(reduceMotion)} />
              <div className="relative z-20 flex h-full flex-col justify-between">
                <div className="flex items-center justify-between font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/45">
                  <span>DDST / Spatial processor</span>
                  <span className="text-[#86bc25]">Live</span>
                </div>
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <Command className="h-5 w-5 text-[#86bc25]" />
                    <span className="h-px flex-1 bg-white/20" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/45">Evidence in motion</span>
                  </div>
                  <p className="text-pretty text-sm leading-6 text-white/62">
                    Paste a complete chat, call, Zoom, or screen-sharing interaction. The system removes filler and produces concise, ServiceNow-ready documentation without inventing outcomes.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div aria-hidden className="absolute -bottom-10 left-[42%] hidden text-[180px] font-black leading-none tracking-[-0.12em] text-black/[0.025] lg:block">
            360
          </div>
        </motion.div>

        <div className="mb-3 flex items-center gap-3 border-x border-t border-black bg-[#111] px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/55">
          <Circle className="h-2.5 w-2.5 fill-[#86bc25] text-[#86bc25]" />
          <span className="text-white">01 / Source interaction</span>
          <ArrowDown className="h-3 w-3 text-[#86bc25]" />
          <span>02 / Structured documentation</span>
          <span className="ml-auto hidden sm:block">Accuracy protocol active</span>
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
      <div className="absolute inset-0 bg-[#eceee8]" />
      <div className="absolute inset-0 opacity-[0.5] [background-image:linear-gradient(rgba(17,17,17,0.065)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.065)_1px,transparent_1px)] [background-size:36px_36px]" />

      <motion.div
        className="absolute right-[-8%] top-[2%] h-[360px] w-[360px] rounded-full bg-[#86bc25]/18 blur-[90px]"
        animate={reducedMotion ? undefined : { x: [0, -28, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
        transition={transition}
      />
      <div className="absolute -left-16 top-[36%] h-44 w-44 rotate-12 border-[28px] border-black/[0.025]" />
    </div>
  );
}

function DocumentOrb({ reducedMotion }: { reducedMotion: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 20 });
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-13, 13]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [11, -11]);

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <div
      aria-hidden
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="absolute inset-0 z-10 flex items-center justify-center [perspective:1100px]"
    >
      <motion.div
        style={reducedMotion ? undefined : { rotateX, rotateY }}
        className="relative h-56 w-56 [transform-style:preserve-3d] sm:h-64 sm:w-64"
      >
        {[0, 1, 2, 3].map((layer) => (
          <motion.div
            key={layer}
            className="absolute inset-0 border border-white/30 bg-[#1a1a1a]/92 p-5 shadow-[0_28px_70px_rgba(0,0,0,0.45)] [backface-visibility:hidden]"
            style={{
              transform: `translate3d(${layer * 13 - 20}px, ${layer * -13 + 20}px, ${layer * 18}px) rotateZ(${layer * 2.5 - 4}deg)`,
            }}
            animate={reducedMotion ? undefined : { y: [0, -5 - layer * 2, 0] }}
            transition={{ duration: 4.5 + layer * 0.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="mb-8 flex items-center justify-between">
              <span className="h-2 w-2 rounded-full bg-[#86bc25]" />
              <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">Layer 0{layer + 1}</span>
            </div>
            <div className="space-y-3">
              <span className="block h-1.5 w-2/3 bg-white/70" />
              <span className="block h-1.5 w-full bg-white/15" />
              <span className="block h-1.5 w-5/6 bg-white/15" />
              <span className="block h-1.5 w-4/6 bg-white/15" />
            </div>
            <div className="absolute bottom-5 left-5 right-5 border-t border-white/15 pt-4">
              <div className="flex items-center justify-between">
                <CheckCircle2 className="h-4 w-4 text-[#86bc25]" />
                <ShieldCheck className="h-4 w-4 text-white/35" />
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
