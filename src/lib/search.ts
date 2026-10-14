import { PORTFOLIO } from "@/data/portfolio";
import type { Category, Project } from "@/lib/types";

/**
 * A flattened search index over the whole portfolio.
 *
 * Each entry is a single project annotated with its parent category, plus a
 * pre-computed `haystack` (lowercased name + description + tags + discipline
 * name) so the search overlay can do client-side substring matching without
 * re-walking the tree on every keystroke.
 */
export interface SearchEntry {
  project: Project;
  category: Category;
  haystack: string;
}

const ENTRIES: SearchEntry[] = PORTFOLIO.flatMap((category) =>
  category.projects.map((project) => ({
    project,
    category,
    haystack: [
      project.name,
      project.description,
      project.client ?? "",
      project.year ?? "",
      ...project.tags,
      category.name,
      category.tagline,
    ]
      .join(" ")
      .toLowerCase(),
  })),
);

export const SEARCH_ENTRIES = ENTRIES;

/**
 * Scored substring search. Returns entries whose haystack contains every
 * query term, ranked by (a) number of term matches then (b) name-starts-with.
 */
export function searchProjects(query: string, limit = 8): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  const scored = ENTRIES.map((entry) => {
    let score = 0;
    for (const term of terms) {
      const hits = entry.haystack.split(term).length - 1;
      if (hits <= 0) return null; // AND: every term must match
      score += hits;
      if (entry.project.name.toLowerCase().startsWith(term)) score += 5;
      if (entry.project.tags.some((t) => t.toLowerCase() === term)) score += 3;
    }
    return { entry, score };
  }).filter((x): x is { entry: SearchEntry; score: number } => x !== null);

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.entry);
}

/** Every distinct tag across the portfolio, for the quick-filter chips. */
export const ALL_TAGS: string[] = Array.from(
  new Set(PORTFOLIO.flatMap((c) => c.projects.flatMap((p) => p.tags))),
).sort((a, b) => a.localeCompare(b));
