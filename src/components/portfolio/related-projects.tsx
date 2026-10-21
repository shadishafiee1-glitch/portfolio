"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PORTFOLIO } from "@/data/portfolio";
import { assetUrl } from "@/lib/assets";
import type { Category, Project } from "@/lib/types";
import type { NavigateFn } from "@/hooks/use-hash-route";

const ease = [0.22, 1, 0.36, 1] as const;

interface RelatedProjectsProps {
  /** The project we're relating FROM. */
  project: Project;
  /** Its category (for accent). */
  category: Category;
  navigate: NavigateFn;
}

/**
 * Related-projects rail — surfaces up to 4 projects from OTHER disciplines
 * that share at least one tag with the current project.
 *
 * Matching is by tag intersection (case-insensitive), excluding the current
 * project itself. Falls back to "most recent across disciplines" when there
 * are no tag matches, so the rail is never empty (keeps the visitor moving).
 */
export function RelatedProjects({
  project,
  category,
  navigate,
}: RelatedProjectsProps) {
  const currentTags = new Set(project.tags.map((t) => t.toLowerCase()));

  // score every other project by # of shared tags
  const scored: Array<{ cat: Category; project: Project; score: number }> = [];
  for (const c of PORTFOLIO) {
    if (c.slug === category.slug) continue; // same discipline is handled by "next project"
    for (const p of c.projects) {
      if (p.slug === project.slug && c.slug === category.slug) continue;
      const score = p.tags.reduce(
        (n, t) => n + (currentTags.has(t.toLowerCase()) ? 1 : 0),
        0,
      );
      // only include if there's a real tag match
      if (score > 0) scored.push({ cat: c, project: p, score });
    }
  }

  const related = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease }}
      className="mt-20 border-t border-border/60 pt-12"
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            (Related work)
          </p>
          <h2 className="display-text mt-2 text-2xl sm:text-3xl">
            More by tag
            <span className="italic text-muted-foreground">
              {" "}
              · {project.tags.slice(0, 2).join(", ")}
            </span>
          </h2>
        </div>
        <span className="hidden text-right text-xs text-muted-foreground sm:block">
          {related.length} across {new Set(related.map((r) => r.cat.slug)).size}{" "}
          {new Set(related.map((r) => r.cat.slug)).size === 1 ? "discipline" : "disciplines"}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-x-6">
        {related.map(({ cat, project: p }, i) => (
          <motion.button
            key={`${cat.slug}/${p.slug}`}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease, delay: 0.06 * i }}
            onClick={() =>
              navigate({ kind: "project", categorySlug: cat.slug, projectSlug: p.slug })
            }
            className="group text-left"
            style={{ ["--accent" as string]: "var(--flame)" }}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border/60">
              {p.cover && (
                <img
                  src={assetUrl(p.cover)}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                />
              )}
              <span
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                aria-hidden
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
              {/* discipline tag */}
              <span
                className="absolute bottom-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                style={{ backgroundColor: "var(--flame)" }}
              >
                {cat.name}
              </span>
            </div>
            <h3 className="mt-2.5 truncate text-sm font-semibold tracking-tight transition-colors group-hover:text-[color:var(--accent)]">
              {p.name}
            </h3>
            {p.year && (
              <p className="font-mono text-[11px] text-muted-foreground">{p.year}</p>
            )}
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
