"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHashRoute } from "@/hooks/use-hash-route";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { PORTFOLIO, TOTAL_CATEGORIES, TOTAL_PROJECTS } from "@/data/portfolio";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { ScrollProgress } from "./scroll-progress";
import { SearchOverlay } from "./search-overlay";
import { HomeView } from "./home-view";
import { CategoryView } from "./category-view";
import { ProjectView } from "./project-view";
import { AboutView } from "./about-view";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Root client shell for the single-page portfolio.
 *
 * Layout uses a flex column with `min-h-screen` so the footer sticks to the
 * bottom on short pages and is pushed down naturally when content overflows.
 * Hosts the global search overlay (Cmd/Ctrl+K) and records recently-viewed
 * projects for the search overlay's history rail.
 */
export function PortfolioApp() {
  const { view, navigate } = useHashRoute();
  const [searchOpen, setSearchOpen] = useState(false);
  const { recent, record } = useRecentlyViewed();

  // Global Cmd/Ctrl+K opens search; Esc closes (overlay handles Esc itself).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
      // bare "/" opens search too (unless already typing)
      if (e.key === "/" && !typing && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen]);

  // Record a project visit for the search overlay's "recently viewed" rail.
  useEffect(() => {
    if (view.kind !== "project") return;
    const cat = PORTFOLIO.find((c) => c.slug === view.categorySlug);
    const project = cat?.projects.find((p) => p.slug === view.projectSlug);
    if (cat && project) {
      record({
        categorySlug: cat.slug,
        projectSlug: project.slug,
        name: project.name,
      });
    }
  }, [view, record]);

  return (
    <div className="grain flex min-h-screen flex-col">
      <ScrollProgress />
      <SiteHeader
        view={view}
        navigate={navigate}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={viewKey(view)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease }}
          >
            {view.kind === "home" && <HomeView navigate={navigate} />}
            {view.kind === "about" && <AboutView navigate={navigate} />}
            {view.kind === "category" && (
              <CategoryView categorySlug={view.categorySlug} navigate={navigate} />
            )}
            {view.kind === "project" && (
              <ProjectView
                categorySlug={view.categorySlug}
                projectSlug={view.projectSlug}
                navigate={navigate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <SiteFooter
        totalCategories={TOTAL_CATEGORIES}
        totalProjects={TOTAL_PROJECTS}
      />

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        navigate={navigate}
        recent={recent}
      />
    </div>
  );
}

function viewKey(view: ReturnType<typeof useHashRoute>["view"]): string {
  switch (view.kind) {
    case "home":
      return "home";
    case "about":
      return "about";
    case "category":
      return `cat:${view.categorySlug}`;
    case "project":
      return `proj:${view.categorySlug}/${view.projectSlug}`;
  }
}
