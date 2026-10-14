/**
 * generate-manifest.ts
 *
 * Scans `public/resources/<category>/<project>/<media>` and emits a typed
 * data module at `src/data/portfolio.generated.ts`. This is the bridge between
 * the raw filesystem (where Shadi drops new folders) and the single-page app.
 *
 * Run automatically via the `predev` / `prebuild` npm scripts, or manually
 * with `bun run manifest`.
 *
 * Discovery rules
 *  - A category is any folder directly under public/resources whose slug
 *    appears in CATEGORIES (src/data/categories.ts). Unknown folders are
 *    ignored so scratch/working folders never leak into the live site.
 *  - A project is any sub-folder of a category. Its slug is the folder name;
 *    its display name is humanized ("fashion-editorial" -> "Fashion Editorial")
 *    unless a `meta.json` overrides it.
 *  - Media files inside a project folder (jpg/jpeg/png/webp/gif/avif/svg/mp4/
 *    webm/mov) become that project's gallery, sorted naturally (01, 02, 10...).
 *  - A project `meta.json` may set: name, description, year, client, tags.
 *  - The first image (sorted) is the project cover; the first project's cover
 *    is the category cover.
 */

import { readdirSync, statSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { join, extname } from "node:path";
import { CATEGORIES } from "../src/data/categories";

const ROOT = join(process.cwd(), "public", "resources");
const OUT = join(process.cwd(), "src", "data", "portfolio.generated.ts");

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"];
const VIDEO_EXT = [".mp4", ".webm", ".mov"];
const MEDIA_EXT = [...IMAGE_EXT, ...VIDEO_EXT];

function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
}

function humanize(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();
}

function listDir(path: string): string[] {
  try {
    return readdirSync(path).filter((name) => !name.startsWith("."));
  } catch {
    return [];
  }
}

function isDir(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

function readMeta(projectDir: string): Record<string, unknown> | null {
  const metaPath = join(projectDir, "meta.json");
  if (!existsSync(metaPath)) return null;
  try {
    return JSON.parse(readFileSync(metaPath, "utf-8"));
  } catch {
    return null;
  }
}

interface ProjectMedia {
  path: string; // path relative to public/ root, e.g. resources/magazine/featured/01.jpg
  name: string;
  type: "image" | "video";
  ext: string;
}

interface Project {
  slug: string;
  name: string;
  description: string;
  year: string | null;
  client: string | null;
  tags: string[];
  cover: string | null;
  media: ProjectMedia[];
}

interface Category {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  cover: string | null;
  projectCount: number;
  projects: Project[];
}

function collect(): Category[] {
  const categories: Category[] = [];

  for (const cfg of CATEGORIES) {
    const catDir = join(ROOT, cfg.slug);
    if (!isDir(catDir)) {
      // category folder doesn't exist yet — emit empty placeholder so the UI
      // can still show the category card.
      categories.push({
        slug: cfg.slug,
        name: cfg.name,
        tagline: cfg.tagline,
        description: cfg.description,
        accent: cfg.accent,
        cover: null,
        projectCount: 0,
        projects: [],
      });
      continue;
    }

    const projects: Project[] = [];
    for (const projectSlug of listDir(catDir).sort(naturalCompare)) {
      const projectDir = join(catDir, projectSlug);
      if (!isDir(projectDir)) continue;

      const meta = readMeta(projectDir) || {};
      const media: ProjectMedia[] = [];

      for (const fileName of listDir(projectDir).sort(naturalCompare)) {
        const ext = extname(fileName).toLowerCase();
        if (!MEDIA_EXT.includes(ext)) continue;
        if (fileName.toLowerCase() === "meta.json") continue;
        const type: "image" | "video" = VIDEO_EXT.includes(ext) ? "video" : "image";
        media.push({
          path: `resources/${cfg.slug}/${projectSlug}/${fileName}`,
          name: fileName.replace(ext, ""),
          type,
          ext,
        });
      }

      if (media.length === 0) continue; // skip empty project folders

      const cover = media.find((m) => m.type === "image") ?? media[0];
      projects.push({
        slug: projectSlug,
        name: (meta.name as string) || humanize(projectSlug),
        description: (meta.description as string) || "",
        year: (meta.year as string) || null,
        client: (meta.client as string) || null,
        tags: Array.isArray(meta.tags) ? (meta.tags as string[]) : [],
        cover: cover.path,
        media,
      });
    }

    categories.push({
      slug: cfg.slug,
      name: cfg.name,
      tagline: cfg.tagline,
      description: cfg.description,
      accent: cfg.accent,
      cover: projects[0]?.cover ?? null,
      projectCount: projects.length,
      projects,
    });
  }

  return categories;
}

function serialize(categories: Category[]): string {
  const json = JSON.stringify(categories, null, 2);
  return `/**
 * AUTO-GENERATED by scripts/generate-manifest.ts — DO NOT EDIT BY HAND.
 *
 * Regenerate with \`bun run manifest\` (also runs automatically on dev/build).
 * Source of truth: the filesystem under public/resources/<category>/<project>/.
 */
import type { Category } from "@/lib/types";

export const PORTFOLIO: Category[] = ${json} as Category[];

export const TOTAL_PROJECTS = ${categories.reduce((n, c) => n + c.projects.length, 0)};
export const TOTAL_CATEGORIES = ${categories.length};
`;
}

const categories = collect();
const fileContent = serialize(categories);
writeFileSync(OUT, fileContent, "utf-8");

const totalProjects = categories.reduce((n, c) => n + c.projects.length, 0);
console.log(`[manifest] wrote ${OUT}`);
console.log(`[manifest] ${categories.length} categories, ${totalProjects} projects`);
for (const c of categories) {
  console.log(`  - ${c.slug.padEnd(22)} ${c.projectCount} project(s)${c.cover ? `  cover=${c.cover}` : ""}`);
}
