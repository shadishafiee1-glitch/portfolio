"use client";

import { motion } from "framer-motion";

import { PORTFOLIO } from "@/data/portfolio";
import { assetUrl } from "@/lib/assets";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Option A — "Mosaic Vitrin"
 * A pure display mosaic of a curated set of project covers (7 tiles, varying
 * sizes) — display-only, with a wide final tile filling the bottom row.
 * The numbered discipline index below the mosaic is where
 * the actual navigation lives.
 *
 * Vibe: gallery wall, image-rich, modern editorial.
 */
export function WorksShowcaseA() {
  // flatten all projects, then pick a curated 7 for the vitrin
  const all = PORTFOLIO.flatMap((cat) =>
    cat.projects.map((p) => ({ cat, project: p })),
  );
  const tiles = all.filter((tile) => tile.project.cover).slice(0, 7);

  // a hand-picked size pattern for visual rhythm (spans the 4-col grid)
  const spans = [
    "sm:col-span-2 sm:row-span-2", // big
    "", "",
    "sm:col-span-2", // wide
    "", "",
    "col-span-2", // fill the final wide space with another project cover
  ];

  return (
    <section className="border-t border-foreground/15">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-20">
        <h2 className="sr-only">Selected work</h2>

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
