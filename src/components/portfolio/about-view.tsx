"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Mail, MapPin, Sparkles } from "lucide-react";
import { PORTFOLIO, TOTAL_CATEGORIES, TOTAL_PROJECTS } from "@/data/portfolio";
import { assetUrl } from "@/lib/assets";
import type { NavigateFn } from "@/hooks/use-hash-route";

const ease = [0.22, 1, 0.36, 1] as const;

interface AboutViewProps {
  navigate: NavigateFn;
}

/**
 * Long-form About view — a deep-linked editorial bio page reachable from the
 * header (`#/about`). Pairs a portrait/cover with a multi-paragraph statement,
 * a discipline index, a short timeline and a contact CTA. Gives the portfolio
 * a real "about" destination instead of just the home section.
 */
export function AboutView({ navigate }: AboutViewProps) {
  // use the first discipline cover as a stand-in portrait (warm editorial)
  const portrait = PORTFOLIO.find((c) => c.cover)?.cover ?? null;

  return (
    <div className="mx-auto max-w-[1100px] px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
      {/* Breadcrumb */}
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease }}
        onClick={() => navigate({ kind: "home" })}
        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Index
        <span className="text-border">/</span>
        <span className="font-medium text-foreground">About</span>
      </motion.button>

      {/* Hero */}
      <header className="mt-10 grid gap-10 border-b border-border/60 pb-14 md:grid-cols-[1.3fr_1fr] md:gap-12">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground"
          >
            (About)
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.05 }}
            className="mt-4 text-balance text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-[0.95] tracking-[-0.03em]"
          >
            Shadi <span className="display-text italic font-normal">Shafiee</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="mt-5 text-pretty text-lg leading-relaxed text-foreground/85"
          >
            A visual designer working across editorial, identity, print and
            digital painting — building systems that hold together from the
            first thumbnail to the final bleed.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.22 }}
            className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
          >
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Tehran · Remote
            </span>
            <span className="text-border">/</span>
            <span className="inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
              </span>
              Available for select projects
            </span>
          </motion.div>
        </div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease, delay: 0.1 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border/60 bg-muted">
            {portrait && (
              <img
                src={assetUrl(portrait)}
                alt="Shadi Shafiee — selected work"
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground backdrop-blur">
              Selected work
            </span>
          </div>
        </motion.div>
      </header>

      {/* Long-form statement */}
      <section className="mt-14 grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="space-y-5 text-pretty text-base leading-relaxed text-foreground/80 sm:text-lg"
        >
          <p>
            I&apos;ve spent the last decade shaping visual systems for
            editorial, brand and print — from a single magazine spread to a
            full identity rollout. The work lives in the details: the rhythm
            of a column grid, the weight of a drop cap, the bleed of a poster
            edge, the calm of a palette that lets the content breathe.
          </p>
          <p>
            This archive collects selected work across{" "}
            <span className="text-foreground">{TOTAL_CATEGORIES} disciplines</span>{" "}
            — an evolving record of how each project moves from rough sketch
            to finished craft. New work lands here as it ships, filed under its
            discipline; old work stays as a record of how the thinking has
            moved.
          </p>
          <p className="text-muted-foreground">
            I take on a small number of considered briefs each year — editorial
            layouts, identity systems, social campaigns and the occasional
            canvas commission. If you have a project in mind, I&apos;d love to
            hear about it.
          </p>
        </motion.div>

        {/* Stats / approach card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              In numbers
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-5">
              <Stat value={String(TOTAL_CATEGORIES).padStart(2, "0")} label="Disciplines" />
              <Stat value={String(TOTAL_PROJECTS).padStart(2, "0")} label="Projects" />
              <Stat value="10+" label="Years" />
              <Stat value="∞" label="Iterations" />
            </dl>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> How I work
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-foreground/80">
              <li>· Brief first — every project starts with a conversation.</li>
              <li>· Systems, not one-offs — the work compounds.</li>
              <li>· Print and pixel held to the same bar.</li>
            </ul>
          </div>
        </motion.div>
      </section>

      {/* Discipline index */}
      <section className="mt-16 border-t border-border/60 pt-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          (Disciplines)
        </p>
        <h2 className="display-text mt-3 text-2xl sm:text-3xl">Browse by craft</h2>
        <ul className="mt-6 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
          {PORTFOLIO.map((c, i) => (
            <motion.li
              key={c.slug}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease, delay: 0.04 * i }}
            >
              <button
                type="button"
                onClick={() => navigate({ kind: "category", categorySlug: c.slug })}
                className="group flex w-full items-center justify-between gap-3 rounded-lg border border-border/60 px-4 py-3.5 text-left transition-colors hover:bg-accent"
                style={{ ["--accent" as string]: c.accent }}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: c.accent }}
                    aria-hidden
                  />
                  <span className="text-sm font-semibold tracking-tight">
                    {c.name}
                  </span>
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {String(c.projectCount).padStart(2, "0")}
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* Contact CTA */}
      <section className="mt-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="flex flex-col items-start gap-5 rounded-2xl border border-border/60 bg-card p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Start a project
            </p>
            <p className="display-text mt-2 text-2xl sm:text-3xl">
              Have a brief in mind?
            </p>
          </div>
          <a
            href="mailto:hello@shadishafiee.com?subject=Project%20enquiry"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-transform hover:scale-[1.02]"
          >
            <Mail className="h-4 w-4" />
            hello@shadishafiee.com
          </a>
        </motion.div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="display-text text-3xl leading-none text-foreground">
        {value}
      </span>
      <span className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
