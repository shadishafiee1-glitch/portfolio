"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Images, LayoutGrid, List, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CATEGORY_MAP, PORTFOLIO } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import type { NavigateFn } from "@/hooks/use-hash-route";
import { SmartImage } from "./smart-image";
import { NotFoundView } from "./not-found-view";

const ease = [0.22, 1, 0.36, 1] as const;

type ViewMode = "grid" | "list";

interface CategoryViewProps {
  categorySlug: string;
  navigate: NavigateFn;
}

export function CategoryView({ categorySlug, navigate }: CategoryViewProps) {
  const cat = PORTFOLIO.find((c) => c.slug === categorySlug) ?? CATEGORY_MAP[categorySlug];

  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const filterRef = useRef<HTMLDivElement | null>(null);

  // collect the union of tags across this category's projects
  const tags = useMemo(() => {
    if (!cat) return [];
    const set = new Set<string>();
    for (const p of cat.projects) for (const t of p.tags) set.add(t);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [cat]);

  const visibleProjects = useMemo(() => {
    if (!cat) return [];
    if (!activeTag) return cat.projects;
    return cat.projects.filter((p) => p.tags.includes(activeTag));
  }, [cat, activeTag]);

  // global "/" shortcut focuses the first tag chip; Esc clears the filter
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (typing) return;
      if (e.key === "/" && tags.length > 0) {
        e.preventDefault();
        const firstChip = filterRef.current?.querySelector<HTMLButtonElement>("[data-tag-chip]");
        firstChip?.focus();
      }
      if (e.key === "Escape" && activeTag) {
        setActiveTag(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tags.length, activeTag]);

  if (!cat) {
    return <NotFoundView label="Category" slug={categorySlug} navigate={navigate} />;
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
      {/* Breadcrumb */}
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease }}
        onClick={() => navigate({ kind: "home" })}
        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Index
        <span className="text-border">/</span>
        <span className="font-medium text-foreground">{cat.name}</span>
      </motion.button>

      {/* Heading */}
      <header className="mt-8 border-b border-border/60 pb-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="text-balance text-[clamp(2.4rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.03em]"
            >
              {cat.name}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
              className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {cat.description}
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.15 }}
            className="flex shrink-0 flex-col items-end gap-1"
          >
            <span
              className="display-text text-5xl leading-none"
              style={{ color: cat.accent }}
            >
              {String(visibleProjects.length).padStart(2, "0")}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {visibleProjects.length === 1 ? "Project" : "Projects"}
              {activeTag && " · filtered"}
            </span>
          </motion.div>
        </div>
      </header>

      {/* Filter bar + view toggle */}
      {tags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.2 }}
          className="mt-6 flex flex-wrap items-center justify-between gap-3"
        >
          <div ref={filterRef} className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Filter by tag">
            <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Filter
            </span>
            <FilterChip
              active={activeTag === null}
              onClick={() => setActiveTag(null)}
            >
              All
            </FilterChip>
            {tags.map((t) => (
              <FilterChip
                key={t}
                active={activeTag === t}
                accent={cat.accent}
                onClick={() => setActiveTag((cur) => (cur === t ? null : t))}
              >
                {t}
              </FilterChip>
            ))}
            {activeTag && (
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className="ml-1 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Clear filter"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
            <span className="ml-2 hidden text-[11px] text-muted-foreground/70 sm:inline">
              press <kbd className="rounded border border-border/70 bg-muted px-1 font-mono text-[10px]">/</kbd> to focus
            </span>
          </div>

          {/* View-mode toggle */}
          <div className="flex items-center gap-1 rounded-full border border-border/60 p-0.5" role="group" aria-label="View mode">
            <ViewToggle mode="grid" active={viewMode === "grid"} onClick={() => setViewMode("grid")} accent={cat.accent} />
            <ViewToggle mode="list" active={viewMode === "list"} onClick={() => setViewMode("list")} accent={cat.accent} />
          </div>
        </motion.div>
      )}

      {/* Projects */}
      {cat.projects.length === 0 ? (
        <EmptyState onBack={() => navigate({ kind: "home" })} />
      ) : visibleProjects.length === 0 ? (
        <div className="py-20 text-center">
          <p className="display-text text-3xl italic text-muted-foreground">
            No projects tagged &ldquo;{activeTag}&rdquo;.
          </p>
          <button
            onClick={() => setActiveTag(null)}
            className="mt-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm hover:bg-accent"
          >
            <X className="h-4 w-4" /> Clear filter
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:gap-x-8">
          {visibleProjects.map((project, i) => (
            <motion.article
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.06 * Math.min(i, 6) }}
              className={cn("group", i % 2 === 1 && "sm:mt-16 lg:mt-24")}
            >
              <ProjectCard project={project} cat={cat} navigate={navigate} />
            </motion.article>
          ))}
        </div>
      ) : (
        <ul className="mt-8 border-t border-border/60">
          {visibleProjects.map((project, i) => (
            <motion.li
              key={project.slug}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease, delay: 0.04 * Math.min(i, 8) }}
              className="group border-b border-border/60"
            >
              <button
                type="button"
                onClick={() =>
                  navigate({ kind: "project", categorySlug: cat.slug, projectSlug: project.slug })
                }
                className="flex w-full items-center gap-5 py-5 text-left transition-colors duration-300 sm:py-6"
                style={{ ["--accent" as string]: cat.accent }}
              >
                {/* thumb */}
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md border border-border/60 sm:h-16 sm:w-24">
                  {project.cover && (
                    <SmartImage
                      src={project.cover}
                      alt={project.name}
                      accent={cat.accent}
                      className="absolute inset-0 h-full w-full"
                    />
                  )}
                </div>
                {/* name + desc */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="truncate text-base font-semibold tracking-tight transition-colors group-hover:text-[color:var(--accent)] sm:text-lg">
                      {project.name}
                    </h3>
                    {project.year && (
                      <span className="shrink-0 font-mono text-xs text-muted-foreground">
                        {project.year}
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                  {project.tags.length > 0 && (
                    <div className="mt-1.5 hidden flex-wrap gap-1.5 sm:flex">
                      {project.tags.map((t) => (
                        <span
                          key={t}
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider transition-colors",
                            activeTag === t
                              ? "border-[color:var(--accent)] text-[color:var(--accent)]"
                              : "border-border/60 text-muted-foreground",
                          )}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {/* meta + arrow */}
                <div className="flex shrink-0 items-center gap-4">
                  <span className="hidden text-right text-xs text-muted-foreground sm:block">
                    <span className="block font-mono text-sm text-foreground/80">
                      {String(project.media.length).padStart(2, "0")}
                    </span>
                    <span className="block">pieces</span>
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-foreground/70 transition-all duration-300 group-hover:scale-110 group-hover:border-[color:var(--accent)] group-hover:bg-[color:var(--accent)] group-hover:text-white">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                </div>
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── sub-components ────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  cat,
  navigate,
}: {
  project: (typeof PORTFOLIO)[number]["projects"][number];
  cat: (typeof PORTFOLIO)[number];
  navigate: NavigateFn;
}) {
  return (
    <button
      type="button"
      onClick={() =>
        navigate({ kind: "project", categorySlug: cat.slug, projectSlug: project.slug })
      }
      className="block w-full text-left"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border/60">
        {project.cover && (
          <SmartImage
            src={project.cover}
            alt={project.name}
            accent={cat.accent}
            className="absolute inset-0 h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        )}
        <div className="pointer-events-none absolute inset-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/55 via-black/0 to-black/0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-white">
            <Images className="h-3.5 w-3.5" />
            {project.media.length} {project.media.length === 1 ? "piece" : "pieces"}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <span
          className="absolute left-3 top-3 h-2 w-2 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ backgroundColor: cat.accent }}
          aria-hidden
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-foreground">
          {project.name}
        </h3>
        {project.year && (
          <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
        )}
      </div>
      {project.description && (
        <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{project.description}</p>
      )}
    </button>
  );
}

function FilterChip({
  active,
  accent = "#1a1714",
  onClick,
  children,
}: {
  active: boolean;
  accent?: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      data-tag-chip
      onClick={onClick}
      aria-pressed={active}
      style={{ ["--accent" as string]: accent }}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition-all duration-200 outline-none",
        active
          ? "border-[color:var(--accent)] bg-[color:var(--accent)] text-white"
          : "border-border/70 text-foreground/70 hover:border-foreground/40 hover:bg-accent hover:text-foreground",
        "focus-visible:shadow-[inset_0_0_0_2px_var(--accent)]",
      )}
    >
      {children}
    </button>
  );
}

function ViewToggle({
  mode,
  active,
  onClick,
  accent,
}: {
  mode: ViewMode;
  active: boolean;
  onClick: () => void;
  accent: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${mode} view`}
      style={{ ["--accent" as string]: accent }}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 outline-none",
        active
          ? "bg-foreground text-background"
          : "text-muted-foreground hover:text-foreground",
        "focus-visible:shadow-[inset_0_0_0_2px_var(--accent)]",
      )}
    >
      {mode === "grid" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
    </button>
  );
}

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div className="py-24 text-center">
      <p className="display-text text-3xl italic text-muted-foreground">
        Projects coming soon.
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
        Drop a new project folder under{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
          public/resources/&lt;category&gt;/&lt;project&gt;/
        </code>{" "}
        and rebuild — it will appear here automatically.
      </p>
      <button
        onClick={onBack}
        className="mt-8 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm hover:bg-accent"
      >
        <ArrowLeft className="h-4 w-4" /> Back to index
      </button>
    </div>
  );
}
