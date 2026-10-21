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
  const [preview, setPreview] = useState<{
    src: string | null;
  }>({ src: null });

  const { containerRef, onKeyDown } = useRovingList(PORTFOLIO.length);

  return (
    <>
      <CursorPreview src={preview.src} />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b-2 border-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 sm:py-14">
          {/* Name — massive bold display */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="display-heavy text-[clamp(4.5rem,17vw,15rem)] text-foreground"
          >
            Shadi
            <br />
            Shafiee
          </motion.h1>

          {/* role tag */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease, delay: 0.25 }}
            className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-foreground/20 pt-4"
          >
            <span className="inline-flex items-center gap-2 bg-foreground px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-background">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--flame)]" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--flame)]" />
              </span>
              Visual Designer
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              Tehran · Remote
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── DISCIPLINE INDEX ─────────────────────────────────────────────
          Numbered category rows with a hover wash + cursor-following cover
          preview. Laid out as a 2-column grid on desktop so disciplines sit
          adjacent (Magazine next to Design, Catalog next to Logo, …) rather
          than as separated full-width rows. The original editorial shape,
          restored — just packed back-to-back as requested. */}
      <section className="border-b-2 border-foreground">
        <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.1 }}
            className="mb-8 flex items-end justify-between gap-4"
          >
            <div>
              <p className="inline-block bg-[var(--flame)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white">
                Selected disciplines
              </p>
              <h2 className="display-heavy mt-3 text-2xl sm:text-3xl">
                Browse by craft
              </h2>
            </div>
            <p className="hidden max-w-[16rem] text-right text-xs leading-relaxed text-muted-foreground sm:block">
              Hover a discipline to preview · click to enter its archive
              <br />
              <span className="text-muted-foreground/70">
                Keyboard: ↑ ↓ to move · Enter to open
              </span>
            </p>
          </motion.div>

          <ul
            ref={containerRef}
            className="grid grid-cols-1 border-t-2 border-foreground sm:grid-cols-2"
            role="list"
          >
            {PORTFOLIO.map((cat, i) => {
              const index = String(i + 1).padStart(2, "0");
              return (
                <motion.li
                  key={cat.slug}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.05 * i }}
                  className="group relative border-b-2 border-foreground sm:[&:nth-child(odd)]:border-r-2"
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
                    className="relative flex w-full items-center gap-3 py-5 text-left outline-none transition-colors duration-300 focus-visible:z-10 focus-visible:bg-foreground focus-visible:text-background sm:py-7"
                  >
                    {/* hover wash */}
                    <span
                      aria-hidden
                      className="absolute inset-0 -z-0 origin-left scale-x-0 bg-foreground opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-[0.04]"
                    />
                    {/* index */}
                    <span className="relative z-10 w-10 shrink-0 font-mono text-xs text-muted-foreground transition-colors duration-300 group-hover:text-[var(--flame)] sm:w-12 sm:text-sm">
                      {index}
                    </span>
                    {/* name */}
                    <span className="relative z-10 min-w-0 flex-1">
                      <span className="display-heavy block text-balance text-[clamp(1.5rem,4.5vw,2.6rem)] leading-[0.92] transition-transform duration-500 group-hover:translate-x-1.5">
                        {cat.name}
                      </span>
                      <span className="mt-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        {cat.tagline}
                      </span>
                    </span>
                    {/* arrow */}
                    <span className="relative z-10 flex shrink-0 items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center border-2 border-foreground text-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-[var(--flame)] group-hover:border-[var(--flame)] group-hover:text-white sm:h-11 sm:w-11">
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

      {/* ── MARQUEE STRIP ─────────────────────────────────────────────── */}
      <section className="border-b-2 border-foreground bg-foreground text-background">
        <div className="marquee-pause relative overflow-hidden py-4">
          <div className="flex w-max animate-marquee whitespace-nowrap will-change-transform">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
                {PORTFOLIO.map((c) => (
                  <span key={`${dup}-${c.slug}`} className="flex items-center">
                    <span className="display-heavy px-6 text-2xl text-background sm:text-3xl">
                      {c.name}
                    </span>
                    <span className="text-[var(--flame)]">✦</span>
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
              className="mb-6 inline-block bg-[var(--flame)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white"
            >
              About
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease, delay: 0.05 }}
              className="display-heavy text-balance text-[clamp(2.2rem,6vw,4.5rem)]"
            >
              Designing across print &amp; pixel.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="flex flex-col justify-between border-2 border-foreground bg-card p-7 sm:p-9"
          >
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Start a project
              </p>
              <p className="display-text mt-3 text-2xl italic">
                Have a brief in mind?
              </p>
            </div>
            <div className="mt-8">
              <a
                href="mailto:hello@shadishafiee.com?subject=Project%20enquiry"
                className="group inline-flex w-full items-center justify-center gap-2 bg-foreground px-5 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-background transition-colors hover:bg-[var(--flame)] hover:text-white"
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
