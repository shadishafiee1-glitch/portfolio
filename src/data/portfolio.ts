/**
 * Portfolio data barrel.
 *
 * Re-exports the generated filesystem manifest. The app imports from HERE
 * (`@/data/portfolio`) rather than the generated file directly, so the source
 * of the data can change without touching every component.
 */
export { PORTFOLIO, TOTAL_PROJECTS, TOTAL_CATEGORIES } from "./portfolio.generated";
export { CATEGORIES, CATEGORY_MAP } from "./categories";
export type { Category, Project, ProjectMedia, View } from "@/lib/types";
