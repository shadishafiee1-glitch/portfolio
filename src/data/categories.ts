/**
 * Category configuration — the single source of truth for the portfolio's
 * category order, display names, and metadata.
 *
 * The filesystem layout under `public/resources/<slug>/<project-slug>/<media>`
 * is discovered automatically by `scripts/generate-manifest.ts`, but the
 * ordering, human label and accent color of each category are defined HERE so
 * the gallery always renders a deliberate, curated sequence.
 *
 * To add a brand new category:
 *   1. Append an entry here (the `slug` must match a folder under public/resources).
 *   2. Create `public/resources/<slug>/` and drop a project folder inside it.
 *   3. Run `bun run manifest` (it also runs automatically on `dev` / `build`).
 */

export interface CategoryConfig {
  /** Folder slug — must match the directory name under public/resources */
  slug: string;
  /** Human readable label shown in the UI */
  name: string;
  /** Short tagline shown on the category index */
  tagline: string;
  /** Two-line description shown on the category landing */
  description: string;
  /** Accent color (hex) used for hover states, progress bars, focus rings */
  accent: string;
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: "magazine",
    name: "Magazine",
    tagline: "Editorial & Layout",
    description:
      "Editorial design and magazine spreads — typography, rhythm and the choreography of print pages.",
    accent: "#b45309",
  },
  {
    slug: "design",
    name: "Design",
    tagline: "Graphic & Brand",
    description:
      "Graphic design explorations across identity, layout and composition — the craft of visual communication.",
    accent: "#0f766e",
  },
  {
    slug: "catalog-brochure",
    name: "Catalog & Brochure",
    tagline: "Print & Folio",
    description:
      "Catalogs, brochures and multi-page folios built for clarity, hierarchy and tactile print quality.",
    accent: "#9333ea",
  },
  {
    slug: "logo-design",
    name: "Logo Design",
    tagline: "Identity & Marks",
    description:
      "Logos and brand marks — distilled symbols, wordmarks and the systems that carry an identity.",
    accent: "#be123c",
  },
  {
    slug: "banner-design",
    name: "Banner Design",
    tagline: "Web & Display",
    description:
      "Web and display banners engineered for attention, conversion and responsive delivery.",
    accent: "#15803d",
  },
  {
    slug: "social-media-design",
    name: "Social Media Design",
    tagline: "Social & Content",
    description:
      "Social media creatives, campaigns and content systems built for scroll-stopping clarity.",
    accent: "#c2410c",
  },
  {
    slug: "poster-design",
    name: "Poster Design",
    tagline: "Posters & Print",
    description:
      "Posters and large-format print artwork — bold composition, contrast and a single decisive idea.",
    accent: "#1d4ed8",
  },
  {
    slug: "digital-painting",
    name: "Digital Painting",
    tagline: "Painting & Illustration",
    description:
      "Digital paintings and illustrations — colour, light and atmosphere rendered stroke by stroke.",
    accent: "#7c3aed",
  },
];

export const CATEGORY_MAP: Record<string, CategoryConfig> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);
