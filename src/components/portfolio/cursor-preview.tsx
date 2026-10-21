"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { SmartImage } from "./smart-image";

interface CursorPreviewProps {
  /** Cover path (relative to public/) to show, or null to hide. */
  src: string | null;
}

/**
 * A floating image that trails the cursor with spring physics.
 *
 * This is the signature interaction of the home index — hovering a discipline
 * name summons its cover beside the pointer. Disabled on touch / coarse
 * pointers where there is no hover.
 *
 * Styled as a frosted-glass card: no border stroke, rounded corners, a
 * translucent backdrop-blur surface, and a soft drop shadow — matching the
 * glassmorphism treatment used on the gallery image cards.
 */
export function CursorPreview({ src }: CursorPreviewProps) {
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
            className="absolute -right-6 -top-6 h-[220px] w-[300px] -translate-y-1/2 overflow-hidden rounded-2xl ring-1 ring-white/30 backdrop-blur-md"
            style={{
              /* a translucent fill so the page background blurs through the
                 card — true glassmorphism, the page shows from under the image */
              backgroundColor: "rgba(255,255,255,0.18)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.5), 0 12px 36px -12px rgba(0,0,0,0.35)",
            }}
          >
            <SmartImage
              src={src}
              alt=""
              accent="var(--accent)"
              className="h-full w-full border-0"
              /* slight transparency on the image itself so the frosted
                 background reads through it when the card moves */
              imgClassName="object-cover opacity-90"
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
