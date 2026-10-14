"use client";

import { useCallback, useEffect, useState } from "react";
import type { View } from "@/lib/types";

/**
 * Hash-based router for the single-page portfolio.
 *
 * URL shapes:
 *   #/                                  -> home
 *   #/<categorySlug>                    -> category index
 *   #/<categorySlug>/<projectSlug>      -> single project gallery
 *
 * Hash routing is used (rather than file-based routes) so the site works as a
 * true single page on GitHub Pages with no server-side rewrites — a deep link
 * like .../portfolio/#/magazine always resolves to the right view.
 */

function parseHash(): View {
  if (typeof window === "undefined") return { kind: "home" };
  let hash = window.location.hash.replace(/^#/, "");
  if (hash.startsWith("/")) hash = hash.slice(1);
  if (!hash) return { kind: "home" };

  const parts = hash.split("/").filter(Boolean);
  if (parts.length === 1) {
    return { kind: "category", categorySlug: decodeURIComponent(parts[0]) };
  }
  if (parts.length >= 2) {
    return {
      kind: "project",
      categorySlug: decodeURIComponent(parts[0]),
      projectSlug: decodeURIComponent(parts[1]),
    };
  }
  return { kind: "home" };
}

function viewToHash(view: View): string {
  switch (view.kind) {
    case "home":
      return "#/";
    case "category":
      return `#/${encodeURIComponent(view.categorySlug)}`;
    case "project":
      return `#/${encodeURIComponent(view.categorySlug)}/${encodeURIComponent(view.projectSlug)}`;
  }
}

export function useHashRoute() {
  const [view, setView] = useState<View>(
    typeof window === "undefined" ? { kind: "home" } : parseHash(),
  );

  useEffect(() => {
    const onChange = () => setView(parseHash());
    window.addEventListener("hashchange", onChange);
    window.addEventListener("popstate", onChange);
    return () => {
      window.removeEventListener("hashchange", onChange);
      window.removeEventListener("popstate", onChange);
    };
  }, []);

  const navigate = useCallback((next: View) => {
    const hash = viewToHash(next);
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    // always scroll to top on view change for a fresh reading position
    window.scrollTo({ top: 0, behavior: "auto" });
    setView(next);
  }, []);

  return { view, navigate };
}

export type NavigateFn = ReturnType<typeof useHashRoute>["navigate"];
