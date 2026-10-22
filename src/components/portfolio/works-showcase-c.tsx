"use client";

import { motion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { PORTFOLIO } from "@/data/portfolio";
import { assetUrl } from "@/lib/assets";
import type { NavigateFn } from "@/hooks/use-hash-route";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Option C — "Editorial Cards"
 * Big, magazine-style cards — one per category — each showing its cover +
 * project count + a preview stack. A bold heading and a single CTA sit
 * above. Clicking a card enters that discipline.
 *
 * Vibe: curated, spacious, editorial — fewer-but-bigger images, each a
 * chapter cover.
 */
export function WorksShowcaseC({ navigate }: { navigate: NavigateFn }) {
  return (
    <section className="border-t border-foreground/15">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-10 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Selected work
            </p>
            <h2 className="display-heavy mt-2 text-[clamp(2rem,5vw,3.5rem)] text-foreground">
              Disciplines &amp; projects
            </h2>
          </div>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("discipline-index")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[var(--accent)]"
          >
            Explore all work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {PORTFOLIO.map((cat, i) => (
            <motion.button
              key={cat.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, ease, delay: 0.05 * Math.min(i, 6) }}
              onClick={() => navigate({ kind: "category", categorySlug: cat.slug })}
              className="group relative flex flex-col overflow-hidden rounded-2xl text-left ring-1 ring-foreground/10"
            >
              {/* cover image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                {cat.cover && (
                  <img
                    src={assetUrl(cat.cover)}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--accent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {cat.projectCount} {cat.projectCount === 1 ? "project" : "projects"}
                </span>
              </div>
              {/* body */}
              <div className="flex flex-1 items-center justify-between gap-3 bg-card p-4">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold text-foreground">
                    {cat.name}
                  </h3>
                  <p className="truncate text-xs text-muted-foreground">
                    {cat.tagline}
                  </p>
                </div>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent)] text-white transition-all duration-300 group-hover:rotate-90">
                  <Plus className="h-4 w-4" />
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
