"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, FileText, Hash, Search, Tag, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { assetUrl } from "@/lib/assets";
import { ALL_TAGS, searchProjects, type SearchEntry } from "@/lib/search";
import { cn } from "@/lib/utils";
import type { NavigateFn } from "@/hooks/use-hash-route";

const ease = [0.22, 1, 0.36, 1] as const;

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
  navigate: NavigateFn;
}

/**
 * Command-palette-style global search overlay.
 *
 * Open via the header search button or the global Cmd/Ctrl+K shortcut (wired
 * in the app shell). Type to substring-search across every project by name,
 * description, tag, client, year or discipline. Arrow keys move the active
 * row, Enter navigates, Esc closes. Quick-filter tag chips narrow the query.
 *
 * Purely client-side: searches the build-time manifest, no network, no
 * rate-limit. Works on GitHub Pages (static export).
 */
export function SearchOverlay({ open, onClose, navigate }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const results = useMemo<SearchEntry[]>(() => searchProjects(query, 8), [query]);

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
    (entry: SearchEntry | undefined) => {
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
                <EmptyHint />
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
                          style={{ backgroundColor: `${entry.category.accent}cc` }}
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
