"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A thin reading-progress bar pinned to the top of the viewport.
 *
 * Uses framer-motion's scroll progress (0 → 1 over the whole document) smoothed
 * with a spring so it tracks the scroll position fluidly. Sits above the
 * header (z-[55]) and is pointer-events-none so it never intercepts clicks.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 right-0 top-0 z-[55] h-[3px] origin-left bg-foreground/25 dark:bg-foreground/30"
      style={{ scaleX }}
    />
  );
}
