"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PORTFOLIO } from "@/data/portfolio";
import { assetUrl } from "@/lib/assets";

const ease = [0.22, 1, 0.36, 1] as const;

type Tile = { cat: (typeof PORTFOLIO)[number]; project: (typeof PORTFOLIO)[number]["projects"][number] };

/**
 * Option B — "Marquee Vitrin"
 * Two horizontal, opposite-direction rows of project covers that auto-scroll
 * (pause on hover). A pure display vitrin — NOT clickable. Heading + a
 * "Browse all work" CTA scrolls to the discipline index.
 *
 * Vibe: cinematic, motion-led, lots of imagery visible at once.
 */
export function WorksShowcaseB() {
  const all = PORTFOLIO.flatMap((cat) =>
    cat.projects.map((p) => ({ cat, project: p })),
  );
  const tiles = all.slice(0, 7);
  const half = Math.ceil(tiles.length / 2);
  const rowTop = tiles.slice(0, half);
  const rowBottom = tiles.slice(half).concat(tiles.slice(0, 2)); // pad for loop

  return (
    <section className="border-t border-foreground/15 py-14 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="mx-auto mb-10 flex max-w-[1400px] flex-wrap items-end justify-between gap-4 px-5 sm:px-8"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Selected work
          </p>
          <h2 className="display-heavy mt-2 text-[clamp(2rem,5vw,3.5rem)] text-foreground">
            Things I&rsquo;ve made
          </h2>
        </div>
        <a
          href="#discipline-index"
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-[var(--accent)]"
        >
          Browse all work
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </motion.div>

      <div className="flex flex-col gap-3 sm:gap-4">
        <MarqueeRow items={rowTop} />
        <MarqueeRow items={rowBottom} reverse />
      </div>
    </section>
  );
}

function MarqueeRow({
  items,
  reverse,
}: {
  items: Tile[];
  reverse?: boolean;
}) {
  return (
    <div className="marquee-pause relative overflow-hidden">
      <div
        className={`flex w-max gap-3 ${reverse ? "animate-marquee-rev" : "animate-marquee"}`}
      >
        {[0, 1].map((dup) => (
          <div key={dup} className="flex gap-3" aria-hidden={dup === 1}>
            {items.map((t) => (
              <div
                key={`${dup}-${t.cat.slug}/${t.project.slug}`}
                className="group relative h-44 w-64 shrink-0 overflow-hidden rounded-2xl ring-1 ring-foreground/10 sm:h-56 sm:w-80"
              >
                {t.project.cover && (
                  <img
                    src={assetUrl(t.project.cover)}
                    alt={t.project.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                    {t.cat.name}
                  </p>
                  <p className="truncate text-sm font-semibold text-white">
                    {t.project.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
