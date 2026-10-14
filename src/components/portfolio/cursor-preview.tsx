"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { SmartImage } from "./smart-image";

interface CursorPreviewProps {
  /** Cover path (relative to public/) to show, or null to hide. */
  src: string | null;
  /** Accent color used for the thin frame glow. */
  accent?: string;
}

/**
 * A floating image that trails the cursor with spring physics.
 *
 * This is the signature interaction of the home index — hovering a category
 * row summons its cover next to the pointer. Disabled on touch / coarse
 * pointers where there is no hover.
 */
export function CursorPreview({ src, accent = "#1a1714" }: CursorPreviewProps) {
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const springX = useSpring(x, { stiffness: 350, damping: 32, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 350, damping: 32, mass: 0.6 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(mq.matches);
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden md:block"
      style={{ x: springX, y: springY }}
    >
      <AnimatePresence mode="popLayout">
        {src ? (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.82, y: 12, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: -2 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="absolute -right-6 -top-6 h-[220px] w-[300px] -translate-y-1/2 overflow-hidden rounded-md border bg-card shadow-2xl"
            style={{
              boxShadow: `0 30px 60px -20px rgba(0,0,0,0.45), 0 0 0 1px ${accent}22`,
            }}
          >
            <SmartImage
              src={src}
              alt=""
              accent={accent}
              className="h-full w-full border-0"
              imgClassName="object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 ring-1 ring-inset"
              style={{ boxShadow: `inset 0 0 0 2px ${accent}30` }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
