"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { CATEGORY_MAP, PORTFOLIO } from "@/data/portfolio";
import { BANNER_RATIOS } from "@/data/banner-ratios";
import { SOCIAL_RATIOS } from "@/data/social-ratios";
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
            <AllCatalogs projects={["satrap-catalog", "zino-catalog", "parscenter", "presentation-design"].flatMap((slug) => cat.projects.filter((project) => project.slug === slug))} />
          ) : cat.projects.filter((project) => project.slug === catalogSlug).map((project) => <AdditionalCatalog key={project.slug} project={project} />)}
        </section>
      ) : inlineProjectSlug ? (
        <section className="mt-10" aria-labelledby="dideban-title">
          <h2 id="dideban-title" className="inline-flex rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-2 font-sans text-base font-semibold text-white">{inlineProject?.name}</h2>
          <div className="mt-6 grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:gap-8">
            {[0, 1].map((column) => (
              <div key={column} className={cn("space-y-6 lg:space-y-8", column === 1 && "sm:pt-14 lg:pt-20")}>
            {magazineMedia.map((media, index) => index % 2 === column && (
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
      categorySlug === "banner-design" ? <BannerGallery projects={cat.projects} /> : categorySlug === "social-media-design" ? <SocialGallery projects={cat.projects} /> : <ProjectCollection key={categorySlug} hideSelectors={categorySlug === "logo-design"} projects={cat.projects} onBack={() => navigate({ kind: "home" })} />
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

function SocialGallery({ projects }: { projects: (typeof PORTFOLIO)[number]["projects"] }) {
  const [index, setIndex] = useState<number | null>(null);
  const items = [...projects].sort((a, b) => Number(b.slug === "selected-social") - Number(a.slug === "selected-social"))
    .flatMap((project) => project.media.map((media) => ({ media, title: project.name })));
  const sequence = [1, 18, 8, 3, 13, 22, 6, 20, 2, 9, 24, 4, 16, 10, 21, 14, 7, 25, 11, 17, 19, 5, 12, 23, 15];
  items.sort((a, b) => sequence.indexOf(Number(a.media.name.slice(0, 2))) - sequence.indexOf(Number(b.media.name.slice(0, 2))));
  const group = (i: number) => {
    const n = Number(items[i].media.name.slice(0, 2));
    return n >= 18 ? "trading" : n >= 8 && n <= 12 ? "vending" : n === 13 || n === 14 ? "blog" : n === 2 || n === 3 ? "pulse" : n === 4 || n === 5 ? "comic" : "other-" + n;
  };
  const media = items.map((item) => item.media);
  const columns: number[][] = [[], [], [], []];
  const heights = [0, 0, 0, 0];
  const widths = [1.4, 1, 1, 1];
  items.forEach((item, i) => {
    const ratio = SOCIAL_RATIOS[item.media.name] ?? 1;
    const score = (col: number) => heights[col] + (columns[col].length && group(columns[col][columns[col].length - 1]) === group(i) ? 3 : 0);
    const column = heights.reduce((best, _, col) => score(col) < score(best) ? col : best, 0);
    columns[column].push(i);
    heights[column] += widths[column] / ratio + 0.05;
  });
  return (
    <section className="mt-8" aria-label="Social media gallery">
      <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-4">
        {columns.map((column, c) => (
          <div key={c} className="flex flex-col gap-3 lg:gap-4">
            {column.map((i) => (
              <button key={items[i].media.path} type="button" onClick={() => setIndex(i)} aria-label={`Open ${items[i].title} ${i + 1}`} className="catalog-image-glow block w-full cursor-zoom-in overflow-hidden rounded-2xl">
                <img src={assetUrl(items[i].media.path)} alt={items[i].media.name} className="block h-auto w-full" loading="lazy" />
                <GalleryOutline />
              </button>
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

  const mosaic: number[][] = [[], [], []];
  const heights = [0, 0, 0];
  const widths = [1.5, 1, 1];
  const placement = items.map((_, i) => i);
  const priority = placement.findIndex((i) => items[i].media.name.startsWith("02-"));
  if (priority >= 0) placement.unshift(...placement.splice(priority, 1));
  placement.forEach((i) => {
    const number = Number(items[i].media.name.slice(0, 2));
    const candidates = number === 6 ? [1, 2] : [0, 1, 2];
    const column = [2, 9].includes(number) ? 0 : candidates.reduce((best, col) => heights[col] < heights[best] ? col : best);
    mosaic[column].push(i);
    heights[column] += widths[column] / (BANNER_RATIOS[items[i].media.name] ?? 1) + 0.05;
  });
  return (
    <section className="mt-4" aria-label="Banner design gallery">
      <div role="group" aria-label="Banner categories" className="mb-6 flex gap-3 overflow-x-auto py-2">
        {[["all", "All"], ["proopco", "Proopco"], ["magical-api", "Magical Api"], ["part-software-group", "Part Software Group"]].map(([value, label]) => (
          <button key={value} type="button" aria-pressed={filter === value} onClick={() => { setIndex(null); setFilter(value); }} className={cn("shrink-0 rounded-full border border-[var(--accent)] px-6 py-2 font-semibold transition-colors", filter === value ? "bg-[var(--accent)] text-white" : "text-[var(--accent)] hover:bg-[var(--accent)]/10")}>{label}</button>
        ))}
      </div>
      {filter === "all" ? (
        <div className="grid grid-cols-1 items-start gap-3 sm:grid-cols-3 sm:grid-cols-[1.5fr_1fr_1fr] lg:gap-4">
          {mosaic.map((column, col) => (
            <div key={col} className="flex flex-col gap-3 lg:gap-4">
              {column.map((i) => (
                <button key={items[i].media.path} type="button" onClick={() => setIndex(i)} aria-label={`Open banner ${i + 1}`} className="catalog-image-glow block w-full cursor-zoom-in overflow-hidden rounded-2xl">
                  <img src={assetUrl(items[i].media.path)} alt={items[i].media.name} className="block h-auto w-full" loading="lazy" />
                  <GalleryOutline />
                </button>
              ))}
            </div>
          ))}
        </div>
      ) : (
      <div className={cn("columns-1 gap-3 sm:columns-2 lg:gap-4", filter === "proopco" ? "md:columns-3 lg:columns-4" : "lg:columns-2")}>
        {items.map((item, i) => (
          <button key={item.media.path} type="button" onClick={() => setIndex(i)} aria-label={`Open ${item.title} ${i + 1}`} className="catalog-image-glow mb-3 block w-full break-inside-avoid cursor-zoom-in overflow-hidden rounded-2xl lg:mb-4">
            <img src={assetUrl(item.media.path)} alt={item.media.name} className="block h-auto w-full" loading={i < 2 ? "eager" : "lazy"} />
            <GalleryOutline />
          </button>
        ))}
      </div>
      )}
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
