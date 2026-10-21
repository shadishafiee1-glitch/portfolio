"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { CursorPreview } from "./cursor-preview";
import { AboutSections } from "./about-sections";
import { PORTFOLIO } from "@/data/portfolio";
import { useRovingList } from "@/hooks/use-roving-list";
import type { NavigateFn } from "@/hooks/use-hash-route";

const ease = [0.22, 1, 0.36, 1] as const;

interface HomeViewProps {
  navigate: NavigateFn;
}

export function HomeView({ navigate }: HomeViewProps) {
  const [preview, setPreview] = useState<{ src: string | null }>({
    src: null,
  });

  const { containerRef, onKeyDown } = useRovingList(PORTFOLIO.length);

  return (
    <>
      <CursorPreview src={preview.src} />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-5 pt-16 pb-12 sm:px-8 sm:pt-24 sm:pb-16">
          {/* eyebrow — role */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="mb-4 text-sm font-medium tracking-wide text-foreground/60"
          >
            Graphic Designer
          </motion.p>

          {/* "Portfolio" — Cormorant Garamond, thin elegant artistic serif.
              The italic accent-blue 'P' initial is the artistic flourish. */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.05 }}
            className="display-heavy text-[clamp(3.5rem,13vw,11rem)] leading-[0.88] text-foreground"
          >
            <span className="italic font-normal text-[var(--accent)]">P</span>
            ortfolio
          </motion.h1>

          {/* "Shadi Shafiee" — Caveat handwriting script, smaller, beneath.
              A personal, hand-made signature flourish. */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2"
          >
            <h2 className="display-script text-[clamp(2.2rem,5.5vw,4rem)] text-foreground/85">
              Shadi Shafiee
            </h2>
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/30 px-3 py-1 font-sans text-xs text-foreground/60">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)]/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              </span>
              Tehran, Mashhad · 2026
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── DISCIPLINE INDEX ────────────────────────────────────────────
          Numbered category rows, full-width, stacked one below the other.
          On hover: the discipline name + the arrow circle turn blue. No
          section heading — the index speaks for itself. */}
      <section className="relative">
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-20">
          <ul
            ref={containerRef}
            className="border-t border-foreground/15"
            role="list"
          >
            {PORTFOLIO.map((cat, i) => {
              const index = String(i + 1).padStart(2, "0");
              return (
                <motion.li
                  key={cat.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease, delay: 0.04 * i }}
                  className="group relative border-b border-foreground/15"
                >
                  <button
                    type="button"
                    data-roving-item
                    onKeyDown={(e) => onKeyDown(e, i)}
                    onClick={() =>
                      navigate({ kind: "category", categorySlug: cat.slug })
                    }
                    onMouseEnter={() => setPreview({ src: cat.cover })}
                    onMouseLeave={() => setPreview({ src: null })}
                    onFocus={() => setPreview({ src: cat.cover })}
                    onBlur={() => setPreview({ src: null })}
                    className="relative flex w-full items-center gap-3 py-5 text-left outline-none transition-colors duration-300 sm:py-6"
                  >
                    {/* index */}
                    <span className="relative z-10 w-8 shrink-0 font-sans text-xs text-foreground/40 transition-colors duration-300 group-hover:text-[var(--accent)] sm:w-12 sm:text-sm">
                      {index}
                    </span>
                    {/* name — turns blue on hover */}
                    <span className="relative z-10 min-w-0 flex-1">
                      <span className="block text-balance text-[clamp(1.3rem,4vw,2.4rem)] font-semibold leading-[1] tracking-tight text-foreground transition-colors duration-300 group-hover:text-[var(--accent)] group-hover:translate-x-1.5">
                        {cat.name}
                      </span>
                      <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/40">
                        {cat.tagline}
                      </span>
                    </span>
                    {/* arrow circle — always blue */}
                    <span className="relative z-10 flex shrink-0 items-center">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent)] text-white transition-all duration-300 group-hover:scale-110 sm:h-11 sm:w-11">
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── MARQUEE STRIP — light, accent dots ────────────────────────── */}
      <section className="border-y border-foreground/15">
        <div className="marquee-pause relative overflow-hidden py-3">
          <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
                {PORTFOLIO.map((c) => (
                  <span key={`${dup}-${c.slug}`} className="flex items-center">
                    <span className="display-text px-5 text-xl text-foreground/70 sm:text-2xl">
                      {c.name}
                    </span>
                    <span className="text-[var(--accent)]">•</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / EDUCATION / EXPERIENCE / SKILLS ─────────────────────
          The full About content lives inline on the home page (after the
          hero + discipline index), so visitors get the whole story without
          navigating. Shared AboutSections component keeps it in sync with
          the #/about deep-link view. */}
      <section className="mx-auto max-w-[1000px] px-5 pb-24 sm:px-8">
        <AboutSections />
      </section>
    </>
  );
}
