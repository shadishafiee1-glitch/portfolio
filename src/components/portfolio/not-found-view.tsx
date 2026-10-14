"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";
import { PORTFOLIO } from "@/data/portfolio";
import type { NavigateFn } from "@/hooks/use-hash-route";

const ease = [0.22, 1, 0.36, 1] as const;

interface NotFoundViewProps {
  /** The kind of thing that wasn't found, e.g. "Category" / "Project" */
  label: string;
  /** The slug the user tried to reach, shown for context. */
  slug?: string;
  navigate: NavigateFn;
}

/**
 * Graceful 404 for unknown hash routes.
 *
 * Instead of a dead "not found" dead-end, this view helps the visitor recover:
 * a quiet editorial headline, the offending slug in mono, a primary CTA back
 * to the index, and a secondary list of the disciplines that *do* exist.
 */
export function NotFoundView({ label, slug, navigate }: NotFoundViewProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center px-5 py-24 text-center sm:py-32">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease }}
        className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-border/70 bg-card"
      >
        <Compass className="h-7 w-7 animate-[spin_6s_linear_infinite] text-muted-foreground" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.1 }}
        className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground"
      >
        404 · {label} not found
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.15 }}
        className="display-text mt-4 text-balance text-[clamp(2.4rem,7vw,4rem)] leading-[0.98]"
      >
        Lost the thread.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.22 }}
        className="mt-5 max-w-md text-pretty text-base leading-relaxed text-muted-foreground"
      >
        The page you were looking for isn&apos;t here — maybe it was renamed,
        or never existed. Pick a discipline below to get back on track.
      </motion.p>

      {slug && (
        <p className="mt-4 rounded-full border border-border/70 bg-muted/50 px-3 py-1 font-mono text-xs text-muted-foreground">
          {slug}
        </p>
      )}

      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.28 }}
        onClick={() => navigate({ kind: "home" })}
        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to the index
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.34 }}
        className="mt-14 w-full"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Or explore a discipline
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {PORTFOLIO.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => navigate({ kind: "category", categorySlug: c.slug })}
              className="rounded-full border border-border/70 px-3.5 py-1.5 text-sm text-foreground/80 transition-colors hover:border-foreground/40 hover:bg-accent hover:text-foreground"
              style={{ ["--accent" as string]: c.accent }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
