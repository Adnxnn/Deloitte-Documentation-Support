"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileStack, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function AppHeader() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-black/15 bg-[#f4f4f0]/92 backdrop-blur-2xl transition-colors duration-300 dark:border-white/10 dark:bg-[#111]/92"
    >
      <div className="mx-auto flex h-[76px] w-full max-w-[1680px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-black text-[#86bc25] dark:bg-[#86bc25] dark:text-black">
            <FileStack className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div className="min-w-0 border-l border-black/20 pl-4 dark:border-white/20">
            <p className="truncate text-sm font-bold tracking-[-0.02em] text-black dark:text-white sm:text-base">
              Deloitte Documentation Support Tool
            </p>
            <p className="hidden truncate text-[10px] font-semibold uppercase tracking-[0.17em] text-black/45 dark:text-white/50 sm:block">
              ServiceNow-ready interaction notes
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          disabled={!mounted}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          title={isDark ? "Switch to light theme" : "Switch to dark theme"}
          className="flex h-10 w-10 items-center justify-center border border-black/20 bg-white/60 text-black transition hover:-translate-y-0.5 hover:bg-[#86bc25] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86bc25] disabled:cursor-wait dark:border-white/15 dark:bg-white/[0.06] dark:text-white"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? "sun" : "moon"}
              initial={{ opacity: 0, rotate: -35, scale: 0.75 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 35, scale: 0.75 }}
              transition={{ duration: 0.18 }}
            >
              {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </motion.header>
  );
}
