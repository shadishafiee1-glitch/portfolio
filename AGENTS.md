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

### 2025-10-15 — Round 10 (cron review): image-loading polish + features
- QA via agent-browser confirmed the site was stable (no bugs); proceeded to
  feature work.
- **SmartImage** (`src/components/portfolio/smart-image.tsx`): tinted shimmer
  placeholder + cross-fade-in on decode, applied to category covers, project
  gallery, lightbox, and cursor preview — eliminates the blank-flash on the
  large 1758×1080 source images. Cleanly separates the load-fade (img
  `transition-[opacity,filter]`) from consumer transforms (wrapper
  `group-hover:scale`).
- **ScrollProgress** (`scroll-progress.tsx`): thin top reading-progress bar
  (framer-motion `useScroll` + spring), wired into the app shell.
- **Home About/Contact section**: editorial bio statement, location/
  availability row, contact card with mailto CTA.
- **Enriched all 8 seed projects** with `meta.json` (name/description/year/
  client/tags); regenerated manifest. Cards + project headers now show real
  names + DISCIPLINE/YEAR/CLIENT/PIECES meta + tags.
- **OG image** (`public/og.png`, 1344×768) + **favicon.svg** (S monogram);
  wired `metadataBase`, icons, openGraph.images, twitter.images in `layout.tsx`.
- Verified: agent-browser (all features present, scroll bar moves, meta shows,
  shimmer renders, no errors) + VLM (cohesive, no defects) + `bun run lint` clean.
- Commit `f1b55fc` on `main`; `dev` + `feat/initial-portfolio` synced.

### 2025-10-15 — Round 11 (cron review): keyboard nav, graceful 404, filmstrip
- QA via agent-browser: no regressions from round 10; proceeded to features.
- **Keyboard navigation** on the home category index (`useRovingList` hook in
  `src/hooks/use-roving-list.ts` + wiring in `home-view`): ArrowUp/Down move
  focus between discipline rows, Home/End jump to first/last, Enter is native.
  Added a visible focus ring (inset accent `focus-visible` shadow) + a keyboard
  hint in the section subheading. The whole index is now operable without Tab.
- **NotFoundView** (`src/components/portfolio/not-found-view.tsx`): shared
  graceful 404 for unknown category/project hashes — editorial "Lost the
  thread." headline, offending slug in mono, primary CTA back to index +
  secondary discipline chips. Replaced the inline 404s in category-view &
  project-view.
- **Lightbox thumbnail filmstrip** (gated on >1 media): horizontally
  scrollable thumbnails with active-state ring + `aria-current`; clicking a
  thumb jumps directly to that piece. Added `onThumb` prop to `Lightbox`.
- Added a 2nd image to the magazine project (`02-spread-detail.png`) to
  exercise multi-media + the filmstrip; renamed original to `01-cover.jpg` so
  it stays the project cover (natural sort).
- Verified: agent-browser (arrow keys move focus correctly; 404 renders + chip
  recovery navigates; filmstrip shows 2 thumbs, click jumps to 02/02) + VLM
  (404 "graceful, helpful, clear recovery") + `bun run lint` clean.
- Commit `96e1365` on `main`; `dev` + `feat/initial-portfolio` synced.

### 2025-10-15 — Round 12 (cron review): category filter, list/grid toggle, related rail
- QA via agent-browser: no regressions; proceeded to features.
- **Category view tag-filter + view-mode toggle** (rewrote `category-view.tsx`):
  - `FilterChip` bar = union of all project tags in the category
    (All / Print / Typography …), accent-coloured active state, `aria-pressed`.
    Project count badge updates with the filter ("filtered" suffix); empty-
    filter state with a clear button.
  - `ViewToggle` grid/list: grid = existing editorial masonry; list = a dense
    single-column list (thumb + name/desc + inline tags + pieces + arrow).
    List-view tag chips highlight the active tag.
  - Global `/` shortcut focuses the first chip; Esc clears the filter. All
    chips/toggles have accent `focus-visible` rings.
- **RelatedProjects rail** (`src/components/portfolio/related-projects.tsx`):
  up to 4 projects from OTHER disciplines sharing a tag (scored by
  intersection, descending); each card labelled with its discipline
  (accent pill). Heading "More by tag · <tags>". Verified cross-discipline
  navigation (magazine → poster-design).
