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
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b-2 border-foreground bg-background/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-5 sm:px-8">
        {/* Wordmark — bold display */}
        <button
          type="button"
          onClick={() => navigate({ kind: "home" })}
          className="display-heavy group flex items-center gap-2 text-left text-xl tracking-tight"
          aria-label="Back to home"
        >
          <span className="flex h-7 w-7 items-center justify-center bg-foreground text-sm text-background transition-colors group-hover:bg-[var(--flame)]">
            S
          </span>
          <span className="hidden sm:inline">SHAFIEE</span>
        </button>

        {/* Right cluster */}
        <nav className="flex items-center gap-1.5">
          {/* Search trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search (press slash)"
            className="group inline-flex h-9 items-center gap-2 border-2 border-foreground px-3 text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            <Search className="h-4 w-4" />
            <span className="hidden text-[11px] font-bold uppercase tracking-[0.14em] sm:inline">
              Search
            </span>
            <kbd className="hidden rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
              /
            </kbd>
          </button>
          <button
            type="button"
            onClick={() => navigate({ kind: "home" })}
            className={cn(
              "hidden border-2 border-foreground px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors lg:inline-block",
              onHome
                ? "bg-foreground text-background"
                : "bg-transparent text-foreground hover:bg-foreground hover:text-background",
            )}
          >
            Index
          </button>
          <button
            type="button"
            onClick={() => navigate({ kind: "about" })}
            className={cn(
              "hidden border-2 border-foreground px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors lg:inline-block",
              view.kind === "about"
                ? "bg-foreground text-background"
                : "bg-transparent text-foreground hover:bg-foreground hover:text-background",
            )}
          >
            About
          </button>
          <a
            href="https://github.com/shadishafiee1-glitch/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="inline-flex h-9 w-9 items-center justify-center border-2 border-foreground text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            <Github className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </motion.header>
  );
}
