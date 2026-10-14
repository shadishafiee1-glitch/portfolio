"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "ss-portfolio:recent";
const MAX = 6;

export interface RecentEntry {
  categorySlug: string;
  projectSlug: string;
  name: string;
  /** ISO timestamp of the visit, used to sort newest-first. */
  at: number;
}

/**
 * useRecentlyViewed — a tiny localStorage-backed history of projects the
 * visitor has opened. Used by the search overlay to surface a "Recently
 * viewed" rail when the query is empty, so reopening search offers a fast
 * path back to whatever they were just looking at.
 *
 * Storage is namespaced + defensive (parse failures reset to empty). The
 * list is capped at MAX entries, newest first, deduplicated by
 * category/project slug.
 */
export function useRecentlyViewed() {
  const [recent, setRecent] = useState<RecentEntry[]>([]);

  // hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (Array.isArray(parsed)) setRecent(parsed.slice(0, MAX));
    } catch {
      // corrupt storage — reset
      try {
        localStorage.removeItem(KEY);
      } catch {}
    }
  }, []);

  const record = useCallback(
    (entry: Omit<RecentEntry, "at">) => {
      setRecent((prev) => {
        const key = `${entry.categorySlug}/${entry.projectSlug}`;
        const deduped = prev.filter(
          (e) => `${e.categorySlug}/${e.projectSlug}` !== key,
        );
        const next = [{ ...entry, at: Date.now() }, ...deduped].slice(0, MAX);
        try {
          localStorage.setItem(KEY, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [],
  );

  const clear = useCallback(() => {
    setRecent([]);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }, []);

  return { recent, record, clear };
}