- **globals.css** a11y + polish: global `:focus-visible` ring;
  `prefers-reduced-motion` (kills marquee/float/shimmer/ping, collapses
  transitions); `@media print` (hides fixed bars + overlays, single column).
- Added 2nd projects to `poster-design` (Music Festival) & `logo-design`
  (Café Identity) with `meta.json` carrying shared tags so the filter,
  toggle, and related rail have real multi-project content. Manifest: 8
  categories, 10 projects.
- Verified: agent-browser (2 projects + filter bar + view toggle; Print
  filter → 2; list view inline tags; `/` focuses first chip; related rail
  4 cards + cross-discipline nav) + VLM (filter + toggle present, clean
  editorial grid) + `bun run lint` clean.
- Commit `7ab5df0` on `main`; `dev` + `feat/initial-portfolio` synced.

### 2025-10-15 — Round 13 (cron review): global search, share/download, more projects
- QA via: no regressions; proceeded to features.
- **Global Jess search (command-palette)**:
  - `src/lib/search.ts`: flattened index over the whole portfolio
    (name/description/tags/client/year/discipline); scored substring matching
    (name-starts-with + tag-exact boosts, AND semantics); `ALL_TAGS`.
  - `src/components/portfolio/search-overlay.tsx`: overlay with input,
    quick-filter tag chips, scored results (thumb + name + meta +
    discipline pill), `ArrowUp/Down` + `Enter` nav, `Esc` to close,
    body-scroll lock, empty + no-results states.
  - Triggers: header search button (with `/` kbd hint), global
    `Cmd/Ctrl+K`, bare `/` (when not typing).
- **Per-project ShareButton** (`share-button.tsx`) + `useClipboard` hook:
  builds a deep link from `window.location` (works on dev + GitHub Pages),
  uses Web Share API on capable devices, falls back to clipboard; transient
  "Copied" confirmation. Added to the project header.
- **Per-image download** button on each gallery figure (`<a download>`).
- Added 2nd projects to `banner-design` (Summer Sale) & `social-media-design`
  (Launch Campaign) with `meta.json`. Manifest: 8 categories, 12 projects
  (4 categories now multi-project).
- Verified: agent-browser (search opens via `/`/header/`Cmd+K`; "identity"
  → 5 results; `ArrowDown`×2 highlights "Event Poster"; `Enter` navigates
  + closes; `Esc` closes; share shows "Copied"; download anchor present) +
  VLM (clean, focused overlay) + `bun run lint` clean.
- Commit `df48759` on `main`; `dev` + `feat/initial-portfolio` synced.

### 2025-10-15 — Round 14 (cron review): prev/next nav, sticky back, populate grids
- QA via agent-browser: no regressions; proceeded to features.
- **Project view prev/next navigation** (replaced the single "next project"
  button): a two-card grid — Previous (left, `ChevronLeft`, hover
  translate-x) + Next (right, `ChevronRight`, hover translate-x) — each
  with an accent-coloured circular arrow, label + italic project name.
  Gated on `cat.projects.length > 1`. Verified: `poster-design/featured` →
  Previous navigates to Music Festival.
- **StickyBackNav** (`sticky-back-nav.tsx`): a compact "Back to <category>"
  pill that fades in (framer-motion `AnimatePresence`) once the visitor
  scrolls past ~360px — a one-tap escape from long galleries. Fixed
  top-center under the site header, accent dot + label. Verified:
  design project → scroll → pill → click navigates to `#/design`.
- Added 2nd projects to `design` (Brand Explorations), `catalog-brochure`
  (Seasonal Lookbook) & `digital-painting` (Portrait Study) with `meta.json`
  carrying shared tags. Manifest: 8 categories, 15 projects (7 of 8
  categories now multi-project — only magazine still single-project).
- Verified: agent-browser (prev/next nav renders; Previous navigates across
  projects; sticky pill appears on scroll + navigates to parent category;
  design category shows 2 projects) + VLM (clean editorial prev/next layout,
  clear arrows + labels, no layout issues) + `bun run lint` clean.
