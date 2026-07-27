"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ClipboardCheck,
  Copy,
  FileText,
  Layers3,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore, type DocumentationOutput } from "@/store/useAppStore";

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function cleanEntry(value: string): string {
  return value
    .replace(/\r/g, " ")
    .split(/\n+/)
    .map((line) => line.trim().replace(/^\s*[>•*\-\d.)]+\s*/, ""))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function workNotesText(output: DocumentationOutput): string {
  return [
    "WORK NOTES",
    "",
    "Issue:",
    `> ${cleanEntry(output.workNotes.issue)}`,
    "",
    "TS Performed:",
    ...output.workNotes.tsPerformed.map((item) => `> ${normalize(item)}`),
  ].join("\n");
}

function allNotesText(output: DocumentationOutput): string {
  return workNotesText(output);
}

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export function OutputCards() {
  const output = useAppStore((state) => state.output);
  const isGenerating = useAppStore((state) => state.isGenerating);
  const [copied, setCopied] = React.useState<"work" | "all" | null>(null);

  const copy = React.useCallback(
    async (target: "work" | "all") => {
      if (!output) return;
      const text = target === "work" ? workNotesText(output) : allNotesText(output);

      try {
        await writeClipboard(text);
        setCopied(target);
        window.setTimeout(() => setCopied(null), 1900);
      } catch {
        setCopied(null);
      }
    },
    [output],
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.06, ease: "easeOut" }}
      className="relative isolate min-h-[640px] overflow-hidden border border-black bg-[#111] text-white shadow-[8px_8px_0_#86bc25] transition-[background-color,border-color] duration-300 dark:border-white/20 dark:bg-[#050605]"
      aria-labelledby="results-heading"
    >
      <ResultsBackdrop />

      <div className="relative z-10 flex min-h-[640px] flex-col p-5 sm:p-6 lg:p-7">
        <div className="mb-5 flex flex-col gap-4 border-b border-white/25 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] shadow-[0_12px_30px_-22px_rgba(0,0,0,0.72)] dark:rounded-none">
                <Layers3 className="h-4.5 w-4.5 text-[#86bc25]" strokeWidth={1.8} />
              </div>
              <div>
                <h2 id="results-heading" className="text-base font-black uppercase tracking-[-0.025em] text-white sm:text-lg">
                  Generated Work Notes
                </h2>
                <p className="mt-0.5 text-xs text-white/50">Professional, transcript-grounded ITSM documentation.</p>
              </div>
            </div>
          </div>

          <Button
            type="button"
            onClick={() => void copy("all")}
            disabled={!output || isGenerating}
            className="h-11 rounded-none border border-[#86bc25] bg-[#86bc25] px-5 font-black uppercase text-black shadow-[4px_4px_0_rgba(255,255,255,0.18)] hover:-translate-y-0.5 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[#86bc25]/60 disabled:opacity-35"
          >
            {copied === "all" ? <Check className="h-4 w-4" /> : <ClipboardCheck className="h-4 w-4" />}
            {copied === "all" ? "Copied successfully" : "Copy All Notes"}
          </Button>
        </div>

        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-1 items-center justify-center"
            >
              <AnalysisLoader />
            </motion.div>
          ) : output ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-1 flex-col gap-4"
            >
              <NotesCard
                title="Work Notes"
                icon={FileText}
                accent="blue"
                action={
                  <CopyButton
                    label="Copy Work Notes"
                    copied={copied === "work"}
                    onClick={() => void copy("work")}
                  />
                }
              >
                <AlignedSection label="Issue">
                  <QuoteLines lines={[cleanEntry(output.workNotes.issue)]} />
                </AlignedSection>

                <AlignedSection label="TS Performed">
                  <QuoteLines lines={output.workNotes.tsPerformed.map(normalize)} />
                </AlignedSection>
              </NotesCard>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 items-center justify-center"
            >
              <EmptyState />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {copied && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-200 bg-white/92 px-4 py-2.5 text-xs font-medium text-emerald-700 shadow-xl backdrop-blur-xl dark:rounded-none dark:border-[#86bc25]/55 dark:bg-[#0a0d09]/95 dark:text-[#b9df73]"
          >
            <Check className="h-3.5 w-3.5" />
            Copied successfully
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

type NotesCardProps = {
  title: string;
  icon: React.ElementType;
  accent: "blue" | "orange";
  action: React.ReactNode;
  children: React.ReactNode;
};

function NotesCard({ title, icon: Icon, accent, action, children }: NotesCardProps) {
  const tones =
    accent === "blue"
      ? {
          icon: "text-[#86bc25]",
          glow: "from-[#86bc25]/12 via-white/5 to-transparent",
          line: "via-[#86bc25]/50",
        }
      : {
          icon: "text-[#86bc25]",
          glow: "from-[#86bc25]/12 via-white/5 to-transparent",
          line: "via-[#86bc25]/44",
        };

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25 }}
      className="group relative overflow-hidden border border-white/25 bg-white/[0.055] shadow-[5px_5px_0_rgba(134,188,37,0.12)] dark:bg-[#0b0e0a]"
    >
      <div aria-hidden className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tones.glow}`} />
      <div aria-hidden className={`pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent ${tones.line} to-transparent`} />
      <div className="relative z-10 border-b border-white/12 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] dark:rounded-none">
              <Icon className={`h-4.5 w-4.5 ${tones.icon}`} strokeWidth={1.8} />
            </div>
            <h3 className="font-black uppercase tracking-[-0.02em] text-white">{title}</h3>
          </div>
          {action}
        </div>
      </div>
      <div className="relative z-10 space-y-5 px-5 py-5 text-sm leading-6 text-white/75">{children}</div>
    </motion.article>
  );
}

function AlignedSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-2 border-b border-white/10 pb-4 last:border-b-0 last:pb-0 md:grid-cols-[148px_minmax(0,1fr)] md:gap-5">
      <h4 className="pt-0.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">{label}</h4>
      <div>{children}</div>
    </section>
  );
}

function QuoteLines({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-2.5">
      {lines.map((line, index) => (
        <p key={`${line}-${index}`} className="flex items-start gap-2.5 text-[14px] leading-7 text-white/75">
          <span className="mt-[1px] font-semibold text-[#86bc25]">&gt;</span>
          <span className="flex-1">{line}</span>
        </p>
      ))}
    </div>
  );
}

function CopyButton({ label, copied, onClick }: { label: string; copied: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-9 items-center gap-2 border border-white/20 bg-white/[0.08] px-3 font-mono text-[10px] font-bold uppercase text-white/70 transition hover:border-[#86bc25] hover:bg-[#86bc25] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86bc25]/35"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-sm px-5 text-center">
      <div className="relative mx-auto mb-7 h-36 w-36 [perspective:700px]" aria-hidden>
        <motion.div
          className="absolute inset-3 rounded-[34px] border border-[#86bc25]/40 bg-gradient-to-br from-[#86bc25]/12 via-white/[0.035] to-[#86bc25]/12 shadow-[0_0_70px_rgba(134,188,37,0.12)] [transform-style:preserve-3d]"
          animate={{ rotateX: [58, 68, 58], rotateZ: [-8, 8, -8], y: [0, -5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-8 rounded-[24px] border border-white/20 bg-white/[0.08] [transform-style:preserve-3d]"
          animate={{ rotateY: [0, 180, 360], rotateX: [20, -20, 20] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-7 w-7 text-white/75" strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white">Your notes will appear here</h3>
      <p className="mt-2 text-sm leading-6 text-white/50">
        Paste a transcript or summary, then analyze the interaction to generate concise Work Notes.
      </p>
    </div>
  );
}

function ResultsBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(134,188,37,0.09),transparent_24%),radial-gradient(circle_at_76%_18%,rgba(255,255,255,0.035),transparent_18%),radial-gradient(circle_at_52%_68%,rgba(93,129,14,0.08),transparent_20%)]" />
    </div>
  );
}

function AnalysisLoader() {
  return (
    <div className="flex flex-col items-center justify-center px-6 text-center">
      <div className="relative mb-7 h-28 w-28 [perspective:800px]" aria-hidden>
        <motion.div
          className="absolute inset-0 rounded-[34px] border border-[#86bc25]/40 bg-gradient-to-br from-[#86bc25]/10 via-white/[0.035] to-[#86bc25]/14 [transform-style:preserve-3d]"
          animate={{ rotateX: [58, 70, 58], rotateY: [0, 20, 0], y: [0, -8, 0] }}
          transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-[18%] rounded-[26px] border border-white/20 bg-white/[0.08] [transform-style:preserve-3d]"
          animate={{ rotateY: [0, 180, 360], rotateX: [20, -20, 20] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <h3 className="text-lg font-semibold text-white">Analyzing interaction</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-white/50">
        Creating transcript-grounded Work Notes.
      </p>
    </div>
  );
}
