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
            className="absolute -right-6 -top-6 h-[220px] w-[300px] -translate-y-1/2 overflow-hidden rounded-2xl"
            style={{
              /* The card itself is a frosted-glass surface: translucent white
                 fill + a strong backdrop blur so whatever is BEHIND the card
                 (the page) blurs and shows through. The image sits on top at
                 reduced opacity so the page genuinely reads through it when the
                 card moves. */
              backgroundColor: "rgba(255,255,255,0.30)",
              backdropFilter: "blur(18px) saturate(140%)",
              WebkitBackdropFilter: "blur(18px) saturate(140%)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.6), 0 16px 40px -12px rgba(0,0,0,0.40)",
              border: "1px solid rgba(255,255,255,0.35)",
            }}
          >
            <SmartImage
              src={src}
              alt=""
              accent="var(--accent)"
              className="h-full w-full border-0"
              /* The image is semi-transparent so the frosted page background
                 bleeds through it — this is what makes it read as 'glass'
                 rather than a solid photo card. */
              imgClassName="object-cover opacity-55"
            />
            {/* a soft white frost wash over the image to push the glass feel */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.20) 100%)",
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
