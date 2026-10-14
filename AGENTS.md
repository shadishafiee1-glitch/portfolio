# AGENTS.md — Project Memory & Agent Log

> This file is the **single source of truth** for any agent (human or AI)
> working on the **Shadi Shafiee Portfolio**. It captures the product vision,
> architecture, conventions, the exact workflow for adding content, the
> deployment strategy, and a running changelog of decisions.
>
> **Read this first. Append to the changelog (never rewrite history).**

---

## 1. Product Overview

A single-page, statically-exported portfolio for **Shadi Shafiee**, a visual
designer. The interaction model is inspired by
[robin-noguier.com](https://robin-noguier.com/): a minimalist editorial
landing where hovering a discipline name summons a floating preview image, and
clicking enters that discipline's archive of projects.

**Live target:** GitHub Pages → `https://shadishafiee1-glitch.github.io/portfolio/`

### Disciplines (categories), in canonical order

| # | Slug                  | Label                | Tagline            |
|---|-----------------------|----------------------|--------------------|
| 01| `magazine`            | Magazine             | Editorial & Layout |
| 02| `design`              | Design               | Graphic & Brand    |
| 03| `catalog-brochure`    | Catalog & Brochure    | Print & Folio      |
| 04| `logo-design`         | Logo Design          | Identity & Marks   |
| 05| `banner-design`       | Banner Design        | Web & Display      |
| 06| `social-media-design` | Social Media Design  | Social & Content   |
| 07| `poster-design`       | Poster Design        | Posters & Print    |
| 08| `digital-painting`    | Digital Painting     | Painting & Illustration |

> The order, label, tagline, description and accent colour of every category
> are defined in **`src/data/categories.ts`** — edit there to curate the index.

---

## 2. Tech Stack

| Concern        | Choice                                                   |
|----------------|----------------------------------------------------------|
| Framework      | Next.js 16 (App Router)                                  |
| Language       | TypeScript 5                                             |
| Styling        | Tailwind CSS 4 + shadcn/ui (New York) + lucide icons     |
| Animation      | framer-motion                                            |
| Fonts          | Geist Sans/Mono + Instrument Serif (display), self-hosted|
| Routing        | Hash-based (`#/`, `#/<cat>`, `#/<cat>/<proj>`) — no SSR   |
| Data           | Build-time manifest generated from the filesystem         |
| Deployment     | GitHub Pages via GitHub Actions (static export)          |
| Theme          | next-themes (light/dark)                                 |
| Package mgr    | bun (dev) / bun in CI                                    |

**No database, no server runtime.** The whole site is a static export. The
"database" is the `public/resources/` folder tree itself.

---

## 3. Architecture

### Data flow (the core idea)

```
public/resources/<category>/<project>/<media-files>
            │
            ▼  scripts/generate-manifest.ts  (runs on predev / prebuild)
src/data/portfolio.generated.ts   ← typed manifest (committed)
            │
            ▼  imported by components
src/components/portfolio/*         ← renders the single page
```

The manifest generator scans the filesystem, humanises folder names, reads an
optional `meta.json` per project, sorts media naturally, and writes a typed
`PORTFOLIO` array. **To add work, you only touch the filesystem** — the build
re-discovers everything.

### Key files

| Path                                          | Purpose                                   |
|-----------------------------------------------|-------------------------------------------|
| `src/data/categories.ts`                      | Category order/names/accent (curate here) |
| `scripts/generate-manifest.ts`               | Filesystem → typed manifest               |
| `src/data/portfolio.generated.ts`             | Auto-generated manifest (do not hand-edit)|
| `src/data/portfolio.ts`                       | Data barrel re-export                     |
| `src/lib/types.ts`                            | `Category` / `Project` / `View` types     |
| `src/lib/assets.ts`                           | `assetUrl()` prefixes GitHub Pages basePath|
| `src/hooks/use-hash-route.ts`                 | Hash router for the single page           |
| `src/components/portfolio/portfolio-app.tsx`  | Root shell: header + view + footer        |
| `src/components/portfolio/home-view.tsx`      | Landing + category index + cursor preview |
| `src/components/portfolio/category-view.tsx`  | Project grid for a discipline             |
| `src/components/portfolio/project-view.tsx`   | Gallery + lightbox                        |
| `src/components/portfolio/cursor-preview.tsx` | Floating hover image (signature interaction)|
| `next.config.ts`                              | `output: export`, basePath `/portfolio`  |
| `.github/workflows/deploy.yml`                | Build & deploy to GitHub Pages             |
| `public/.nojekyll`                            | Disables Jekyll so `/_next/` is served    |

### Folder layout (repo)

```
public/
  resources/
    magazine/featured/magazine.jpg
    design/featured/design.png
    catalog-brochure/featured/catalog.jpg
    logo-design/featured/logo.jpg
    banner-design/featured/banner.jpg
    social-media-design/featured/social.jpg
    poster-design/featured/poster.jpg
    digital-painting/featured/painting.jpg
  .nojekyll
src/
  app/{layout,page,globals.css}
  components/{ui,portfolio,theme-provider.tsx}
  data/{categories,portfolio,portfolio.generated}.ts
  hooks/use-hash-route.ts
  lib/{assets,types,utils,db}.ts
scripts/generate-manifest.ts
.github/workflows/deploy.yml
```

---

## 4. How to add content  *(the most important workflow)*

### Add images to an existing project
Drop files into the project folder — they're picked up on the next build,
sorted naturally (`01.jpg` before `02.jpg` before `10.jpg`).

### Add a new project to an existing discipline
1. `mkdir public/resources/<category-slug>/<project-slug>`
2. Drop media there (jpg/png/webp/svg/mp4/webm/mov).
3. *(optional)* add `meta.json`:
   ```json
   { "name": "Fashion Editorial", "description": "…", "year": "2024",
     "client": "Vogue", "tags": ["print","typography"] }
   ```
4. Run `bun run manifest` (or just `bun run dev` — `predev` regenerates).
5. Commit + push → GitHub Actions rebuilds & deploys.

### Add a brand-new discipline
1. Append an entry to `src/data/categories.ts` (slug + label + accent).
2. `mkdir public/resources/<new-slug>/<first-project>/` and add media.
3. `bun run manifest`.

### Conventions
- Folder/file slugs: lowercase, hyphen-separated.
- Cover = first image (sorted) of the first project.
- `meta.json` is optional but recommended for richer cards.

---

## 5. Deployment & Branch Strategy

### Branching
- `main` — production; pushes here trigger the Pages deploy workflow.
- `dev` — integration branch for merged features.
- `feat/<topic>` — per-feature branches; merge into `dev`, then promote to `main`.

### GitHub Pages
- Workflow: `.github/workflows/deploy.yml` triggers on push to `main`/`dev`.
- It runs `bun install` → `bun run manifest` → `bun run build:static`
  (`next build`, NODE_ENV=production → basePath `/portfolio` applies).
- Output `out/` is uploaded as a Pages artifact and deployed.
- **Repo settings required (one-time):** Settings → Pages → Source =
  **GitHub Actions**.

### basePath
`next.config.ts` sets `basePath = "/portfolio"` in production (matches the
`<user>.github.io/portfolio/` URL) and `""` in dev so `localhost:3000` works
without a prefix. `next/image` & `next/link` apply it automatically; raw
`<img>`/`<video>` use `assetUrl()` from `src/lib/assets.ts`.

---

## 6. Design Decisions & Rationale

1. **Hash routing over file routing** — true single page, deep links work on
   GitHub Pages with zero server config (no 404 on refresh).
2. **Build-time manifest over runtime GitHub API** — no rate limits, instant
   load, works offline; the trade-off is "add images then push to rebuild",
   which the Actions workflow automates.
3. **Warm editorial palette (cream/ink/clay), no indigo/blue** — per the
   brief; accent colours are discipline-specific.
4. **Cursor-following preview** — the signature robin-noguier interaction;
   disabled on touch devices.
5. **Generated manifest is committed** — keeps the repo self-contained so the
   build succeeds even if the prebuild step is skipped.
6. **`.nojekyll`** — mandatory so GitHub Pages serves the `/_next/` asset dir.

---

## 7. Current State

- [x] 8 disciplines configured; 1 seed project each (the user's uploaded images
      + 1 AI-generated cover for the `design` discipline).
- [x] Manifest generator + predev/prebuild wiring.
- [x] Static export config + GitHub Actions workflow.
- [x] Home / Category / Project views with hash routing & view transitions.
- [x] Lightbox with keyboard nav.
- [x] Light/dark theme toggle.
- [x] Sticky footer, responsive, accessible.
- [ ] Real social/contact links (currently placeholders).
- [ ] More projects per discipline (drop folders + rebuild).
- [ ] Optional: project-level `meta.json` enrichment.

---

## 8. Changelog (agent log)

### 2025-10-14 — Initial build
- Bootstrapped the portfolio on top of the Next.js 16 sandbox scaffold.
- Created `public/resources/<8 categories>/featured/<cover>` with the 7
  user-uploaded images + 1 AI-generated cover for the `design` discipline.
- Wrote `scripts/generate-manifest.ts` (filesystem → typed manifest) and wired
  `predev`/`prebuild` scripts.
- Authored `src/data/categories.ts` (canonical order, labels, accents) and
  `src/lib/types.ts`.
- Configured `next.config.ts` for static export with prod `basePath=/portfolio`,
  `trailingSlash`, `images.unoptimized`, exposed `NEXT_PUBLIC_BASE_PATH`.
- Built the UI: `portfolio-app` shell, `home-view` (hero + marquee + numbered
  category index with cursor-following preview), `category-view` (editorial
  masonry grid), `project-view` (gallery + keyboard-driven lightbox),
  `site-header`, `site-footer` (sticky), `theme-toggle`.
- Warm editorial design system in `globals.css` (cream/ink palette, grain,
  marquee, float, custom scrollbar).
- Added GitHub Actions deploy workflow + `public/.nojekyll`.
- Added `README.md`.
- Verified via agent-browser: home/category/project navigation (hash routing),
  lightbox (open + Escape), theme toggle, sticky footer, mobile responsive.
  VLM image review confirmed the minimalist editorial design with no layout
  defects.

### ⚠️ Sandbox quirk (for agents working IN this sandbox)
The cloud-sandbox worktree is pinned to branch `main`. `git checkout` to a
feature branch is reverted by the environment; when reverted, tracked files
absent from the old `main` tree are removed from disk (causing
`ENOENT scandir src/app` and a blank page). **Mitigation:** commit on `main`,
or `git merge <feature> --ff-only` into `main` after committing on a feature
branch, before testing. Feature-branch refs persist and can still be pushed to
GitHub. All three local branches (`main`, `dev`, `feat/initial-portfolio`)
currently point at the same commit.

> **Next agent:** start by reading this file, then `/home/z/my-project/worklog.md`
> for the operational handover, then `bun run dev` and open the preview.
