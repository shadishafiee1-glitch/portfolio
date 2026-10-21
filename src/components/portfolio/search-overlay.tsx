"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock, CornerDownLeft, FileText, Hash, Search, Tag, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { assetUrl } from "@/lib/assets";
import { ALL_TAGS, searchProjects, type SearchEntry } from "@/lib/search";
import { PORTFOLIO } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import type { NavigateFn } from "@/hooks/use-hash-route";
import type { RecentEntry } from "@/hooks/use-recently-viewed";

const ease = [0.22, 1, 0.36, 1] as const;

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  navigate: NavigateFn;
  /** Recently-viewed projects (from localStorage) — shown when query is empty. */
  recent: RecentEntry[];
}

/**
 * Command-palette-style global search overlay.
 *
 * Open via the header search button or the global Cmd/Ctrl+K shortcut (wired
 * in the app shell). Type to substring-search across every project by name,
 * description, tag, client, year or discipline. Arrow keys move the active
 * row, Enter navigates, Esc closes. Quick-filter tag chips narrow the query.
 *
 * When the query is empty, a "Recently viewed" rail surfaces the visitor's
 * last-opened projects (from localStorage) for a fast path back.
 *
 * Purely client-side: searches the build-time manifest, no network, no
 * rate-limit. Works on GitHub Pages (static export).
 */
