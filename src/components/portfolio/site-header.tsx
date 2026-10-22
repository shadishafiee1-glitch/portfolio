"use client";

import { motion } from "framer-motion";
import { Github, Search } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import type { View } from "@/lib/types";
import type { NavigateFn } from "@/hooks/use-hash-route";

interface SiteHeaderProps {
  view: View;
  navigate: NavigateFn;
  onOpenSearch: () => void;
}

export function SiteHeader({ view, navigate, onOpenSearch }: SiteHeaderProps) {
  const onHome = view.kind === "home";

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 relative border-b border-foreground/10 backdrop-blur-xl"
      style={{
        /* Cool gradient header: a soft diagonal blend from the accent blue
           tint into the paper, so the bar feels airy and luminous rather
           than a flat strip. Translucent so page content still reads through. */
        background:
          "linear-gradient(115deg, rgba(0,128,255,0.18) 0%, rgba(0,128,255,0.06) 28%, rgba(244,245,247,0.85) 60%, rgba(244,245,247,0.90) 100%)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 sm:px-8">
        {/* Wordmark — small, clean */}
        <button
          type="button"
          onClick={() => navigate({ kind: "home" })}
          className="group flex items-center gap-2 text-left"
          aria-label="Back to home"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background transition-colors group-hover:bg-[var(--accent)]">
            S
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Shadi Shafiee
          </span>
        </button>

        {/* Right cluster */}
        <nav className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search (press slash)"
            className="group inline-flex h-9 items-center gap-2 rounded-full border border-foreground/15 px-3 text-foreground/70 transition-colors hover:border-[var(--accent)] hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="hidden text-xs font-medium sm:inline">Search</span>
            <kbd className="hidden rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-[10px] text-foreground/50 sm:inline">
              /
            </kbd>
          </button>
          <button
            type="button"
            onClick={() => navigate({ kind: "home" })}
            className={cn(
              "hidden rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors lg:inline-block",
              onHome
                ? "bg-foreground text-background"
                : "text-foreground/60 hover:text-foreground",
            )}
          >
            Index
          </button>
          <button
            type="button"
            onClick={() => navigate({ kind: "about" })}
            className={cn(
              "hidden rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors lg:inline-block",
              view.kind === "about"
                ? "bg-foreground text-background"
                : "text-foreground/60 hover:text-foreground",
            )}
          >
            About
          </button>
          <a
            href="https://github.com/shadishafiee1-glitch/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 text-foreground/70 transition-colors hover:border-[var(--accent)] hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </nav>
      </div>
      {/* gradient accent line at the bottom edge of the header */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,128,255,0.0) 8%, rgba(0,128,255,0.55) 50%, rgba(0,128,255,0.0) 92%, transparent 100%)",
        }}
      />
    </motion.header>
  );
}