- Commit `bf5a449` on `main`; `dev` + `feat/initial-portfolio` synced.

### 2025-10-15 — Round 15 (cron review): About view, gallery scroll-spy, all grids multi
- QA via agent-browser: no regressions; proceeded to features.
- **About deep-link view** (`about-view.tsx`): long-form editorial bio with
  portrait, multi-paragraph statement, "In numbers" stats card (08/16/10+/∞),
  "How I work" approach card, a discipline index grid, and a contact CTA.
  Reachable from a new "About" link in the header. Router extended with an
  `about` `View` variant + `#/about` parsing (`types.ts`, `use-hash-route.ts`).
- **GalleryProgress** (`gallery-progress.tsx`): a live "01/02" counter +
  vertical scroll-spy dots in the project header (desktop, multi-piece).
  `IntersectionObserver` tracks the active gallery figure and highlights its
  dot; clicking a dot smooth-scrolls to that piece. Figures tagged
  `data-gallery-figure` + `scroll-mt-28`.
- Added 2nd magazine project (Cover Story) with `meta.json`. Manifest: 8
  categories, 16 projects — **every** category is now multi-project.
- Fixed a regression introduced this round: `GalleryProgress` referenced `ease`
  without defining it, causing a client-side `ReferenceError` that broke the
  project view (caught via `agent-browser errors --json`). Added the const.
- Verified: agent-browser (`#/about` renders H1 + portrait + 8 discipline
  chips + contact CTA + stats; header "About" link navigates; magazine shows 2
  projects; scroll-spy counter 01→02 + active dot tracks the figure) + VLM
  (About has portrait + bio + disciplines + contact) + `bun run lint` clean.
- Commit `882c399` on `main`; `dev` + `feat/initial-portfolio` synced.

### 2025-10-15 — Round 16 (cron review): hydration fix, search recently-viewed, GitHub push
- QA via agent-browser: confirmed the hydration mismatch error on deep-link
  loads (flagged as benign in round 15 — now fixed properly).
- **Hydration mismatch fix** (`use-hash-route.ts`): the router now initialises
  to `{kind:'home'}` on BOTH server and first client render (matching the SSR
  tree), then syncs to the real hash after mount in a `useEffect`. Eliminates
  the "Hydration failed" console error on direct deep-link loads. Trade-off:
  a single-frame flash of home on a deep-link load (unavoidable for hash
  routers; only affects direct loads). Verified: fresh deep-link → 0 errors.
- **Search "recently viewed" rail**:
  - `useRecentlyViewed` hook (`src/hooks/use-recently-viewed.ts`):
    localStorage-backed history of opened projects (capped at 6, newest-first,
    deduped by slug). Defensive parse. Key `ss-portfolio:recent`.
  - `SearchOverlay`: `RecentRail` in the empty state (query empty + history
    exists) — thumb + name + discipline + relative time ("2m ago",
    "yesterday"). `choose()` generalised to accept recent entries.
  - `portfolio-app`: records a visit whenever a project view mounts.
- `viewKey()` now handles the `about` variant (latent switch-exhaustiveness).
- **GitHub push** (user-provided PAT): authenticated remote set, `main` +
  `dev` + `feat/initial-portfolio` all pushed to
  `github.com/shadishafiee1-glitch/portfolio`. `main` tracks `origin/main`.
  The GitHub Actions deploy workflow (`.github/workflows/deploy.yml`) will
  build the static export + publish to Pages on push to `main`/`dev`.
- Verified: agent-browser (fresh deep-link → 0 hydration errors; visited 3
  projects → search empty state shows "RECENTLY VIEWED" rail with 3 entries
  newest-first; clicking the 2nd navigates + closes) + `bun run lint` clean.
- Commit `c258f54` on `main`; pushed to GitHub (`main`/`dev`/`feat`).

> **Next agent:** start by reading this file, then `/home/z/my-project/worklog.md`
> for the operational handover, then `bun run dev` and open the preview.
  **The repo is now live on GitHub** — verify the first GitHub Actions build
  + Pages deployment succeeded, then enable Pages (Settings → Pages →
  Source = GitHub Actions) if not already enabled.
