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
 *   #/about                             -> long-form About view
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
  // special top-level routes first
  if (parts.length === 1 && parts[0] === "about") {
    return { kind: "about" };
  }
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
    case "about":
      return "#/about";
    case "category":
      return `#/${encodeURIComponent(view.categorySlug)}`;
    case "project":
      return `#/${encodeURIComponent(view.categorySlug)}/${encodeURIComponent(view.projectSlug)}`;
  }
}

export function useHashRoute() {
  // Initialise to `home` on BOTH server and first client render so the
  // hydration tree matches exactly (the server/build cannot know the URL
  // hash — it's client-only). After mount we read the real hash and sync.
  // This eliminates the "Hydration failed because the server rendered HTML
  // didn't match the client" warning on deep-link loads; the trade-off is a
  // single-frame flash of home on a deep-link load, which is unavoidable for
  // hash routers and only affects direct loads (not normal in-app nav).
  const [view, setView] = useState<View>({ kind: "home" });

  useEffect(() => {
    // sync to the current hash once mounted
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setView(parseHash());
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
