"use client";

import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, Download, X, Leaf, UserRound, ArrowUp, ThumbsUp, ThumbsDown, PanelsTopLeft, Plus, Rocket } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CATEGORY_MAP, PORTFOLIO } from "@/data/portfolio";
import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";
import type { NavigateFn } from "@/hooks/use-hash-route";
import { SmartImage } from "./smart-image";
import { NotFoundView } from "./not-found-view";
import { RelatedProjects } from "./related-projects";
import { ShareButton } from "./share-button";
import { StickyBackNav } from "./sticky-back-nav";
import { GalleryProgress } from "./gallery-progress";

const ease = [0.22, 1, 0.36, 1] as const;

interface ProjectViewProps {
  categorySlug: string;
  projectSlug: string;
  navigate: NavigateFn;
}

export function ProjectView({
  categorySlug,
  projectSlug,
  navigate,
}: ProjectViewProps) {
  const cat =
    PORTFOLIO.find((c) => c.slug === categorySlug) ??
    (CATEGORY_MAP[categorySlug]
      ? {
          ...CATEGORY_MAP[categorySlug],
          projects: [],
          cover: null,
          projectCount: 0,
        }
      : null);

  const project = cat?.projects.find((p) => p.slug === projectSlug);

  const [lightbox, setLightbox] = useState<number | null>(null);

  if (!cat || !project) {
    return (
      <NotFoundView
        label={cat ? "Project" : "Category"}
        slug={cat ? projectSlug : `${categorySlug}/${projectSlug}`}
        navigate={navigate}
      />
    );
  }

  const { prevProject, nextProject } = (() => {
    const idx = cat.projects.findIndex((p) => p.slug === project.slug);
    if (idx === -1) return { prevProject: null, nextProject: null };
    const n = cat.projects.length;
    return {
      prevProject: cat.projects[(idx - 1 + n) % n],
      nextProject: cat.projects[(idx + 1) % n],
    };
  })();

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
      {/* Sticky back-to-category pill (fades in on long scrolls) */}
      <StickyBackNav
        label={cat.name}
        accent="var(--flame)"
        onClick={() => navigate({ kind: "category", categorySlug: cat.slug })}
      />

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
      >
        <button
          onClick={() => navigate({ kind: "home" })}
          className="transition-colors hover:text-foreground"
        >
          Index
        </button>
        <span className="text-border">/</span>
        <button
          onClick={() => navigate({ kind: "category", categorySlug: cat.slug })}
          className="font-medium text-foreground transition-colors hover:text-[color:var(--accent)]"
          style={{ ["--accent" as string]: "var(--flame)" }}
        >
          {cat.name}
        </button>
        <span className="text-border">/</span>
        <span className="text-muted-foreground">{project.name}</span>
      </motion.div>

      {/* Header */}
      <header className="mt-8 grid gap-8 border-b-2 border-foreground pb-10 md:grid-cols-[1.5fr_1fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="display-heavy text-balance text-[clamp(2.4rem,9vw,6rem)]"
          >
            {project.name}
          </motion.h1>
          {project.description && (
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.1 }}
              className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {project.description}
            </motion.p>
          )}
          {project.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs font-medium text-foreground/80"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-6 flex items-center gap-3">
            <ShareButton projectName={project.name} />
            <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
              {project.media.length} {project.media.length === 1 ? "piece" : "pieces"} below
            </span>
          </div>
        </div>

        {/* meta */}
        <motion.dl
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="flex flex-col gap-4 text-sm md:items-end md:text-right"
        >
          <Meta label="Discipline" value={cat.name} />
          {project.year && <Meta label="Year" value={project.year} />}
          {project.client && <Meta label="Client" value={project.client} />}
          <Meta
            label="Pieces"
            value={`${project.media.length} ${
              project.media.length === 1 ? "file" : "files"
            }`}
          />
          {/* Live gallery progress / scroll-spy (desktop only, multi-piece only) */}
          <GalleryProgress total={project.media.length} accent="var(--flame)" />
        </motion.dl>
      </header>

      {/* Gallery */}
      <div className="mt-12 max-sm:grid max-sm:grid-cols-2 max-sm:items-start max-sm:gap-x-2 max-sm:gap-y-5 sm:space-y-16">
        {project.media.map((m, i) => (
          <motion.figure
            key={m.path}
            data-gallery-figure={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className={cn(
              "group relative min-w-0 scroll-mt-28",
              i % 2 === 1 && "md:ml-[12%]",
            )}
          >
            <button
              type="button"
              onClick={() => setLightbox(i)}
              className="block w-full overflow-hidden rounded-2xl ring-1 ring-foreground/10"
              aria-label={`Open ${m.name} in full screen`}
            >
              {m.type === "video" ? (
                <video
                  src={assetUrl(m.path)}
                  controls
                  playsInline
                  className="w-full"
                />
              ) : (
                <SmartImage
                  src={m.path}
                  alt={m.name}
                  priority={i < 2}
                  accent="var(--flame)"
                  className="aspect-[16/10] w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.03] sm:aspect-[16/9]"
                  caption={String(i + 1).padStart(2, "0")}
                />
              )}
            </button>
            <figcaption className="mt-3 flex items-center justify-between gap-2 sm:gap-4">
              <span className="min-w-0 break-words font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")} — {m.name}
              </span>
              <div className="flex items-center gap-3">
                <span
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ color: "var(--flame)" }}
                >
                  View ↗
                </span>
                {m.type === "image" && (
                  <a
                    href={assetUrl(m.path)}
                    download
                    aria-label={`Download ${m.name}`}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-border/70 text-muted-foreground opacity-0 transition-all duration-200 hover:bg-accent hover:text-foreground group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Download className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      {/* Related work — other disciplines sharing a tag */}
      {project.tags.length > 0 && (
        <RelatedProjects project={project} category={cat} navigate={navigate} />
      )}

      {/* Prev / Next project nav */}
      {cat.projects.length > 1 && (
        <motion.nav
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          aria-label="Project navigation"
          className="mt-20 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
        >
          {/* Prev */}
          {prevProject && prevProject.slug !== project.slug && (
            <button
              type="button"
              onClick={() =>
                navigate({
                  kind: "project",
                  categorySlug: cat.slug,
                  projectSlug: prevProject.slug,
                })
              }
              className="group flex items-center gap-4 rounded-xl border border-border/60 p-5 text-left transition-colors hover:bg-accent/60 sm:p-6"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/70 transition-all duration-300 group-hover:-translate-x-1 group-hover:border-[color:var(--accent)] group-hover:bg-[color:var(--accent)] group-hover:text-white"
                style={{ ["--accent" as string]: "var(--flame)" }}
              >
                <ChevronLeft className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Previous
                </span>
                <span className="display-text mt-0.5 block truncate text-xl italic sm:text-2xl">
                  {prevProject.name}
                </span>
              </span>
            </button>
          )}

          {/* Next */}
          {nextProject && nextProject.slug !== project.slug && (
            <button
              type="button"
              onClick={() =>
                navigate({
                  kind: "project",
                  categorySlug: cat.slug,
                  projectSlug: nextProject.slug,
                })
              }
              className="group flex items-center justify-end gap-4 rounded-xl border border-border/60 p-5 text-right transition-colors hover:bg-accent/60 sm:p-6 sm:col-start-2"
            >
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Next in {cat.name}
                </span>
                <span className="display-text mt-0.5 block truncate text-xl italic sm:text-2xl">
                  {nextProject.name}
                </span>
              </span>
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/70 transition-all duration-300 group-hover:translate-x-1 group-hover:border-[color:var(--accent)] group-hover:bg-[color:var(--accent)] group-hover:text-white"
                style={{ ["--accent" as string]: "var(--flame)" }}
              >
                <ChevronRight className="h-4 w-4" />
              </span>
            </button>
          )}
        </motion.nav>
      )}

      {/* Lightbox */}
      <Lightbox
        index={lightbox}
        total={project.media.length}
        onClose={() => setLightbox(null)}
        onPrev={() =>
          setLightbox((cur) =>
            cur === null ? null : (cur - 1 + project.media.length) % project.media.length,
          )
        }
        onNext={() =>
          setLightbox((cur) =>
            cur === null ? null : (cur + 1) % project.media.length,
          )
        }
        onThumb={(i) => setLightbox(i)}
        media={project.media}
        accent="var(--flame)"
      />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3 md:flex-col md:items-end md:gap-1">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}

function LogoIngredients({ path }: { path: string }) {
  const iconClass = "h-5 w-5";
  const parts = path.includes("/vatanparast.")
    ? [{ label: "V", symbol: "V" }, { label: "Leaf", symbol: <Leaf className={iconClass} /> }, { label: "Person", symbol: <UserRound className={iconClass} /> }, { label: "Growth", symbol: <ArrowUp className={iconClass} /> }]
    : path.includes("/standea/")
      ? [{ label: "Agree", symbol: <ThumbsUp className={iconClass} /> }, { label: "Disagree", symbol: <ThumbsDown className={iconClass} /> }, { label: "S", symbol: "S" }]
      : path.includes("/premium-gradient/")
        ? [{ label: "Task cards", symbol: <PanelsTopLeft className={iconClass} /> }, { label: "K", symbol: "K" }]
        : path.includes("/rocket-b/")
          ? [{ label: "B", symbol: "B" }, { label: "Rocket", symbol: <Rocket className={iconClass} /> }]
          : [];
  if (!parts.length) return null;
  return (
    <div className={cn("mt-5 flex shrink-0 items-center text-[var(--accent)] max-sm:mt-3 max-sm:pb-1", parts.length === 2 ? "gap-2" : "w-full justify-between")} aria-label="Logo elements">
      {parts.map((part, i) => (
        <div key={part.label} className="contents">
          {i > 0 && <Plus aria-hidden="true" className="h-3 w-3 shrink-0" />}
          <span aria-label={part.label} role="img" title={part.label} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--accent)] text-base font-semibold">
            {part.symbol}
          </span>
        </div>
      ))}
    </div>
  );
}

interface LightboxProps {
  index: number | null;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  /** Jump directly to a specific media index (used by the filmstrip). */
  onThumb: (i: number) => void;
  media: { path: string; name: string; type: "image" | "video" }[];
  accent: string;
  description?: string;
  uniformFrame?: boolean;
}

export function Lightbox({
  index,
  total,
  onClose,
  onPrev,
  onNext,
  onThumb,
  media,
  accent,
  description,
  uniformFrame = false,
}: LightboxProps) {
  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    if (index === null) return;
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [index, handleKey]);

  const current = index !== null ? media[index] : null;

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex h-dvh flex-col overflow-hidden bg-black/90 backdrop-blur-md"
          style={{ position: "fixed", inset: 0, zIndex: 200, height: "100dvh" }}
          onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
        >
          {/* top bar */}
          <div
            className="flex shrink-0 items-center justify-between px-5 py-4 text-white/80 sm:px-8"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em]">
              {String((index ?? 0) + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>

            <button
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition-colors hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* stage */}
          <div
            className="relative mx-auto flex min-h-0 w-full flex-1 items-center justify-center px-4 pb-4"
            onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.path}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease }}
                className={cn("relative flex h-full min-h-0 w-full flex-col items-center justify-center", (description || uniformFrame) && "gap-5 lg:flex-row lg:gap-6 lg:px-20", uniformFrame && "max-sm:gap-2 lg:max-w-[calc((100dvh-190px)*1.5+424px)] xl:max-w-[calc((100dvh-190px)*1.5+444px)]")}
                onClick={(e) => e.stopPropagation()}
              >
            {total > 1 && <div className="flex w-full shrink-0 items-center justify-between sm:hidden">
              <button type="button" onClick={onPrev} aria-label="Previous" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[var(--accent)]"><ChevronLeft className="h-4 w-4" /></button>
              <button type="button" onClick={onNext} aria-label="Next" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-[var(--accent)]"><ChevronRight className="h-4 w-4" /></button>
            </div>}
                <div className={cn("flex min-h-0 w-full flex-1 flex-col items-center justify-center lg:h-full lg:min-w-0", uniformFrame && "max-sm:flex-initial")}>
                {current.type === "video" ? (
                  <video
                    src={assetUrl(current.path)}
                    controls
                    autoPlay
                    playsInline
                    className="min-h-0 max-h-full max-w-[92vw] rounded-lg"
                  />
                ) : (
                  <div className={cn("flex min-h-0 max-h-full items-center justify-center overflow-hidden rounded-2xl", uniformFrame ? "aspect-[3/2] w-full" : "max-w-full")}>
                  <img
                    src={assetUrl(current.path)}
                    alt={current.name}
                    className={cn("block min-h-0 max-h-full rounded-2xl", uniformFrame ? "h-full w-full" : "h-auto w-auto max-w-full", uniformFrame && current.path.includes("/vatanparast.") ? "object-cover" : "object-contain")}
                  />
                  </div>
                )}
                </div>
                {description && (
                  <aside lang="en" style={{ hyphens: "none", overflowWrap: "normal", wordBreak: "normal" }} className="max-h-[25dvh] w-full shrink-0 overflow-y-auto px-3 pb-3 whitespace-pre-line text-left text-xs leading-relaxed text-white/85 max-sm:flex max-sm:max-h-none max-sm:flex-col max-sm:overflow-visible lg:max-h-full lg:w-[220px] lg:self-center lg:px-0 lg:text-sm xl:w-[240px]">
                    {description}
                    <LogoIngredients path={current.path} />
                  </aside>
                )}
              </motion.div>
            </AnimatePresence>

            {total > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                  }}
                  aria-label="Previous"
                  className="absolute left-2 top-1/2 hidden h-11 w-11 sm:inline-flex -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-[var(--accent)] transition-colors hover:bg-white/10 sm:left-6 sm:h-12 sm:w-12"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 hidden h-11 w-11 sm:inline-flex -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-[var(--accent)] transition-colors hover:bg-white/10 sm:right-6 sm:h-12 sm:w-12"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail filmstrip — only when more than 1 piece */}
          {total > 1 && (
            <div
              className="custom-scroll flex shrink-0 items-center gap-2 overflow-x-auto px-5 pb-4 pt-1 sm:px-8"
              onClick={(e) => e.stopPropagation()}
            >
              {media.map((m, i) => (
                <button
                  key={m.path}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onThumb(i);
                  }}
                  aria-label={`View ${m.name}`}
                  aria-current={i === index ? "true" : undefined}
                  className={cn(
                    "relative h-12 w-16 shrink-0 overflow-hidden rounded border transition-all duration-200 sm:h-14 sm:w-20",
                    i === index
                      ? "border-white/80 ring-2 ring-white/30"
                      : "border-white/15 opacity-55 hover:opacity-100",
                  )}
                >
                  {m.type === "video" ? (
                    <span className="flex h-full w-full items-center justify-center bg-white/10 text-[10px] font-mono text-white/70">
                      VID
                    </span>
                  ) : (
                    <img
                      src={assetUrl(m.path)}
                      alt=""
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