export function SearchOverlay({ open, onClose, navigate, recent }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const results = useMemo<SearchEntry[]>(() => searchProjects(query, 8), [query]);

  // resolve recent entries to full SearchEntry-like objects (with category)
  const recentEntries = useMemo(() => {
    return recent
      .map((r) => {
        const category = PORTFOLIO.find((c) => c.slug === r.categorySlug);
        const project = category?.projects.find((p) => p.slug === r.projectSlug);
        if (!category || !project) return null;
        return { project, category, recent: r };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, [recent]);

  // focus the input when the overlay opens; reset the active row.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(0);
      return () => clearTimeout(t);
    }
    // clear the query shortly after close so reopening feels fresh
    const t = setTimeout(() => setQuery(""), 200);
    return () => clearTimeout(t);
  }, [open]);

  // lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // clamp active index when results change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive((a) => Math.min(a, Math.max(0, results.length - 1)));
  }, [results.length]);

  const choose = useCallback(
    (entry: { category: { slug: string }; project: { slug: string } } | undefined) => {
      if (!entry) return;
      navigate({
        kind: "project",
        categorySlug: entry.category.slug,
        projectSlug: entry.project.slug,
      });
      onClose();
    },
    [navigate, onClose],
  );

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => (results.length ? (a + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => (results.length ? (a - 1 + results.length) % results.length : 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        choose(results[active]);
      }
    },
    [results, active, choose, onClose],
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.28, ease }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl"
          >
            {/* input row */}
            <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3.5 sm:px-5">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKey}
                placeholder="Search projects, tags, disciplines…"
                className="flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
                aria-label="Search the portfolio"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* tag chips */}
            {ALL_TAGS.length > 0 && (
              <div className="custom-scroll flex items-center gap-2 overflow-x-auto border-b border-border/60 px-4 py-2.5 sm:px-5">
                {ALL_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setQuery(t)}
                    className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2.5 py-1 text-[11px] font-medium capitalize text-foreground/70 transition-colors hover:border-foreground/40 hover:bg-accent hover:text-foreground"
                  >
                    <Tag className="h-3 w-3" />
                    {t}
                  </button>
                ))}
              </div>
            )}

            {/* results */}
            <div className="custom-scroll max-h-[52vh] overflow-y-auto p-2">
              {query.trim() === "" ? (
                recentEntries.length > 0 ? (
                  <RecentRail
                    entries={recentEntries}
                    onChoose={(e) => choose(e)}
                  />
                ) : (
                  <EmptyHint />
                )
              ) : results.length === 0 ? (
                <NoResults query={query} />
              ) : (
                <ul role="listbox" aria-label="Search results">
                  {results.map((entry, i) => (
                    <li key={`${entry.category.slug}/${entry.project.slug}`}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onClick={() => choose(entry)}
                        aria-current={i === active ? "true" : undefined}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                          i === active ? "bg-accent" : "hover:bg-accent/50",
                        )}
                      >
                        {/* thumb */}
                        <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
                          {entry.project.cover && (
                            <img
                              src={assetUrl(entry.project.cover)}
                              alt=""
                              className="h-full w-full object-cover"
                              draggable={false}
                            />
                          )}
                        </div>
                        {/* text */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="truncate text-sm font-semibold tracking-tight">
                              {entry.project.name}
                            </span>
                            {entry.project.year && (
                              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                                {entry.project.year}
                              </span>
                            )}
                          </div>
                          {entry.project.description && (
                            <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                              {entry.project.description}
                            </p>
                          )}
                        </div>
                        {/* discipline pill */}
                        <span
                          className="hidden shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white sm:inline-flex"
                          style={{ backgroundColor: "var(--flame)" }}
                        >
                          <Hash className="h-2.5 w-2.5" />
                          {entry.category.name}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* footer */}
            <div className="flex items-center justify-between gap-4 border-t border-border/60 px-4 py-2.5 text-[11px] text-muted-foreground sm:px-5">
              <span className="inline-flex items-center gap-1.5">
                <kbd className="rounded border border-border/70 bg-muted px-1 font-mono text-[10px]">↑↓</kbd>
                navigate
                <kbd className="ml-2 rounded border border-border/70 bg-muted px-1 font-mono text-[10px]">↵</kbd>
                open
              </span>
              <span className="inline-flex items-center gap-1">
                {query.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : `${ALL_TAGS.length} tags`}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EmptyHint() {
  return (
    <div className="px-4 py-10 text-center">
      <FileText className="mx-auto h-8 w-8 text-muted-foreground/40" />
      <p className="mt-3 text-sm text-muted-foreground">
        Start typing to search across every discipline.
      </p>
      <p className="mt-1 text-xs text-muted-foreground/70">
        Try a project name, a tag like <span className="font-mono">print</span>, or a year.
      </p>
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="px-4 py-10 text-center">
      <Search className="mx-auto h-8 w-8 text-muted-foreground/40" />
      <p className="display-text mt-3 text-xl italic text-muted-foreground">
        Nothing matched &ldquo;{query}&rdquo;.
      </p>
      <p className="mt-1 text-xs text-muted-foreground/70">
        Try a tag chip above, or browse the index instead.
      </p>
    </div>
  );
}

function RecentRail({
  entries,
  onChoose,
}: {
  entries: { project: SearchEntry["project"]; category: SearchEntry["category"]; recent: RecentEntry }[];
  onChoose: (entry: SearchEntry) => void;
}) {
  return (
    <div className="p-2">
      <p className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        <Clock className="h-3 w-3" /> Recently viewed
      </p>
      <ul role="list" aria-label="Recently viewed projects">
        {entries.map(({ project, category, recent: r }) => (
          <li key={`${category.slug}/${project.slug}`}>
            <button
              type="button"
              onClick={() => onChoose({ project, category, haystack: "" })}
              className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent"
            >
              <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded-md border border-border/60 bg-muted">
                {project.cover && (
                  <img
                    src={assetUrl(project.cover)}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-semibold tracking-tight">
                    {project.name}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {relativeTime(r.at)}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {category.name}
                </p>
              </div>
              <span
                className="hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white sm:inline-block"
                style={{ backgroundColor: "var(--flame)" }}
              >
                {category.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Compact relative time, e.g. "2m ago", "3h ago", "yesterday". */
function relativeTime(at: number): string {
  const diff = Date.now() - at;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "yesterday";
  if (d < 7) return `${d}d ago`;
  // older than a week — show the date
  try {
    return new Date(at).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}
