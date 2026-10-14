/**
 * Shared domain types for the portfolio.
 *
 * The generated manifest (`src/data/portfolio.generated.ts`) is typed against
 * these interfaces so the rest of the app can import a single, reliable shape.
 */

export interface ProjectMedia {
  /** Path relative to the public/ root, e.g. resources/magazine/featured/01.jpg */
  path: string;
  name: string;
  type: "image" | "video";
  ext: string;
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  year: string | null;
  client: string | null;
  tags: string[];
  /** Path to the cover media (relative to public/). */
  cover: string | null;
  media: ProjectMedia[];
}

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: string;
  /** Category-level cover (first project's cover, or null). */
  cover: string | null;
  projectCount: number;
  projects: Project[];
}

export type View =
  | { kind: "home" }
  | { kind: "category"; categorySlug: string }
  | { kind: "project"; categorySlug: string; projectSlug: string };
