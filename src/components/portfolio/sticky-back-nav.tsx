"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

interface StickyBackNavProps {
  /** Label shown on the pill (e.g. the category name). */
  label: string;
  /** Accent color for the pill dot + hover state. */
  accent: string;
  /** Click handler — typically navigates back to the category. */
  onClick: () => void;
  /** Scroll threshold (px) after which the pill fades in. Default 360. */
  threshold?: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * A compact "back to <category>" pill that fades in once the visitor scrolls
 * past the project header, so they always have a one-tap escape from a long
 * gallery without scrolling all the way back up.
 *
 * Sits centered below the sticky site header (top-20), pointer-events only
 * when visible, and respects reduced motion via the global CSS rule.
 */
export function StickyBackNav({
  label,
  accent,
  onClick,
  threshold = 360,
}: StickyBackNavProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > threshold);
    };
    onScroll(); // initialise
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease }}
          onClick={onClick}
          className="fixed left-1/2 top-20 z-40 -translate-x-1/2 rounded-full border border-border/70 bg-background/85 px-4 py-2 text-xs font-medium shadow-lg backdrop-blur-md transition-colors hover:bg-accent"
          aria-label={`Back to ${label}`}
          style={{ ["--accent" as string]: accent }}
        >
          <span className="inline-flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: accent }}
              aria-hidden
            />
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span className="text-muted-foreground">Back to</span>
            <span className="font-semibold text-foreground">{label}</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
