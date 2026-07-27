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
      className="sticky top-0 z-50 border-b border-black bg-[#eceee8]/95 backdrop-blur-2xl transition-colors duration-300 dark:border-white/15 dark:bg-[#111]/95"
    >
      <div className="mx-auto flex h-[76px] w-full max-w-[1840px] items-center justify-between gap-4 px-3 sm:px-5 lg:px-7">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-black bg-black text-[#86bc25] dark:border-[#86bc25] dark:bg-[#86bc25] dark:text-black">
            <FileStack className="h-5 w-5" strokeWidth={2.2} />
          </div>

          <div className="min-w-0 border-l border-black/20 pl-4 dark:border-white/20">
            <p className="truncate text-sm font-black uppercase tracking-[-0.035em] text-black dark:text-white sm:text-base">
              Deloitte Documentation Support Tool
            </p>
            <p className="hidden truncate font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-black/45 dark:text-white/50 sm:block">
              Documentation intelligence / ServiceNow ready
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 border border-black bg-black px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-white md:flex dark:border-white/15">
            <span className="h-1.5 w-1.5 rounded-full bg-[#86bc25]" />
            Internal support system
          </div>
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            disabled={!mounted}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            title={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className="flex h-10 w-10 items-center justify-center border border-black bg-white/60 text-black transition hover:bg-[#86bc25] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86bc25] disabled:cursor-wait dark:border-white/15 dark:bg-white/[0.06] dark:text-white"
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
      </div>
    </motion.header>
  );
}
