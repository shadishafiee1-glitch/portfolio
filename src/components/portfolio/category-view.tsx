"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Images } from "lucide-react";
import { CATEGORY_MAP, PORTFOLIO } from "@/data/portfolio";
import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";
import type { NavigateFn } from "@/hooks/use-hash-route";

const ease = [0.22, 1, 0.36, 1] as const;

interface CategoryViewProps {
  categorySlug: string;
  navigate: NavigateFn;
}

export function CategoryView({ categorySlug, navigate }: CategoryViewProps) {
  const cat = PORTFOLIO.find((c) => c.slug === categorySlug) ?? CATEGORY_MAP[categorySlug];

  if (!cat) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-32 text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          404
        </p>
        <h1 className="display-text mt-4 text-4xl">Category not found</h1>
        <button
          onClick={() => navigate({ kind: "home" })}
          className="mt-8 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" /> Back to index
        </button>
      </div>
    );
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
              {String(cat.projectCount).padStart(2, "0")}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {cat.projectCount === 1 ? "Project" : "Projects"}
            </span>
          </motion.div>
        </div>
      </header>

      {/* Project grid */}
      {cat.projects.length === 0 ? (
        <EmptyState onBack={() => navigate({ kind: "home" })} />
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:gap-x-8">
          {cat.projects.map((project, i) => {
            const isEven = i % 2 === 0;
            return (
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease, delay: 0.08 + i * 0.06 }}
                className={cn(
                  "group",
                  // offset every second item for an editorial masonry feel
                  i % 2 === 1 && "sm:mt-16 lg:mt-24",
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      kind: "project",
                      categorySlug: cat.slug,
                      projectSlug: project.slug,
                    })
                  }
                  className="block w-full text-left"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border/60 bg-muted">
                    {project.cover && (
                      <img
                        src={assetUrl(project.cover)}
                        alt={project.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                      />
                    )}
                    {/* hover overlay */}
                    <div className="absolute inset-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/45 via-black/0 to-black/0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-white">
                        <Images className="h-3.5 w-3.5" />
                        {project.media.length}{" "}
                        {project.media.length === 1 ? "piece" : "pieces"}
                      </span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                    {/* accent corner */}
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
                      <span className="font-mono text-xs text-muted-foreground">
                        {project.year}
                      </span>
                    )}
                  </div>
                  {project.description && (
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                </button>
              </motion.article>
            );
          })}
        </div>
      )}
    </div>
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
