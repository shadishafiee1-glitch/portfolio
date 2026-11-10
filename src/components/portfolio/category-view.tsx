"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState, type CSSProperties } from "react";
import { CATEGORY_MAP, PORTFOLIO } from "@/data/portfolio";
import { BANNER_RATIOS } from "@/data/banner-ratios";
import { CATALOG_RATIOS } from "@/data/catalog-ratios";
import { POSTER_RATIOS } from "@/data/poster-ratios";
import { POSTER_PREVIEWS } from "@/data/poster-previews.generated";
import { PAINTING_RATIOS } from "@/data/painting-ratios";
import { SOCIAL_RATIOS, SOCIAL_REELS_COVERS, SOCIAL_STORIES } from "@/data/social-ratios";
import { cn } from "@/lib/utils";
import { assetUrl } from "@/lib/assets";
import type { NavigateFn } from "@/hooks/use-hash-route";
import { NotFoundView } from "./not-found-view";
import { Lightbox } from "./project-view";

const ease = [0.22, 1, 0.36, 1] as const;


interface CategoryViewProps {
  categorySlug: string;
  navigate: NavigateFn;
}

export function CategoryView({ categorySlug, navigate }: CategoryViewProps) {
  const cat = PORTFOLIO.find((c) => c.slug === categorySlug) ?? CATEGORY_MAP[categorySlug];

  const [catalogSlug, setCatalogSlug] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const inlineProjectSlug = categorySlug === "magazine" ? "dideban-magazine" : categorySlug === "catalog-brochure" ? "satrap-catalog" : null;
  const inlineProject = cat?.projects.find((project) => project.slug === inlineProjectSlug);
  const magazineMedia = inlineProject?.media ?? [];

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
      <header className="mt-8 pb-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="display-heavy inline-block text-balance text-[clamp(1.6rem,4vw,2.6rem)] text-foreground"
            >
              {cat.name}
              <span aria-hidden="true" className="mt-2 block h-1.5 w-24 rounded-full bg-[var(--accent)]" />
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
        </div>
      </header>
      {<hr className="h-[2px] w-full border-0 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent" />}

      {categorySlug === "catalog-brochure" ? (
        <section className="mt-4">
          <div role="group" aria-label="Catalog projects" className="flex gap-3 overflow-x-auto py-2">
            {[["all", "All"], ["satrap-catalog", "Satrap"], ["zino-catalog", "Zino"], ["parscenter", "ParsCenter"]].map(([slug, label]) => (
              <button key={slug} type="button" aria-pressed={catalogSlug === slug} onClick={() => setCatalogSlug(slug)} className={cn("shrink-0 rounded-full border border-[var(--accent)] px-6 py-2 font-semibold transition-colors", catalogSlug === slug ? "bg-[var(--accent)] text-white" : "text-[var(--accent)] hover:bg-[var(--accent)]/10")}>{label}</button>
            ))}
          </div>
          {catalogSlug === "all" ? (
            <CatalogGallery key="all" projects={["satrap-catalog", "zino-catalog", "parscenter", "presentation-design"].flatMap((slug) => cat.projects.filter((project) => project.slug === slug))} />
          ) : catalogSlug === "satrap-catalog" ? (
            cat.projects.filter((project) => project.slug === "satrap-catalog").map((project) => <AdditionalCatalog key={project.slug} project={project} />)
          ) : <CatalogGallery key={catalogSlug} projects={cat.projects.filter((project) => project.slug === catalogSlug)} showDescriptions />}
        </section>
      ) : inlineProjectSlug ? (
        <section className="mt-10" aria-labelledby="dideban-title">
          <h2 id="dideban-title" className="inline-flex rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-2 font-sans text-base font-semibold text-white">{inlineProject?.name}</h2>
          <div className="mt-6 grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
            {[0, 1, 2].map((column) => (
              <div key={column} className="contents lg:block lg:space-y-4">
            {magazineMedia.map((media, index) => index % 3 === column && (
              <button key={media.path} type="button" onClick={(event) => { event.stopPropagation(); setLightbox(index); }} aria-label={`Open ${inlineProject?.name} image ${index + 1}`} className="catalog-image-glow relative z-10 block w-full cursor-zoom-in overflow-hidden rounded-2xl pointer-events-auto">
                <img src={assetUrl(media.path)} alt={`${inlineProject?.name} — ${index + 1}`} className="block h-auto w-full" loading={index === 0 ? "eager" : "lazy"} />
                <GalleryOutline />
              </button>
            ))}
                {inlineProjectSlug === "satrap-catalog" && column === 1 && (
                  <div className="ml-4 mr-auto w-[calc(100%-1rem)] max-w-lg py-4 text-left text-base leading-8 sm:ml-8 sm:w-[calc(100%-2rem)] sm:py-8">
                    <h3 className="font-semibold text-foreground">Satrap | Corporate Catalog Design</h3>
                    <p className="mt-3 text-justify text-muted-foreground [text-align-last:left]" lang="en" style={{ hyphens: "none", overflowWrap: "normal", wordBreak: "normal" }}>
                      A bilingual catalog design showcasing Satrap’s banking solutions and risk management services. Featuring a clean, modern layout, bold typography, and a cohesive visual identity across both Persian and English editions.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Lightbox index={lightbox} total={magazineMedia.length} media={magazineMedia} accent="var(--accent)" onClose={() => setLightbox(null)} onThumb={setLightbox} onPrev={() => setLightbox((current) => current === null ? null : (current - 1 + magazineMedia.length) % magazineMedia.length)} onNext={() => setLightbox((current) => current === null ? null : (current + 1) % magazineMedia.length)} />
        </section>
      ) : (
      categorySlug === "banner-design" ? <BannerGallery projects={cat.projects} /> : categorySlug === "social-media-design" ? <SocialGallery projects={cat.projects} /> : categorySlug === "poster-design" ? <PosterGallery projects={cat.projects} /> : categorySlug === "digital-painting" ? <DigitalPaintingGallery projects={cat.projects} /> : <ProjectCollection key={categorySlug} hideSelectors={categorySlug === "logo-design"} projects={cat.projects} onBack={() => navigate({ kind: "home" })} />
    )}
    </div>
  );
}

/* ── sub-components ────────────────────────────────────────────────────── */

function GalleryOutline() {
  return (
    <svg aria-hidden="true" className="gallery-outline" width="100%" height="100%">
      <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="15" pathLength="1" />
    </svg>
  );
}

function ProjectCollection({ projects, onBack, hideSelectors = false }: { projects: (typeof PORTFOLIO)[number]["projects"]; onBack: () => void; hideSelectors?: boolean }) {
 const [selected, setSelected] = useState("all");
 if (!projects.length) return <EmptyState onBack={onBack} />;
 if (hideSelectors) return <LogoGallery projects={projects} />;
 return <section className="mt-4">
  <div role="group" aria-label="Projects" className="flex gap-3 overflow-x-auto py-2">
   {[{slug:"all",name:"All"}, ...projects].map((project) => <button key={project.slug} type="button" aria-pressed={selected === project.slug} onClick={() => setSelected(project.slug)} className={cn("shrink-0 rounded-full border border-[var(--accent)] px-6 py-2 font-semibold transition-colors", selected === project.slug ? "bg-[var(--accent)] text-white" : "text-[var(--accent)] hover:bg-[var(--accent)]/10")}>{project.name}</button>)}
  </div>
  {selected === "all" ? <AllCatalogs projects={projects} /> : projects.filter((project) => project.slug === selected).map((project) => <AdditionalCatalog key={project.slug} project={project} />)}
 </section>;
}

function PosterGallery({ projects }: { projects: (typeof PORTFOLIO)[number]["projects"] }) {
  const [index, setIndex] = useState<number | null>(null);
  const items = [...projects].sort((a, b) => Number(b.slug === "bank-tejarat") - Number(a.slug === "bank-tejarat"))
    .flatMap((project) => project.media.map((media) => ({ media, title: project.name })));
  const media = items.map((item) => item.media);
  const columns: number[][] = [[], [], [], []];
  const heightOf = (i: number) => 1 / (POSTER_RATIOS[items[i].media.path] ?? 1);
  // Unequal image counts create visibly staggered sizes while the solved
  // widths below still align the outside edges of the complete gallery.
  const placement = [0, 2, 1, 3, 0, 2, 1, 3, 0];
  items.forEach((_, i) => columns[placement[i % placement.length]].push(i));
  columns.forEach((column) => {
    if (column.length > 1) column.unshift(...column.splice(-1));
  });
  const deer = items.findIndex((item) => item.media.name === "01-deer-v2");
  const largePoster = items.findIndex((item) => item.media.name === "07-phishing-link");
  if (deer >= 0 && largePoster >= 0) {
    columns.forEach((column) => column.forEach((i, position) => {
      if (i === deer) column[position] = largePoster;
      else if (i === largePoster) column[position] = deer;
    }));
  }
  const active = columns.filter((column) => column.length);
  const sums = active.map((column) => column.reduce((sum, i) => sum + heightOf(i), 0));
  const inverseSum = sums.reduce((sum, value) => sum + 1 / value, 0);
  const offsets = sums.map((sum, c) => (active[c].length - 1) / sum);
  const correction = 16 * (offsets.reduce((sum, value) => sum + value, 0) - (active.length - 1));
  const tracks = sums.map((sum, c) => {
    const share = 1 / sum / inverseSum;
    return `calc(${share * 100}% + ${correction * share - 16 * offsets[c]}px)`;
  }).join(" ");
  return <section className="mt-8" aria-label="Poster design gallery">
    <div style={{ "--poster-tracks": tracks } as CSSProperties} className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-[var(--poster-tracks)] lg:gap-4">
      {active.map((column, c) => <div key={c} className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-4">
        {column.map((i, position) => <button key={items[i].media.path} type="button" onClick={() => setIndex(i)} aria-label={`Open ${items[i].title} ${i + 1}`} className="catalog-image-glow block w-full cursor-zoom-in overflow-hidden rounded-2xl">
          <img src={assetUrl(POSTER_PREVIEWS[items[i].media.path]?.variants[0].path ?? items[i].media.path)} srcSet={POSTER_PREVIEWS[items[i].media.path]?.variants.map((variant) => `${assetUrl(variant.path)} ${variant.width}w`).join(", ")} sizes="(min-width: 1400px) 360px, (min-width: 1024px) 28vw, (min-width: 640px) 48vw, 100vw" width={POSTER_PREVIEWS[items[i].media.path]?.width} height={POSTER_PREVIEWS[items[i].media.path]?.height} alt={`${items[i].title} — ${items[i].media.name}`} className="block h-auto w-full" loading={position === 0 ? "eager" : "lazy"} decoding="async" />
          <GalleryOutline />
        </button>)}
      </div>)}
    </div>
    <Lightbox index={index} total={media.length} media={media} accent="var(--accent)" onClose={() => setIndex(null)} onThumb={setIndex} onPrev={() => setIndex((i) => i === null ? null : (i - 1 + media.length) % media.length)} onNext={() => setIndex((i) => i === null ? null : (i + 1) % media.length)} />
  </section>;
}

function DigitalPaintingGallery({ projects }: { projects: (typeof PORTFOLIO)[number]["projects"] }) {
  const [index, setIndex] = useState<number | null>(null);
  const items = [...projects].sort((a, b) => Number(b.slug === "selected-paintings") - Number(a.slug === "selected-paintings"))
    .flatMap((project) => project.media.map((media) => ({ media, title: project.name, zoom: project.slug === "selected-paintings" })));
  const media = items.map((item) => item.media);
  const columns: number[][] = [[], [], []];
  const targets = [0.375, 0.25, 0.375].map((weight) => Math.floor(items.length * weight));
  for (let remaining = items.length - targets.reduce((sum, n) => sum + n, 0), c = 0; remaining > 0; remaining--, c++) targets[c % 3]++;
  let cursor = 0;
  targets.forEach((n, c) => { columns[c] = Array.from({ length: n }, () => cursor++); });
  const active = columns.filter((column) => column.length);
  const sums = active.map((column) => column.reduce((sum, i) => sum + 1 / (items[i].zoom ? 4 / 3 : PAINTING_RATIOS[items[i].media.path] ?? 1), 0));
  const inverseSum = sums.reduce((sum, value) => sum + 1 / value, 0);
  const offsets = sums.map((sum, c) => (active[c].length - 1) / sum);
  const correction = 16 * (offsets.reduce((sum, value) => sum + value, 0) - (active.length - 1));
  const tracks = sums.map((sum, c) => {
    const share = 1 / sum / inverseSum;
    return `calc(${share * 100}% + ${correction * share - 16 * offsets[c]}px)`;
  }).join(" ");
  return (
    <section className="mt-8" aria-label="Digital painting gallery">
      <div style={{ "--painting-tracks": tracks } as CSSProperties} className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-[var(--painting-tracks)] lg:gap-4">
        {active.map((column, c) => <div key={c} className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-4">
        {column.map((i) => {
          const item = items[i];
          return (
          <button key={item.media.path} type="button" onClick={() => setIndex(i)} aria-label={`Open ${item.title} ${i + 1}`} className="catalog-image-glow block w-full cursor-zoom-in overflow-hidden rounded-2xl">
            <img src={assetUrl(item.media.path)} alt={`${item.title} — ${i + 1}`} className={cn("block w-full", item.zoom ? "aspect-[4/3] object-cover" : "h-auto", item.zoom && (item.media.name === "07-painting" ? "scale-[1.45]" : ["02-painting", "05-painting"].includes(item.media.name) ? "scale-[1.3]" : "scale-[1.08]"))} style={item.zoom && item.media.name === "05-painting" ? { objectPosition: "48% center", transformOrigin: "48% 42%" } : item.zoom && item.media.name === "02-painting" ? { objectPosition: "54% center", transformOrigin: "54% 35%" } : item.zoom && item.media.name === "07-painting" ? { objectPosition: "52% center", transformOrigin: "52% 18%" } : item.zoom && item.media.name === "04-painting" ? { objectPosition: "40% center", transformOrigin: "40% center" } : undefined} loading={i < 2 ? "eager" : "lazy"} />
            <GalleryOutline />
          </button>
          );
        })}
        </div>)}
      </div>
      <Lightbox index={index} total={media.length} media={media} accent="var(--accent)" onClose={() => setIndex(null)} onThumb={setIndex} onPrev={() => setIndex((i) => i === null ? null : (i - 1 + media.length) % media.length)} onNext={() => setIndex((i) => i === null ? null : (i + 1) % media.length)} />
    </section>
  );
}

function SocialGallery({ projects }: { projects: (typeof PORTFOLIO)[number]["projects"] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const items = [...projects].sort((a, b) => Number(b.slug === "selected-social") - Number(a.slug === "selected-social"))
    .flatMap((project) => project.media.map((media) => ({ media, title: project.name,
      category: project.tags.includes("reels-cover") || (project.slug === "selected-social" && SOCIAL_REELS_COVERS.has(media.name)) ? "reels-cover" : project.slug === "selected-social" && SOCIAL_STORIES.has(media.name) ? "story" : project.tags.includes("post") ? "post" : project.tags.includes("story") ? "story" : (SOCIAL_RATIOS[media.name] ?? 1) < 0.65 ? "story" : "post",
    })))
    .filter((item) => filter === "all" || item.category === filter);
  const sequence = [1, 18, 8, 3, 13, 22, 6, 20, 2, 9, 24, 4, 16, 10, 21, 14, 7, 25, 11, 17, 19, 5, 12, 23, 15];
  items.sort((a, b) => sequence.indexOf(Number(a.media.name.slice(0, 2))) - sequence.indexOf(Number(b.media.name.slice(0, 2))));
  if (filter === "all") {
    const comic = items.findIndex((item) => item.media.name === "05-social");
    if (comic >= 0) items.unshift(...items.splice(comic, 1));
    const priority = (name: string) => name === "01-top-trader" ? 2 :
      ["01-social", "27-singapore-story", "28-aseman-story", "29-kish-story"].includes(name) ? 1 : 0;
    items.sort((a, b) => priority(a.media.name) - priority(b.media.name));
    const soon = items.findIndex((item) => item.media.name === "04-social");
    const aseman = items.findIndex((item) => item.media.name === "28-aseman-story");
    if (soon >= 0 && aseman >= 0) {
      [items[soon], items[aseman]] = [items[aseman], items[soon]];
    }
  }
  const media = items.map((item) => item.media);
  // Solve column widths from their total image heights, including every gutter,
  // so the varied-size columns share both their top and bottom edges.
  const bandCount = Math.ceil(items.length / 8);
  const balanced = filter === "all" || filter === "story";
  const bands = balanced
    ? Array.from({ length: bandCount }, (_, band) => {
      const start = Math.floor(band * items.length / bandCount);
      const end = Math.floor((band + 1) * items.length / bandCount);
      return Array.from({ length: end - start }, (_, i) => start + i);
    })
    : [items.map((_, i) => i)];
  const layouts = bands.map((indices, band) => {
    const columns: number[][] = [[], [], [], []];
    const targets = [0.2, 0.3, 0.15, 0.35].map((weight) => Math.floor(indices.length * weight));
    for (let remaining = indices.length - targets.reduce((sum, n) => sum + n, 0), c = 0; remaining > 0; remaining--, c++) targets[c % 4]++;
    let cursor = 0;
    targets.forEach((count, c) => {
      // Rotate the wide column between bands rather than stacking large covers.
      columns[(c + band) % 4] = indices.slice(cursor, cursor + count);
      cursor += count;
    });
    if (balanced) {
      // Four readable columns; balance actual artwork heights before solving
      // widths so a single cover cannot create an oversized column.
      columns.splice(0, columns.length, [], [], [], []);
      const loads = [0, 0, 0, 0];
      const heightOf = (i: number) => 1 / (SOCIAL_RATIOS[items[i].media.name] ?? (items[i].category === "post" ? 1 : 0.5625));
      [...indices].sort((a, b) => heightOf(b) - heightOf(a)).forEach((i) => {
        const order = [0, 1, 2, 3].map((c) => (c + band) % 4);
        const column = order.reduce((best, c) => loads[c] < loads[best] ? c : best, order[0]);
        columns[column].push(i);
        loads[column] += heightOf(i) + 0.05;
      });
      columns.forEach((column) => column.sort((a, b) => a - b));
    }
    const activeColumns = columns.filter((column) => column.length);
    const sums = activeColumns.map((column) => column.reduce((sum, i) => sum + 1 / (SOCIAL_RATIOS[items[i].media.name] ?? (items[i].category === "post" ? 1 : 0.5625)), 0));
    const inverseSum = sums.reduce((sum, value) => sum + 1 / value, 0);
    const gapOffsets = sums.map((sum, c) => (activeColumns[c].length - 1) / sum);
    const correction = 16 * (gapOffsets.reduce((sum, value) => sum + value, 0) - (activeColumns.length - 1));
    const tracks = sums.map((sum, c) => {
      const share = 1 / sum / inverseSum;
      return `calc(${share * 100}% + ${correction * share - 16 * gapOffsets[c]}px)`;
    }).join(" ");
    return { columns: activeColumns, tracks };
  });
  return (
    <section className="mt-4" aria-label="Social media gallery">
      <div role="group" aria-label="Social media categories" className="mb-6 flex gap-3 overflow-x-auto py-2">
        {[["all", "All"], ["reels-cover", "Reels Cover"], ["story", "Story"], ["post", "Post"]].map(([value, label]) => (
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => { setIndex(null); setFilter(value); }} className={cn("shrink-0 rounded-full border border-[var(--accent)] px-6 py-2 font-semibold transition-colors", filter === value ? "bg-[var(--accent)] text-white" : "text-[var(--accent)] hover:bg-[var(--accent)]/10")}>{label}</button>
        ))}
      </div>
      <div className="flex w-full flex-col gap-3 lg:gap-4">
      {layouts.map((layout, band) => (
        <div key={band} style={{ "--reel-tracks": layout.tracks } as CSSProperties} className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-[var(--reel-tracks)] lg:gap-4">
          {layout.columns.map((column, c) => (
            <div key={c} className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-4">
            {column.map((i) => {
              const item = items[i];
              return (
            <button key={item.media.path} type="button" onClick={() => setIndex(i)} aria-label={`Open ${item.title} ${i + 1}`} className="catalog-image-glow block w-full cursor-zoom-in overflow-hidden rounded-2xl">
              <img src={assetUrl(item.media.path)} alt={item.media.name} className="block h-auto w-full" loading="lazy" />
              <GalleryOutline />
            </button>
              );
            })}
            </div>
          ))}
        </div>
      ))}
      </div>
      <Lightbox index={index} total={media.length} media={media} accent="var(--accent)" onClose={() => setIndex(null)} onThumb={setIndex} onPrev={() => setIndex((i) => i === null ? null : (i - 1 + media.length) % media.length)} onNext={() => setIndex((i) => i === null ? null : (i + 1) % media.length)} />
    </section>
  );
}

function BannerGallery({ projects }: { projects: (typeof PORTFOLIO)[number]["projects"] }) {
  const [index, setIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const ordered = [...projects].sort((a, b) => Number(b.slug === "selected-banners") - Number(a.slug === "selected-banners"));
  const sequence = [1, 14, 2, 15, 3, 16, 4, 17, 5, 18, 6, 19, 20, 9, 22, 21, 10, 11, 12, 13, 7, 8];
  const items = ordered.flatMap((project) => project.media.map((media) => ({ media, title: project.name })))
    .filter((item) => {
      const number = Number(item.media.name.slice(0, 2));
      return filter === "all" || (filter === "proopco" ? number >= 10 && number <= 21 : filter === "part-software-group" ? [6, 7, 9, 22].includes(number) : [1, 2, 4, 5].includes(number));
    })
    .sort((a, b) => sequence.indexOf(Number(a.media.name.slice(0, 2))) - sequence.indexOf(Number(b.media.name.slice(0, 2))));
  const phoneIndex = items.findIndex((item) => item.media.path.endsWith("/08-finance-app.jpg"));
  if (phoneIndex >= 0) items.push(...items.splice(phoneIndex, 1));
  const media = items.map((item) => item.media);

  const columnCount = filter === "all" ? 3 : filter === "proopco" ? 4 : 2;
  const bandCount = Math.ceil(items.length / (columnCount * 3));
  const layouts = Array.from({ length: bandCount }, (_, band) => {
    const start = Math.floor(band * items.length / bandCount);
    const end = Math.floor((band + 1) * items.length / bandCount);
    const indices = Array.from({ length: end - start }, (_, i) => start + i);
    const columns: number[][] = Array.from({ length: Math.min(columnCount, indices.length) }, () => []);
    const loads = columns.map(() => 0);
    const heightOf = (i: number) => 1 / (BANNER_RATIOS[items[i].media.name] ?? 1);
    [...indices].sort((a, b) => heightOf(b) - heightOf(a)).forEach((i) => {
      const order = columns.map((_, c) => (c + band) % columns.length);
      const column = order.reduce((best, c) => loads[c] < loads[best] ? c : best, order[0]);
      columns[column].push(i);
      loads[column] += heightOf(i) + 0.05;
    });
    columns.forEach((column) => column.sort((a, b) => a - b));
    const sums = columns.map((column) => column.reduce((sum, i) => sum + heightOf(i), 0));
    const inverseSum = sums.reduce((sum, value) => sum + 1 / value, 0);
    const offsets = sums.map((sum, c) => (columns[c].length - 1) / sum);
    const correction = 16 * (offsets.reduce((sum, value) => sum + value, 0) - (columns.length - 1));
    const tracks = sums.map((sum, c) => {
      const share = 1 / sum / inverseSum;
      return `calc(${share * 100}% + ${correction * share - 16 * offsets[c]}px)`;
    }).join(" ");
    return { columns, tracks };
  });
  return (
    <section className="mt-4" aria-label="Banner design gallery">
      <div role="group" aria-label="Banner categories" className="mb-6 flex gap-3 overflow-x-auto py-2">
        {[["all", "All"], ["proopco", "Proopco"], ["magical-api", "Magical Api"], ["part-software-group", "Part Software Group"]].map(([value, label]) => (
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => { setIndex(null); setFilter(value); }} className={cn("shrink-0 rounded-full border border-[var(--accent)] px-6 py-2 font-semibold transition-colors", filter === value ? "bg-[var(--accent)] text-white" : "text-[var(--accent)] hover:bg-[var(--accent)]/10")}>{label}</button>
        ))}
      </div>
      <div className="flex w-full flex-col gap-3 lg:gap-4">
        {layouts.map((layout, band) => (
          <div key={band} style={{ "--banner-tracks": layout.tracks } as CSSProperties} className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-[var(--banner-tracks)] lg:gap-4">
            {layout.columns.map((column, c) => (
              <div key={c} className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-4">
                {column.map((i) => (
                  <button key={items[i].media.path} type="button" onClick={() => setIndex(i)} aria-label={`Open ${items[i].title} ${i + 1}`} className="catalog-image-glow block w-full cursor-zoom-in overflow-hidden rounded-2xl">
                    <img src={assetUrl(items[i].media.path)} alt={items[i].media.name} className="block h-auto w-full" loading="lazy" />
                    <GalleryOutline />
                  </button>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <Lightbox index={index} total={media.length} media={media} accent="var(--accent)" onClose={() => setIndex(null)} onThumb={setIndex} onPrev={() => setIndex((i) => i === null ? null : (i - 1 + media.length) % media.length)} onNext={() => setIndex((i) => i === null ? null : (i + 1) % media.length)} />
    </section>
  );
}

function LogoGallery({ projects }: { projects: (typeof PORTFOLIO)[number]["projects"] }) {
  const [index, setIndex] = useState<number | null>(null);
  const items = projects.flatMap((project) => project.media.map((media) => ({ media, title: project.name, description: project.description })));
  const standeaIndex = items.findIndex((item) => item.media.path.includes("/standea/"));
  if (standeaIndex > 1) {
    [items[1], items[standeaIndex]] = [items[standeaIndex], items[1]];
  }
  const media = items.map((item) => item.media);
  return (
    <section className="mt-8" aria-label="Logo design gallery">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:auto-rows-[220px] lg:grid-flow-dense lg:grid-cols-3 lg:auto-rows-[clamp(200px,22vw,300px)] lg:gap-4">
        {items.map((item, i) => (
          <button key={item.media.path} type="button" onClick={() => setIndex(i)} aria-label={`Open ${item.title}`}
            className={cn("catalog-image-glow block w-full cursor-zoom-in overflow-hidden rounded-2xl sm:h-full", i % 5 === 1 && "lg:row-span-2")}>
            <img src={assetUrl(item.media.path)} alt={item.title} className="block h-auto w-full object-cover sm:h-full" loading="lazy" />
            <GalleryOutline />
          </button>
        ))}
      </div>
      <Lightbox uniformFrame description={index === null ? undefined : items[index]?.description} index={index} total={media.length} media={media} accent="var(--accent)" onClose={() => setIndex(null)} onThumb={setIndex} onPrev={() => setIndex((i) => i === null ? null : (i - 1 + media.length) % media.length)} onNext={() => setIndex((i) => i === null ? null : (i + 1) % media.length)} />
    </section>
  );
}

const CATALOG_DESCRIPTIONS: Record<string, [string, string]> = {
  "satrap-catalog": [
    "Satrap | Corporate Catalog Design",
    "A bilingual catalog design showcasing Satrap’s banking solutions and risk management services. Featuring a clean, modern layout, bold typography, and a cohesive visual identity across both Persian and English editions."
  ],
  "zino-catalog": [
    "Zino | Product Catalog Design",
    "A modern, minimalist catalog design showcasing Zino, a smart wearable posture trainer designed to promote better sitting habits and spinal health."
  ],
  "parscenter": [
    "Pars Center | Corporate Brochure Design",
    "A modern corporate brochure design for Pars Center, a B2B online marketplace, featuring minimalist layouts, bold red accents, and engaging visual compositions."
  ],
  "presentation-design": [
    "Satrap | Presentation Design",
    "Two corporate presentations designed for Satrap, focusing on Credit Risk and Liquidity Risk Management, featuring modern typography, dynamic compositions, and a cohesive visual identity."
  ]
};

function CatalogGallery({ projects, showDescriptions = false }: { projects: (typeof PORTFOLIO)[number]["projects"]; showDescriptions?: boolean }) {
  const [index, setIndex] = useState<number | null>(null);
  const items = projects.flatMap((project) => project.media.map((media) => ({ media, title: project.name })));
  const media = items.map((item) => item.media);
  const count = Math.min(showDescriptions ? 2 : 3, items.length);
  if (!count) return null;
  const columns: number[][] = Array.from({ length: count }, () => []);
  const weights = count === 3 ? [0.33, 0.44, 0.23] : columns.map(() => 1 / count);
  const targets = weights.map((weight) => Math.floor(items.length * weight));
  for (let remaining = items.length - targets.reduce((sum, n) => sum + n, 0), c = 0; remaining > 0; remaining--, c++) targets[c % count]++;
  let cursor = 0;
  targets.forEach((n, c) => { columns[c] = Array.from({ length: n }, () => cursor++); });
  const active = columns.filter((column) => column.length);
  const sums = active.map((column) => column.reduce((sum, i) => sum + 1 / (CATALOG_RATIOS[items[i].media.path] ?? 1), 0));
  const inverseSum = sums.reduce((sum, value) => sum + 1 / value, 0);
  const offsets = sums.map((sum, c) => (active[c].length - 1) / sum);
  const correction = 16 * (offsets.reduce((sum, value) => sum + value, 0) - (active.length - 1));
  const tracks = sums.map((sum, c) => {
    const share = 1 / sum / inverseSum;
    return `calc(${share * 100}% + ${correction * share - 16 * offsets[c]}px)`;
  }).join(" ");
  return <section className="mt-6" aria-label="Catalog and brochure gallery">
    <div style={{ "--catalog-tracks": tracks } as CSSProperties} className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-[var(--catalog-tracks)] lg:gap-4">
      {active.map((column, c) => <div key={c} className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-4">
        {column.map((i) => <button key={items[i].media.path} type="button" onClick={() => setIndex(i)} aria-label={`Open ${items[i].title} ${i + 1}`} className="catalog-image-glow block w-full cursor-zoom-in overflow-hidden rounded-2xl">
          <img src={assetUrl(items[i].media.path)} alt={`${items[i].title} — ${i + 1}`} className="block h-auto w-full" loading="lazy" />
          <GalleryOutline />
        </button>)}
      </div>)}
    </div>
    {showDescriptions && <div className="mt-8 grid gap-6 sm:grid-cols-2">
      {projects.map((project) => { const [title, description] = CATALOG_DESCRIPTIONS[project.slug] ?? [project.name, project.description]; return <div key={project.slug} className="max-w-lg text-base leading-8">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {description && <p className="mt-3 text-muted-foreground">{description}</p>}
      </div>; })}
    </div>}
    <Lightbox index={index} total={media.length} media={media} accent="var(--accent)" onClose={() => setIndex(null)} onThumb={setIndex} onPrev={() => setIndex((i) => i === null ? null : (i - 1 + media.length) % media.length)} onNext={() => setIndex((i) => i === null ? null : (i + 1) % media.length)} />
  </section>;
}

function AllCatalogs({ projects }: { projects: (typeof PORTFOLIO)[number]["projects"] }) {
  const first = projects[0];
  if (!first) return null;
  return <AdditionalCatalog project={{ ...first, slug: "all-catalogs", name: "All catalogs", media: projects.flatMap((project) => project.media) }} />;
}

function AdditionalCatalog({ project, embedded = false }: { project: (typeof PORTFOLIO)[number]["projects"][number]; embedded?: boolean }) {
  const [index, setIndex] = useState<number | null>(null);
  const presentation = project.slug === "satrap-catalog" ? PORTFOLIO.find((category) => category.slug === "catalog-brochure")?.projects.find((item) => item.slug === "presentation-design") : undefined;
  return (
    <section aria-label={project.name} className={embedded ? undefined : "mt-3 p-4 sm:p-6"}>
      <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:gap-8">
        {[0, 1].map((column) => (
          <div key={column} className={cn("flex flex-col gap-6 lg:gap-8", column === 1 && "sm:pt-14 lg:pt-20")}>
        {project.media.map((media, i) => i % 2 === column && (
          <button key={media.path} type="button" onClick={() => setIndex(i)} aria-label={`Open ${project.name} image ${i + 1}`} className="catalog-image-glow block w-full cursor-zoom-in overflow-hidden rounded-2xl">
            <img src={assetUrl(media.path)} alt={`${project.name} — ${i + 1}`} className="block h-auto w-full" loading="lazy" />
            <GalleryOutline />
          </button>
        ))}
      {project.slug === "satrap-catalog" && column === 1 && (
        <div className="relative top-7 max-w-lg self-center text-base leading-8 sm:px-4">
          <h3 className="font-semibold text-foreground">Satrap | Corporate Catalog Design</h3>
          <p className="mt-3 text-justify text-muted-foreground [text-align-last:left]" lang="en" style={{ hyphens: "none", overflowWrap: "normal", wordBreak: "normal" }}>A bilingual catalog design showcasing Satrap’s banking solutions and risk management services. Featuring a clean, modern layout, bold typography, and a cohesive visual identity across both Persian and English editions.</p>
        </div>
      )}
      {project.slug === "zino-catalog" && column === 0 && (
        <div className="mt-7 max-w-lg text-base leading-8 sm:col-start-1 sm:ml-4">
          <h3 className="font-semibold text-foreground">Zino | Product Catalog Design</h3>
          <p className="mt-3 text-justify text-muted-foreground [text-align-last:left]" lang="en" style={{ hyphens: "none", overflowWrap: "normal", wordBreak: "normal" }}>
            A modern, minimalist catalog design showcasing Zino, a smart wearable posture trainer designed to promote better sitting habits and spinal health.
          </p>
        </div>
      )}
      {project.slug === "parscenter" && column === 0 && (
        <div className="mt-7 max-w-lg text-base leading-8 sm:col-start-1 sm:ml-4">
          <h3 className="font-semibold text-foreground">Pars Center | Corporate Brochure Design</h3>
          <p className="mt-3 text-justify text-muted-foreground [text-align-last:left]" lang="en" style={{ hyphens: "none", overflowWrap: "normal", wordBreak: "normal" }}>
            A modern corporate brochure design for Pars Center, a B2B online marketplace, featuring minimalist layouts, bold red accents, and engaging visual compositions.
          </p>
        </div>
      )}
      {!["satrap-catalog", "zino-catalog", "parscenter", "presentation-design", "all-catalogs"].includes(project.slug) && column === 0 && (
        <div className="mt-7 max-w-lg text-base leading-8 sm:ml-4">
          <h3 className="font-semibold text-foreground">{project.name}</h3>
          {project.description && <p className="mt-3 text-justify text-muted-foreground [text-align-last:left]" style={{ hyphens: "none" }}>{project.description}</p>}
        </div>
      )}
      {project.slug === "presentation-design" && column === 0 && (
        <div className="mt-7 max-w-lg text-base leading-8 sm:col-start-1 sm:ml-4">
          <h3 className="font-semibold text-foreground">Satrap | Presentation Design</h3>
          <p className="mt-3 text-justify text-muted-foreground [text-align-last:left]" lang="en" style={{ hyphens: "none", overflowWrap: "normal", wordBreak: "normal" }}>
            Two corporate presentations designed for Satrap, focusing on Credit Risk and Liquidity Risk Management, featuring modern typography, dynamic compositions, and a cohesive visual identity.
          </p>
        </div>
      )}

          </div>
        ))}
      </div>
      {presentation && (
        <>
          <hr className="my-12 h-[2px] w-full border-0 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent sm:my-16" />
          <AdditionalCatalog project={presentation} embedded />
        </>
      )}
      <Lightbox index={index} total={project.media.length} media={project.media} accent="var(--accent)" onClose={() => setIndex(null)} onThumb={setIndex} onPrev={() => setIndex((i) => i === null ? null : (i - 1 + project.media.length) % project.media.length)} onNext={() => setIndex((i) => i === null ? null : (i + 1) % project.media.length)} />
    </section>
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
