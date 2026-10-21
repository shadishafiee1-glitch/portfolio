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
              /* frosted-blue-glass card surface: a translucent blue tint over
                 the page so the background reads through, with a soft border
                 and drop shadow for depth. */
              backgroundColor: "rgba(0, 128, 255, 0.18)",
              backdropFilter: "blur(8px) saturate(120%)",
              WebkitBackdropFilter: "blur(8px) saturate(120%)",
              boxShadow:
                "inset 0 1px 0 0 rgba(255,255,255,0.4), 0 16px 40px -12px rgba(0,0,0,0.35)",
              border: "1px solid rgba(0, 128, 255, 0.30)",
            }}
          >
            <SmartImage
              src={src}
              alt=""
              accent="var(--accent)"
              className="h-full w-full border-0"
              /* The image is blurred (frosted glass) + a blue tint overlay sits
                 on top — the reference 'frosted blue glass' look, not a white
                 frost. */
              imgClassName="object-cover opacity-80 blur-[3px] saturate-110"
            />
            {/* cool blue tint wash over the image — the signature of the
               reference glass effect (NOT white). */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 mix-blend-screen"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,128,255,0.38) 0%, rgba(0,128,255,0.20) 50%, rgba(0,128,255,0.32) 100%)",
              }}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
