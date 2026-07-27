"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowUpRight,
  FileText,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore, type DocumentationOutput, type GenerationStep } from "@/store/useAppStore";

const MAX_TRANSCRIPT_LENGTH = 60_000;

export function InputCard() {
  const transcript = useAppStore((state) => state.transcript);
  const setTranscript = useAppStore((state) => state.setTranscript);
  const setOutput = useAppStore((state) => state.setOutput);
  const startGeneration = useAppStore((state) => state.startGeneration);
  const finishGeneration = useAppStore((state) => state.finishGeneration);
  const setStep = useAppStore((state) => state.setStep);
  const isGenerating = useAppStore((state) => state.isGenerating);
  const currentStep = useAppStore((state) => state.currentStep);
  const [error, setError] = React.useState<string | null>(null);

  const charCount = transcript.length;
  const isOverLimit = charCount > MAX_TRANSCRIPT_LENGTH;

  const clearTranscript = () => {
    if (isGenerating) return;
    setTranscript("");
    setOutput(null);
    setStep(null);
    setError(null);
  };

  const analyzeInteraction = React.useCallback(async () => {
    const cleanTranscript = transcript.trim();

    if (!cleanTranscript) {
      setError("Paste an interaction transcript before analyzing.");
      return;
    }

    if (isOverLimit) {
      setError("The transcript must be under 60,000 characters.");
      return;
    }

    setError(null);
    startGeneration();

    let progressStep = 1;
    const progressTimer = window.setInterval(() => {
      progressStep = Math.min(progressStep + 1, 6);
      setStep(progressStep as GenerationStep);
    }, 720);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: cleanTranscript }),
      });

      const payload = (await response.json()) as {
        output?: DocumentationOutput;
        error?: string;
      };

      if (!response.ok || !payload.output) {
        throw new Error(payload.error || "The interaction could not be analyzed.");
      }

      setOutput(payload.output);
      setStep(7);
    } catch (analysisError) {
      setOutput(null);
      setError(
        analysisError instanceof Error
          ? analysisError.message
          : "The interaction could not be analyzed. Please try again.",
      );
    } finally {
      window.clearInterval(progressTimer);
      finishGeneration();
    }
  }, [finishGeneration, isOverLimit, setOutput, setStep, startGeneration, transcript]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative isolate overflow-hidden border border-black bg-[#f7f8f4] shadow-[8px_8px_0_rgba(17,17,17,0.14)]"
      aria-labelledby="transcript-heading"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#86bc25] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-8 h-48 w-48 rounded-full bg-[#86bc25]/12 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 bottom-0 h-52 w-52 rounded-full bg-black/8 blur-3xl"
      />

      <div className="relative z-10 flex min-h-[640px] flex-col p-4 sm:p-5 lg:p-6">
        <div className="mb-4 flex items-start justify-between gap-4 border-b border-black pb-4">
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-black bg-[#86bc25]">
              <FileText className="h-5 w-5 text-black" strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <h2 id="transcript-heading" className="text-base font-black uppercase tracking-[-0.025em] text-slate-900 sm:text-lg">
                Source / Interaction
              </h2>
              <p className="mt-1 font-mono text-[10px] uppercase leading-5 tracking-[0.08em] text-slate-500">
                Include the complete support conversation for the most accurate result.
              </p>
            </div>
          </div>
          <span className="border border-black bg-white px-3 py-1.5 font-mono text-[10px] font-bold text-slate-600">
            {charCount.toLocaleString()} / {MAX_TRANSCRIPT_LENGTH.toLocaleString()}
          </span>
        </div>

        <div className="relative flex-1">
          <Textarea
            value={transcript}
            onChange={(event) => {
              setTranscript(event.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                event.preventDefault();
                void analyzeInteraction();
              }
            }}
            disabled={isGenerating}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "transcript-error" : "transcript-help"}
            placeholder="Paste the complete chat transcript, call summary, or customer interaction here…"
            className="h-full min-h-[430px] resize-none rounded-none border border-black bg-[#fffdfa]/82 px-5 py-5 text-[15px] leading-7 text-slate-800 shadow-[inset_5px_5px_0_rgba(17,17,17,0.035)] outline-none placeholder:text-slate-400 focus-visible:border-[#5d810e] focus-visible:ring-2 focus-visible:ring-[#86bc25]/40 disabled:cursor-wait disabled:opacity-65"
            spellCheck={false}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-4 bottom-4 h-20 rounded-2xl bg-gradient-to-t from-[#fffaf4] via-[#fffaf4]/82 to-transparent"
          />
          <p id="transcript-help" className="pointer-events-none absolute bottom-4 left-5 text-[11px] text-slate-400">
            Press Ctrl/⌘ + Enter to analyze
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              id="transcript-error"
              role="alert"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-4 flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: 8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 8 }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-[#d8d9ef] bg-[linear-gradient(135deg,rgba(134,188,37,0.08),rgba(134,188,37,0.07),rgba(93,129,14,0.08))] px-4 py-3.5">
                <MiniAnalyzerOrb />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-medium text-slate-800">
                      Analyzing interaction
                    </p>
                    <span className="text-[11px] text-slate-500">Step {Math.min(currentStep || 1, 6)} of 6</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/70">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-black via-[#5d810e] to-[#86bc25]"
                      animate={{ width: `${(Math.min(currentStep || 1, 6) / 6) * 100}%` }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={clearTranscript}
            disabled={isGenerating || (!transcript && !error)}
            className="h-12 justify-center rounded-none border border-black bg-white/72 px-5 font-bold uppercase text-slate-700 hover:bg-black hover:text-white focus-visible:ring-2 focus-visible:ring-[#86bc25]/40 sm:justify-start"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>

          <motion.div
            className="relative"
            whileHover={isGenerating ? undefined : { scale: 1.015 }}
            whileTap={isGenerating ? undefined : { scale: 0.985 }}
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -inset-1 rounded-[20px] bg-gradient-to-r from-black via-[#5d810e] to-[#86bc25] blur-lg"
              animate={
                isGenerating
                  ? { opacity: [0.22, 0.45, 0.22], scale: [0.98, 1.03, 0.98] }
                  : { opacity: [0.18, 0.34, 0.18] }
              }
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <Button
              type="button"
              onClick={() => void analyzeInteraction()}
              disabled={isGenerating || isOverLimit}
              className="relative h-12 w-full rounded-none border border-black bg-[#86bc25] px-6 font-black uppercase text-black shadow-[5px_5px_0_#111] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:brightness-105 focus-visible:ring-2 focus-visible:ring-[#86bc25]/60 sm:w-auto"
            >
              {isGenerating ? (
                <MiniSpinner />
              ) : (
                <Sparkles className="h-4.5 w-4.5" strokeWidth={2} />
              )}
              {isGenerating ? "Analyzing Interaction" : "Analyze Interaction"}
              {!isGenerating && <ArrowUpRight className="h-4 w-4" />}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function MiniSpinner() {
  return (
    <span className="relative h-4 w-4" aria-hidden>
      <span className="absolute inset-0 rounded-full border-2 border-white/35" />
      <motion.span
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-white"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
    </span>
  );
}

function MiniAnalyzerOrb() {
  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center [perspective:400px]" aria-hidden>
      <motion.span
        className="absolute h-9 w-9 rounded-full border border-[#86bc25]/40"
        animate={{ rotateX: [0, 70, 0], rotateY: [0, 180, 360] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        className="absolute h-7 w-7 rounded-full border border-[#86bc25]/50"
        animate={{ rotateX: [70, 0, 70], rotateZ: [0, -180, -360] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
      />
      <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,0.85)]" />
    </div>
  );
}
