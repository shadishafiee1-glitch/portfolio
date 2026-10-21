"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

interface GalleryProgressProps {
  total: number;
  /** Accent color used for the active dot + progress bar. */
  accent: string;
}

/**
 * A sticky gallery progress indicator that lives in the project header's
 * right margin on desktop.
 *
 * Shows a "01 / 04" counter + a vertical list of dots (one per gallery
 * figure). An IntersectionObserver tracks which figure is currently in view
 * and highlights its dot; clicking a dot smooth-scrolls to that figure.
 *
 * Disabled (renders nothing) when there's only one piece, or on small
 * screens where the dots would crowd the layout.
 */
export function GalleryProgress({ total, accent }: GalleryProgressProps) {
  const [active, setActive] = useState(0);
  const dotsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (total <= 1) return;
    const figures = Array.from(
      document.querySelectorAll<HTMLElement>("[data-gallery-figure]"),
    );
    if (figures.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the most-visible entry
        let best: { index: number; ratio: number } | null = null;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number((entry.target as HTMLElement).dataset.galleryFigure);
          if (best === null || entry.intersectionRatio > best.ratio) {
            best = { index: idx, ratio: entry.intersectionRatio };
          }
        }
        if (best !== null) setActive(best.index);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    for (const f of figures) observer.observe(f);
    return () => observer.disconnect();
  }, [total]);

  const scrollTo = (i: number) => {
    const figures = Array.from(
      document.querySelectorAll<HTMLElement>("[data-gallery-figure]"),
    );
    figures[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (total <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease }}
      className="hidden flex-col items-end gap-3 md:flex"
      ref={dotsRef}
    >
      <div className="inline-flex items-baseline gap-1 font-mono text-sm tabular-nums">
        <span className="text-foreground" style={{ color: "var(--flame)" }}>
          {String(active + 1).padStart(2, "0")}
        </span>
        <span className="text-muted-foreground/60">/</span>
        <span className="text-muted-foreground">
          {String(total).padStart(2, "0")}
        </span>
      </div>
      <div className="flex flex-col items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollTo(i)}
            aria-label={`Jump to piece ${i + 1}`}
            aria-current={i === active ? "true" : undefined}
            className="group relative flex h-4 w-4 items-center justify-center"
          >
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: i === active ? "10px" : "6px",
                height: i === active ? "10px" : "6px",
                backgroundColor: i === active ? accent : "currentColor",
                opacity: i === active ? 1 : 0.3,
              }}
              aria-hidden
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
