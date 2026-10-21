"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * A thin reading-progress bar pinned to the top of the viewport.
 *
 * Uses the flame accent (the portfolio's single color) over a black track so
 * it reads as part of the bold 3-color system.
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
      className="pointer-events-none fixed left-0 right-0 top-0 z-[55] h-[3px] origin-left bg-foreground/15"
      style={{ scaleX }}
    >
      <div className="h-full w-full bg-[var(--flame)]" />
    </motion.div>
  );
}
