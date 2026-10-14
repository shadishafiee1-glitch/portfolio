"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { CATEGORY_MAP, PORTFOLIO } from "@/data/portfolio";
import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";
import type { NavigateFn } from "@/hooks/use-hash-route";
import { SmartImage } from "./smart-image";

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
      <div className="mx-auto max-w-3xl px-5 py-32 text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          404
        </p>
        <h1 className="display-text mt-4 text-4xl">Project not found</h1>
        <button
          onClick={() => navigate({ kind: "home" })}
          className="mt-8 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm hover:bg-accent"
        >
          Back to index
        </button>
      </div>
    );
  }

  const nextProject = (() => {
    const idx = cat.projects.findIndex((p) => p.slug === project.slug);
    if (idx === -1) return null;
    return cat.projects[(idx + 1) % cat.projects.length];
  })();

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
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
          style={{ ["--accent" as string]: cat.accent }}
        >
          {cat.name}
        </button>
        <span className="text-border">/</span>
        <span className="text-muted-foreground">{project.name}</span>
      </motion.div>

      {/* Header */}
      <header className="mt-8 grid gap-8 border-b border-border/60 pb-10 md:grid-cols-[1.5fr_1fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="text-balance text-[clamp(2.2rem,7vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.03em]"
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
        </motion.dl>
      </header>

      {/* Gallery */}
      <div className="mt-12 space-y-10 sm:space-y-16">
        {project.media.map((m, i) => (
          <motion.figure
            key={m.path}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className={cn(
              "group relative",
              i % 2 === 1 && "md:ml-[12%]",
            )}
          >
            <button
              type="button"
              onClick={() => setLightbox(i)}
              className="block w-full overflow-hidden rounded-lg border border-border/60 bg-muted"
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
                  accent={cat.accent}
                  className="aspect-[16/10] w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.03] sm:aspect-[16/9]"
                  caption={String(i + 1).padStart(2, "0")}
                />
              )}
            </button>
            <figcaption className="mt-3 flex items-center justify-between gap-4">
              <span className="font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")} — {m.name}
              </span>
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                style={{ color: cat.accent }}
              >
                View ↗
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      {/* Next project */}
      {nextProject && nextProject.slug !== project.slug && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          onClick={() =>
            navigate({
              kind: "project",
              categorySlug: cat.slug,
              projectSlug: nextProject.slug,
            })
          }
          className="mt-20 flex w-full flex-col items-start gap-3 rounded-xl border border-border/60 p-6 text-left transition-colors hover:bg-accent/60 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Next in {cat.name}
            </span>
            <span className="display-text mt-1 block text-2xl italic sm:text-3xl">
              {nextProject.name}
            </span>
          </span>
          <ChevronRight
            className="h-6 w-6 shrink-0 text-muted-foreground"
            style={{ color: cat.accent }}
          />
        </motion.button>
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
        media={project.media}
        accent={cat.accent}
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

interface LightboxProps {
  index: number | null;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  media: { path: string; name: string; type: "image" | "video" }[];
  accent: string;
}

function Lightbox({
  index,
  total,
  onClose,
  onPrev,
  onNext,
  media,
  accent,
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

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[80] flex flex-col bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          {/* top bar */}
          <div
            className="flex items-center justify-between px-5 py-4 text-white/80 sm:px-8"
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
            className="relative flex flex-1 items-center justify-center px-4 pb-4"
            onClick={onClose}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={current.path}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25, ease }}
                className="relative max-h-[82vh] max-w-[92vw]"
                onClick={(e) => e.stopPropagation()}
              >
                {current.type === "video" ? (
                  <video
                    src={assetUrl(current.path)}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[82vh] max-w-[92vw] rounded-lg"
                  />
                ) : (
                  <SmartImage
                    src={current.path}
                    alt={current.name}
                    priority
                    accent={accent}
                    className="max-h-[82vh] max-w-[92vw] rounded-lg"
                    imgClassName="object-contain"
                  />
                )}
                <p className="mt-3 text-center font-mono text-xs text-white/60">
                  {current.name}
                </p>
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
                  className="absolute left-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white/90 transition-colors hover:bg-white/10 sm:left-6 sm:h-12 sm:w-12"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                  }}
                  aria-label="Next"
                  className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white/90 transition-colors hover:bg-white/10 sm:right-6 sm:h-12 sm:w-12"
                  style={{ color: accent }}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
