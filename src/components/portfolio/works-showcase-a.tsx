"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PORTFOLIO } from "@/data/portfolio";
import { assetUrl } from "@/lib/assets";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Option A — "Mosaic Vitrin"
 * A pure display mosaic of a curated set of project covers (6 tiles, varying
 * sizes) — NOT clickable, just a visual vitrin. A bold heading + a single
 * "View all work" CTA scrolls down to the numbered discipline index where
 * the actual navigation lives.
 *
 * Vibe: gallery wall, image-rich, modern editorial.
 */
export function WorksShowcaseA() {
  // flatten all projects, then pick a curated 6 for the vitrin
  const all = PORTFOLIO.flatMap((cat) =>
    cat.projects.map((p) => ({ cat, project: p })),
  );
  const tiles = all.slice(0, 6);

  // a hand-picked size pattern for visual rhythm (spans the 4-col grid)
  const spans = [
    "sm:col-span-2 sm:row-span-2", // big
    "", "",
    "sm:col-span-2", // wide
    "", "",
  ];

  return (
    <section className="border-t border-foreground/15">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="mb-8 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Selected work
            </p>
            <h2 className="display-heavy mt-2 text-[clamp(2rem,5vw,3.5rem)] text-foreground">
              A look at the work
            </h2>
          </div>
          <a
            href="#discipline-index"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[var(--accent)]"
          >
            View all work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {tiles.map((t, i) => (
            <motion.div
              key={`${t.cat.slug}/${t.project.slug}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, ease, delay: 0.03 * i }}
              className={`group relative overflow-hidden rounded-2xl ring-1 ring-foreground/10 ${
                spans[i % spans.length]
              }`}
            >
              {t.project.cover && (
                <img
                  src={assetUrl(t.project.cover)}
                  alt={t.project.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              )}
              {/* gradient + label on hover (display-only, not clickable) */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                  {t.cat.name}
                </p>
                <p className="truncate text-sm font-semibold text-white">
                  {t.project.name}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
