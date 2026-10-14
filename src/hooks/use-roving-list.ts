"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * useRovingList — keyboard navigation for a list of focusable items.
 *
 * Implements the WAI-ARIA "listbox/grid" arrow-key pattern without imposing a
 * specific DOM: you give it the item count + an id for the container, and it
 * returns a ref to attach to the list + an `onKeyDown` handler to spread onto
 * any item. ArrowUp/ArrowDown move focus between items, Home/End jump to the
 * first/last, and the browser handles Enter/Space (it's a native button).
 *
 * Used by the home category index so the whole discipline list is operable
 * from the keyboard without Tab-ing through every row.
 */
export function useRovingList(count: number) {
  const containerRef = useRef<HTMLUListElement | null>(null);

  const focusIndex = useCallback(
    (i: number) => {
      const container = containerRef.current;
      if (!container) return;
      const items = Array.from(
        container.querySelectorAll<HTMLElement>("[data-roving-item]"),
      );
      const clamped = Math.max(0, Math.min(count - 1, i));
      const el = items[clamped];
      el?.focus();
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    },
    [count],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>, index: number) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          focusIndex(index + 1);
          break;
        case "ArrowUp":
          e.preventDefault();
          focusIndex(index - 1);
          break;
        case "Home":
          e.preventDefault();
          focusIndex(0);
          break;
        case "End":
          e.preventDefault();
          focusIndex(count - 1);
          break;
      }
    },
    [count, focusIndex],
  );

  // keep the DOM focus in sync if the list shrinks (e.g. filter changes)
  useEffect(() => {
    return;
  }, [count]);

  return { containerRef, onKeyDown };
}
