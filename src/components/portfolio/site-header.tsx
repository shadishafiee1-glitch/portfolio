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
      className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55"
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
        {/* Wordmark */}
        <button
          type="button"
          onClick={() => navigate({ kind: "home" })}
          className="group flex items-center gap-2.5 text-left"
          aria-label="Back to home"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background text-[13px] font-semibold tracking-tight transition-transform duration-300 group-hover:scale-105"
            aria-hidden
          >
            S
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight">
              Shadi Shafiee
            </span>
            <span className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Visual Designer
            </span>
          </span>
        </button>

        {/* Right cluster */}
        <nav className="flex items-center gap-1.5">
          {/* Search trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Search (press slash)"
            className="group inline-flex h-9 items-center gap-2 rounded-full border border-border/70 pl-3 pr-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="hidden text-[13px] sm:inline">Search</span>
            <kbd className="hidden rounded border border-border/70 bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
              /
            </kbd>
          </button>
          <button
            type="button"
            onClick={() => navigate({ kind: "home" })}
            className={cn(
              "hidden rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors lg:inline-flex",
              onHome
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            Index
          </button>
          <button
            type="button"
            onClick={() => navigate({ kind: "about" })}
            className={cn(
              "hidden rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors lg:inline-flex",
              view.kind === "about"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            About
          </button>
          <a
            href="https://github.com/shadishafiee1-glitch/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-foreground/80 transition-colors hover:bg-accent hover:text-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </motion.header>
  );
}
