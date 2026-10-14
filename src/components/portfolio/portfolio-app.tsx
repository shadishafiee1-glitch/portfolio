"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useHashRoute } from "@/hooks/use-hash-route";
import { TOTAL_CATEGORIES, TOTAL_PROJECTS } from "@/data/portfolio";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { HomeView } from "./home-view";
import { CategoryView } from "./category-view";
import { ProjectView } from "./project-view";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Root client shell for the single-page portfolio.
 *
 * Layout uses a flex column with `min-h-screen` so the footer sticks to the
 * bottom on short pages and is pushed down naturally when content overflows.
 */
export function PortfolioApp() {
  const { view, navigate } = useHashRoute();

  return (
    <div className="grain flex min-h-screen flex-col bg-background">
      <SiteHeader view={view} navigate={navigate} />

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
    </div>
  );
}

function viewKey(view: ReturnType<typeof useHashRoute>["view"]): string {
  switch (view.kind) {
    case "home":
      return "home";
    case "category":
      return `cat:${view.categorySlug}`;
    case "project":
      return `proj:${view.categorySlug}/${view.projectSlug}`;
  }
}
