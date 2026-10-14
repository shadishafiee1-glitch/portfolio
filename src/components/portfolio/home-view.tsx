"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { CursorPreview } from "./cursor-preview";
import { PORTFOLIO, TOTAL_CATEGORIES, TOTAL_PROJECTS } from "@/data/portfolio";
import { assetUrl } from "@/lib/assets";
import type { NavigateFn } from "@/hooks/use-hash-route";

const ease = [0.22, 1, 0.36, 1] as const;

interface HomeViewProps {
  navigate: NavigateFn;
}

export function HomeView({ navigate }: HomeViewProps) {
  const [preview, setPreview] = useState<{
    src: string | null;
    accent: string;
  }>({ src: null, accent: "#1a1714" });

  return (
    <>
      <CursorPreview src={preview.src} accent={preview.accent} />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-5 pb-16 pt-14 sm:px-8 sm:pt-20">
          {/* eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
              </span>
              Available for select projects · 2025
            </span>
            <span className="hidden text-border sm:inline">/</span>
            <span className="hidden sm:inline">Tehran · Remote</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.05 }}
            className="mt-6 text-balance text-[clamp(2.9rem,11vw,9rem)] font-semibold leading-[0.92] tracking-[-0.03em]"
          >
            <span className="block">Shadi</span>
            <span className="block">
              <span className="display-text italic font-normal">Shafiee</span>
              <span className="align-top text-[0.28em] font-medium tracking-[0.18em] text-muted-foreground">
                {" "}
                — designer
              </span>
            </span>
          </motion.h1>

          {/* Intro + stats */}
          <div className="mt-10 grid gap-8 border-t border-border/60 pt-8 md:grid-cols-[1.4fr_1fr]">
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.18 }}
              className="max-w-xl text-pretty text-base leading-relaxed text-foreground/85 sm:text-lg"
            >
              A visual designer working across{" "}
              <span className="text-foreground">editorial, identity, print</span>{" "}
              and digital painting. This is a living archive of selected work
              across {TOTAL_CATEGORIES} disciplines — browse by craft below.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.26 }}
              className="flex flex-wrap gap-x-10 gap-y-4 md:justify-end"
            >
              <Stat value={String(TOTAL_CATEGORIES).padStart(2, "0")} label="Disciplines" />
              <Stat value={String(TOTAL_PROJECTS).padStart(2, "0")} label="Projects" />
              <Stat value="∞" label="Iterations" />
            </motion.div>
          </div>
        </div>

        {/* Marquee */}
        <div className="marquee-pause relative border-y border-border/60 bg-foreground/[0.02] py-4">
          <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
                {PORTFOLIO.map((c) => (
                  <span key={`${dup}-${c.slug}`} className="flex items-center">
                    <span className="display-text px-6 text-2xl italic text-foreground/85 sm:text-3xl">
                      {c.name}
                    </span>
                    <span className="text-muted-foreground/50">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY INDEX ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              (Selected Disciplines)
            </p>
            <h2 className="display-text mt-2 text-3xl sm:text-4xl">
              Browse by craft
            </h2>
          </div>
          <p className="hidden max-w-[18rem] text-right text-xs leading-relaxed text-muted-foreground sm:block">
            Hover a discipline to preview · click to enter its archive
          </p>
        </div>

        <ul className="border-t border-border/60">
          {PORTFOLIO.map((cat, i) => {
            const index = String(i + 1).padStart(2, "0");
            return (
              <motion.li
                key={cat.slug}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease, delay: 0.05 * i }}
                className="group relative border-b border-border/60"
              >
                <button
                  type="button"
                  onClick={() =>
                    navigate({ kind: "category", categorySlug: cat.slug })
                  }
                  onMouseEnter={() =>
                    setPreview({ src: cat.cover, accent: cat.accent })
                  }
                  onMouseLeave={() =>
                    setPreview({ src: null, accent: cat.accent })
                  }
                  onFocus={() =>
                    setPreview({ src: cat.cover, accent: cat.accent })
                  }
                  onBlur={() => setPreview({ src: null, accent: cat.accent })}
                  className="relative flex w-full items-center gap-4 py-6 text-left transition-colors duration-300 sm:py-8"
                  style={{ ["--accent" as string]: cat.accent }}
                >
                  {/* hover wash */}
                  <span
                    aria-hidden
                    className="absolute inset-0 -z-0 origin-left scale-x-0 opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(90deg, ${cat.accent}10, transparent 70%)`,
                    }}
                  />
                  {/* index */}
                  <span className="relative z-10 w-12 shrink-0 font-mono text-xs text-muted-foreground transition-colors duration-300 group-hover:text-[color:var(--accent)] sm:w-16 sm:text-sm">
                    {index}
                  </span>
                  {/* name */}
                  <span className="relative z-10 flex-1">
                    <span className="block text-balance text-[clamp(1.8rem,6vw,3.6rem)] font-semibold leading-[0.98] tracking-[-0.02em] transition-transform duration-500 group-hover:translate-x-1.5 sm:group-hover:translate-x-3">
                      {cat.name}
                    </span>
                    <span className="mt-1.5 block text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                      {cat.tagline}
                    </span>
                  </span>
                  {/* count + arrow */}
                  <span className="relative z-10 flex shrink-0 items-center gap-4 sm:gap-6">
                    <span className="hidden text-right text-xs text-muted-foreground sm:block">
                      <span className="block font-mono text-base text-foreground/80">
                        {String(cat.projectCount).padStart(2, "0")}
                      </span>
                      <span className="block">projects</span>
                    </span>
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-border/70 text-foreground/70 transition-all duration-300 group-hover:scale-110 group-hover:border-[color:var(--accent)] group-hover:bg-[color:var(--accent)] group-hover:text-white sm:h-12 sm:w-12"
                    >
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45 sm:h-5 sm:w-5" />
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>

        {/* mobile hint */}
        <p className="mt-6 text-center text-xs text-muted-foreground sm:hidden">
          Tap a discipline to enter its archive
        </p>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="display-text text-4xl leading-none text-foreground">
        {value}
      </span>
      <span className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
