"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { CursorPreview } from "./cursor-preview";
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

          {/* "Portfolio" — the big bold statement, title-case, mixed type */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.05 }}
            className="text-[clamp(4rem,15vw,13rem)] font-black leading-[0.85] tracking-[-0.03em] text-foreground"
          >
            <span className="display-text italic font-normal text-[var(--accent)]">
              P
            </span>
            ortfolio
          </motion.h1>

          {/* "Shadi Shafiee" — smaller, beneath, with the year tag */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.2 }}
            className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2"
          >
            <h2 className="display-text text-[clamp(1.8rem,4vw,3rem)] italic text-foreground/85">
              Shadi Shafiee
            </h2>
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/30 px-3 py-1 font-mono text-xs text-foreground/60">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)]/60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              </span>
              Tehran · 2025
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── DISCIPLINE INDEX ────────────────────────────────────────────
          Numbered category rows in a 2-column grid so disciplines sit
          adjacent (Magazine next to Design). Lightened: thin hairline
          borders instead of heavy black, no fills — feels editorial, not
          brutalist. Hover washes in the accent tint. */}
      <section className="relative">
        <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="mb-8 flex items-end justify-between gap-4"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
                Selected disciplines
              </p>
              <h2 className="display-text mt-2 text-2xl text-foreground sm:text-3xl">
                Browse by craft
              </h2>
            </div>
            <p className="hidden max-w-[16rem] text-right text-xs leading-relaxed text-foreground/45 sm:block">
              Hover a discipline to preview · click to enter its archive
            </p>
          </motion.div>

          <ul
            ref={containerRef}
            className="grid grid-cols-1 border-t border-foreground/15 sm:grid-cols-2"
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
                  className="group relative border-b border-foreground/15 sm:[&:nth-child(odd)]:border-r"
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
                    {/* hover wash — accent tint, soft */}
                    <span
                      aria-hidden
                      className="absolute inset-0 -z-0 origin-left scale-x-0 bg-[var(--accent-tint)] opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100"
                    />
                    {/* index */}
                    <span className="relative z-10 w-8 shrink-0 font-mono text-xs text-foreground/40 transition-colors duration-300 group-hover:text-[var(--accent)] sm:w-10">
                      {index}
                    </span>
                    {/* name — title case, medium weight, not huge */}
                    <span className="relative z-10 min-w-0 flex-1">
                      <span className="block text-balance text-[clamp(1.3rem,3.5vw,2rem)] font-semibold leading-[1] tracking-tight text-foreground transition-transform duration-500 group-hover:translate-x-1">
                        {cat.name}
                      </span>
                      <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/40">
                        {cat.tagline}
                      </span>
                    </span>
                    {/* arrow */}
                    <span className="relative z-10 flex shrink-0 items-center">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/20 text-foreground/60 transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white">
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

      {/* ── ABOUT / CONTACT ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1400px] px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr] md:gap-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease }}
              className="mb-5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50"
            >
              About
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease, delay: 0.05 }}
              className="display-text text-balance text-[clamp(1.8rem,4.5vw,3rem)] leading-tight text-foreground"
            >
              Designing across print &amp; pixel,{" "}
              <span className="italic text-[var(--accent)]">
                from the first thumbnail to the final bleed.
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="flex flex-col justify-between rounded-2xl border border-foreground/15 bg-card/80 p-7 backdrop-blur-sm sm:p-9"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
                Start a project
              </p>
              <p className="display-text mt-3 text-2xl italic text-foreground">
                Have a brief in mind?
              </p>
            </div>
            <div className="mt-8">
              <a
                href="mailto:hello@shadishafiee.com?subject=Project%20enquiry"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-[var(--accent)]"
              >
                hello@shadishafiee.com
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
