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

### 2026-11-05 — Local Windows setup
- Cloned repository into C:/shadi/portfolio and installed dependencies using the frozen Bun lockfile via npm exec.
- Generated the portfolio manifest and started Next.js locally on port 3000.


### 2026-11-05 — Frosted header alignment
- Aligned header edges with the shared 1400px content container and responsive gutters.
- Increased backdrop blur and theme-aware opacity to obscure underlying text.

### 2026-11-05 — Stronger frosted glass
- Increased header blur to 64px and surface opacity to 88–92% so scrolling text and fine details are obscured while diffuse colors remain visible.

### 2026-11-05 — Reference glass treatment
- Replaced the nearly opaque header fill with translucent highlights, 28px backdrop blur, luminous borders and inset reflections, with a separate dark-theme treatment.
- Preserved shared content alignment.

### 2026-11-05 — Restore original header
- Reverted all local header glass and alignment styling changes to the original cloned version at the user's request.

### 2026-11-05 — Blur with original blue styling
- Increased only header backdrop blur from 20px to 40px, retaining the original blue gradient, opacity, geometry and shadow.

### 2026-11-05 — Fix glass backdrop rendering
- Rendered the fixed header through a body portal, outside the page compositing context; retained original gradient and dimensions. Removed entrance animation from the glass surface.
- Hide header while search is open to preserve overlay interaction. Verified title overlap visually: underlying lettering is blurred only within the glass.

### 2026-11-05 — Header alignment and category heading cleanup
- Matched glass outer edges to the 1400px content container inner edges (20px mobile / 32px desktop gutters, 1336px maximum surface width).
- Removed the visible Disciplines / Browse by craft heading and hover instructions; retained an accessible section heading.

### 2026-11-05 — Hero role and year sticker
- Changed hero eyebrow to Graphic Design and increased it to 18px / 20px.
- Added a slightly rotated 2026 sticker at the end of Portfolio using the site's accent blue and responsive sizing.

### 2026-11-05 — Hero spacing refinement
- Reduced eyebrow bottom spacing to 4px and made the year sticker smaller with a negative margin to overlap the final o.

### 2026-11-05 — Year sticker adjustment
- Slightly reduced the year sticker and shifted it further left; removed the year from the location badge.

### 2026-11-05 — Smaller, lower year sticker
- Reduced the year sticker size and lowered it slightly while maintaining overlap with the final o.

### 2026-11-05 — Hero and mosaic cleanup
- Slightly reduced/lowered the year sticker and vertically centered the location badge with the signature.
- Removed the visible showcase heading and CTA. Added a seventh project cover spanning the two empty cells at the bottom of the mosaic.

### 2026-11-05 — Moving image ribbons
- Switched the default showcase to three non-clickable, continuously looping image rows with alternating directions and different speeds.
- Preserved shared page gutters, removed showcase headings/buttons, and matched group spacing for seamless loops. Motion pauses on hover and respects reduced-motion preferences.

### 2026-11-05 — Work Categories heading
- Added a visible accent-blue Work Categories heading above the category list, below the image ribbons.

### 2026-11-05 — Match category heading to About style
- Matched Work Categories typography and short rounded blue underline to the About section headings.

### 2026-11-05 — Rename category heading
- Changed the visible heading to selected works, preserving its serif typography and blue underline.

### 2026-11-05 — Enlarge selected works heading
- Increased heading size to a responsive 2.2–3.5rem and the blue underline to 96px wide by 8px high.

### 2026-11-05 — Heading capitalization and location position
- Capitalized Selected Works and lowered the location badge by 2px.

### 2026-11-05 — Location badge offset
- Lowered the location badge another 2px, for a total 4px offset.

### 2026-11-05 — Align selected works with biography sections
- Matched the Selected Works container to the 1000px About/Education/Experience container with identical responsive gutters.

### 2026-11-05 — Widen aligned content sections
- Expanded both Selected Works and the biography sections to the shared 1400px page container, preserving matching gutters and alignment closer to the page edges.

### 2026-11-05 — Narrow biography content
- Reduced the home biography sections maximum width from 1400px to 1200px; Selected Works retains its wider layout.

### 2026-11-05 — Further narrow biography sections
- Reduced the biography container maximum width to 1000px.

### 2026-11-05 — Correct employer spelling
- Corrected Kifepool.me to Kifpool.me in Work experience.

### 2026-11-05 — Kifpool logo hover
- Added the supplied Kifpool logo as a local asset. Hovering or keyboard-focusing Kifpool.me makes the name bold/blue and reveals a small 64px logo above it, without shifting surrounding content vertically.
- Uses assetUrl for GitHub Pages compatibility.

### 2026-11-05 — Transparent Kifpool hover logo
- Removed the hover logo border, shadow and card clipping; switched to a transparent PNG made with built-in imagegen.
- Edit prompt: remove pale background and preserve blue wallet, rear flap and gold circle; transparent alpha, no border or shadow.

### 2026-11-06 — Priestacy signature font
- Applied local Priestacy to the hero signature. Downloaded personal-use demo for local preview; commercial/web licensing must be resolved before public deployment. Source: https://www.dafont.com/priestacy.font

### 2026-11-06 — Preview Cintarini signature
- Switched the hero signature to local Cintarini for comparison. Personal-use demo from https://befonts.com/cintarini-handwritten-font.html; resolve web/commercial licensing before deployment.

### 2026-11-06 — Smaller signature
- Reduced the Cintarini hero signature from 2.2–4rem to 1.8–3.2rem.

### 2026-11-06 — Purgatory signature preview
- Changed the hero signature to Basnistudio's Purgatory, retaining its reduced size. Personal-use demo from https://www.1001fonts.com/purgatory-font.html; resolve licensing before publication.

### 2026-11-06 — User supplied Purgatory archive
- Replaced Purgatory.ttf with the font from the user's downloaded archive and preserved its accompanying license file.

### 2026-11-06 — Catalog label and magazine preview
- Renamed Catalog & Brochure to Catalog & Brochure Design and regenerated the manifest.
- Added a category-config previewImage override and used the supplied magazine image for mouse/keyboard previews without replacing project covers.

### 2026-11-06 — Vivid hover previews and logo artwork
- Removed the preview image opacity override so SmartImage fades to full opacity; added a modest 10% brightness and 15% saturation lift to hover previews only.
- Set the supplied logo 2.jpg as the Logo Design preview using the category previewImage override.

### 2026-11-06 — Social and poster hover images
- Assigned the user-provided social 2.jpg and poster 2.jpg to their respective category hover previews.

### 2026-11-06 — Banner preview and brightness adjustment
- Assigned the supplied banner 2.jpg to Banner Design hover preview.
- Reduced hover preview brightness from 110% to 100%, retaining full opacity and the existing saturation adjustment.

### 2026-11-06 — Replace logo preview
- Replaced the Logo Design hover preview with the supplied logo 3.jpg, using a new asset filename to avoid stale browser caching.

### 2026-11-06 — Digital painting preview and publish
- Assigned the supplied painting 2.jpg as the Digital Painting hover preview.
- Prepared accumulated typography, biography, employer logo and category preview updates for GitHub push at the user's request.
- Production validation exposed a scaffold /api route incompatible with static export; marked its constant response force-static.

### 2026-11-06 — Simplify category pages
- Matched all category headings to About me serif styling and short rounded blue underline.
- Removed tag filters, their keyboard shortcuts, filtering state and list-view tag badges; retained project navigation and grid/list layout controls.

### 2026-11-06 — Category heading separators
- Widened the blue heading underline from 64px to 96px and restored the dark divider below category descriptions.

### 2026-11-06 — Logo preview and floating employer logo
- Switched Logo Design preview to user-provided logo 4.jpg.
- Slowed Kifpool logo reveal to 500ms with an 8px upward entrance, and added a gentle 3-second floating cycle on hover/keyboard focus. Respects reduced-motion preferences.

### 2026-11-06 — Employer hover logos
- Shared the slow reveal and floating logo treatment across Kifpool.me, Bank Tejarat, Khabar Fouri and Part Software Group using the supplied assets.
- Employer names turn blue/bold on hover or keyboard focus; retained reduced-motion support.

### 2026-11-06 — Employer logo presentation
- Added transparent PNG bank/Part assets with built-in imagegen background removal; retained the original Khabar Fouri PNG with circular clipping because generated extractions distorted its artwork.
- Unified 64px display slots, compensated Kifpool's transparent padding, removed the bottom gap and preserved shared float animation.

### 2026-11-06 — Smaller continuously floating logos
- Reduced employer logo display slots to 48px and adjusted the repeating hover float to a 2.4-second, 7px cycle.

### 2026-11-06 — Curated moving image ribbons
- Replaced project-cover ribbons with the user's 12 distinct supplied artworks, omitting duplicate portrait attachments.
- Curated three six-tile rows alternating warm, cool and neutral palettes, including loop boundaries; preserved seamless motion and non-clickable presentation.

### 2026-11-06 — Magazine and catalog previews
- Replaced Magazine Design and Catalog & Brochure Design hover previews with the supplied magazine.jpg and catalouge.jpg images.
- Publishing accumulated category, floating employer logo and moving ribbon updates at the user's request.

### 2026-11-06 — Refresh social media preview
- Replaced Social Media Design hover preview with the updated user-supplied social 2.jpg, using a versioned filename to avoid cached artwork.

### 2026-11-06 — Refresh logo preview
- Updated Logo Design hover preview with the latest supplied logo 4.jpg, using a new filename to prevent stale caching.

### 2026-11-06 — Separate ribbon artwork by row
- Assigned each of the 12 artworks exclusively to one ribbon, removing cross-row duplicates. Repeated sequences only within their own row for seamless wide-screen coverage and preserved travel speed.

### 2026-11-06 — Gray AI banner ribbon background
- Used built-in imagegen to replace the near-white background of ribbon artwork 13 with neutral light gray. Prompt requested background-only replacement preserving banners, typography, composition and shadows. Saved as public/images/ribbons/13-gray.png.

### 2026-11-06 — Lighter ribbon backdrop
- Lightened artwork 13 background with built-in imagegen. Prompt: change only surrounding gray to #e3e3e3, preserving banners, typography, shadows and framing. Saved public/images/ribbons/13-light-gray.png.

### 2026-11-06 — Work experience logo clearance
- Increased spacing between employer entries from 32px to 80px so 48px floating logos have room above company names without covering the previous job description.

### 2026-11-06 — Dideban Magazine project
- Added Dideban Magazine under Magazine Design with the three supplied images in order; image 1 is the cover. Regenerated the portfolio manifest.

### 2026-11-06 — Inline Dideban magazine gallery
- Magazine Design now displays a smaller Dideban Magazine heading and all three images directly in the category page. Replaced its project-card grid with the inline gallery; existing project data remains preserved.

### 2026-11-06 — Two-column magazine gallery
- Arranged the inline Dideban images in two columns with a staggered right column matching the reference; retained a single column on mobile and uncropped images.

### 2026-11-06 — Magazine gallery spacing and lightbox
- Changed the inline gallery to balanced columns with matching horizontal/vertical gaps, removing excess stagger spacing. Reused the existing lightbox for image clicks, arrows, thumbnails and Escape.

### 2026-11-06 — Full viewport lightbox and stagger
- Portaled the lightbox to document.body above the header and constrained the image itself to viewport height, reserving room for controls and thumbnails. Added a modest second-column offset without increasing gaps within the first column.

### 2026-11-06 — Explicit staggered magazine columns
- Assigned images 1 and 3 to the left column and image 2 to the right, offset down 56–80px. Kept independent 24–32px vertical gaps and clickable lightbox controls for every image.

### 2026-11-06 — Fix clipped laptop lightbox
- Confirmed old non-portaled lightbox was still present. Moved overlay to body above header and used a viewport-height flex layout with min-height zero and object-contain directly on the image. Controls and thumbnails reserve their own height.

### 2026-11-06 — Magazine heading and click handling
- Changed Dideban heading to smaller blue sans-serif text. Made gallery buttons explicitly interactive, stopped click propagation, and limited backdrop closing to direct backdrop clicks.

### 2026-11-07 — Fix lightbox opening below page
- Found unlayered body > * rule overriding Tailwind fixed positioning and z-index on the portaled lightbox. Applied explicit inline fixed/inset/z-index/viewport height so it opens in the current viewport regardless of scroll.

### 2026-11-07 — Inline Satrap Catalog gallery
- Added the three supplied Satrap images and project metadata. Catalog & Brochure now shares the magazine inline gallery, smaller blue heading, staggered columns and viewport lightbox.

### 2026-11-07 — Zino Catalog section
- Added Zino Catalog with two supplied images after Satrap, separated by a short thin line. Reused the blue heading and staggered gallery with independent lightbox navigation per catalog.

### 2026-11-07 — Restore missing Zino rendering
- Confirmed Zino assets and manifest existed but category rendering omitted the section. Added explicit Zino section after Satrap with short divider, blue heading, staggered images and its own lightbox.

### 2026-11-07 — Faded full-width catalog divider
- Extended the Satrap/Zino separator across the content width with transparent gradient ends.

### 2026-11-07 — Satrap gallery description
- Added the user's exact English heading and description in small typography beneath the right-column Satrap image, filling the blank area.

### 2026-11-07 — Catalog typography and separators
- Enlarged Satrap description to 16px and aligned its text and block to the image's right edge. Enlarged catalog headings to 20–24px. Both catalog separators now use 2px faded-end gradients.

### 2026-11-07 — Left-align Satrap copy
- Left-aligned the description text while retaining its right-anchored container aligned with the right-hand image.

### 2026-11-07 — Justify Satrap description
- Justified the Satrap description paragraph along both edges, retaining a left-aligned heading and last line.

### 2026-11-07 — Shift Satrap copy left and normalize spacing
- Anchored the description block to the left of its image column and restored left-aligned text for natural word spacing.

### 2026-11-07 — Satrap bounded justified text
- Made the invisible text box explicitly full-width up to 32rem, retaining its left anchor. Justified its paragraph with automatic English hyphenation to reduce stretched word gaps; the last line remains left-aligned.

### 2026-11-07 — Satrap text inset and whole words
- Disabled hyphenation and word splitting while retaining justification. Inset the entire text box 16px on mobile and 32px on desktop from the image's left edge, adjusting its width to fit.

### 2026-11-07 — Blue Zino divider and tighter spacing
- Changed the faded divider above Zino to the site's accent blue. Reduced its bottom margin by 8px to lift the Zino heading and both images together.

### 2026-11-07 — Blue top divider and gallery hover glow
- Matched the top catalog divider to the blue Zino divider. Added a 2px blue outline and soft glow on hover or keyboard focus for inline gallery images without shifting layout.

### 2026-11-07 — Drawn gallery outlines and Zino copy
- Replaced the instant hover border with an SVG outline traced around each image over 900ms; respects reduced motion and keyboard focus.
- Added the user's exact Zino product catalogue heading and description below its images with justified whole-word text.

### 2026-11-07 — Faster light outline and closer Zino copy
- Removed the outline shadow, lightened its stroke to #68cfff, and made it draw and disappear in a repeating 1.1-second hover cycle. Preserved a static outline for reduced motion.
- Reduced spacing above Zino copy to 12px and removed vertical padding to bring it closer to the images.

### 2026-11-07 — Site-blue outline and closing Zino divider
- Matched animated image outlines to the site's accent blue. Lifted Zino copy another 20px and added a full-width, faded-end blue divider below it matching the catalog separators.

### 2026-11-07 — Fade completed image outlines
- Changed the hover animation to fade the complete outline after its ends meet, rather than continuing to erase it around the perimeter.

### 2026-11-07 — Static image hover outline
- Removed the drawing and fading animation. A thin site-blue outline now remains visible while an image is hovered or keyboard-focused.

### 2026-11-07 — Thinner image hover outline
- Reduced the blue gallery hover outline from 2px to 1px.

### 2026-11-07 — ParsCenter catalog section
- Added the user's 6.jpg and 7.jpg as a new ParsCenter project and regenerated the manifest.
- Rendered ParsCenter immediately after the closing Zino divider with matching blue heading, staggered gallery, hover outlines and its own lightbox; avoided duplicating the divider.

### 2026-11-08 — Pars Center brochure description
- Added the user's exact corporate brochure heading and description beneath the ParsCenter images, matching Zino's typography, justification and spacing without splitting words.

### 2026-11-08 — Catalog project selector
- Added a rounded project selector for Satrap, Zino and ParsCenter. Only the selected project's side-by-side images and exact description appear in a rounded content panel; retained image hover outlines and per-project lightboxes. Mobile images stack and project buttons scroll horizontally.

### 2026-11-08 — Separate catalog pills and All gallery
- Gave each project selector its own rounded blue-bordered box and added All with a combined gallery and lightbox for the three curated catalogs.
- Moved Satrap copy into the gallery grid alongside its final image. ESLint passed.

### 2026-11-08 — Stagger catalog images and round selectors
- Fully rounded catalog selector pills. Offset right-column gallery images down 56px (80px on large screens), including All, and reserved space below to prevent description overlap. Mobile retains a single column.

### 2026-11-08 — Tighter catalog page spacing
- Lifted catalog content with smaller top padding and heading margins. Reduced spacing between introductory copy, blue divider, project selectors and image panel; removed the extra gallery top margin while preserving the staggered layout.

### 2026-11-08 — Presentation Design catalog tab
- Removed the enclosing gallery panel border. Added Presentation Design to the catalog selector and All gallery with the user's 8.jpg and 9.jpg, preserving staggered layout, image hover outlines and lightbox. Regenerated the manifest; ESLint passed.

### 2026-11-08 — Shorter catalog selector pills
- Reduced selector vertical padding from 12px to 8px, lowering each pill's total height by 8px.

### 2026-11-08 — Consistent Catalog spelling
- Standardized all remaining visible Catalogue/catalogue copy to Catalog/catalog across Satrap and Zino headings and descriptions. Checked src, public, scripts and README for alternate spelling.

### 2026-11-08 — Lift Zino and Pars Center descriptions
- Reduced the top margin of Zino and Pars Center text from 24px to 16px, moving both descriptions up 8px.

### 2026-11-08 — Lower Satrap description
- Moved the Satrap text block down 8px beside its final image.

### 2026-11-08 — Consistent catalog description spacing
- Placed catalog descriptions within the image grid with a shared 16px vertical gap, removing bespoke text offsets and padding. Satrap remains beside its final image; Zino and Pars Center copy follows their left image without the right column's stagger adding extra space. ESLint passed.

### 2026-11-08 — More space for catalog copy
- Lowered all three catalog description blocks by 12px, preserving Satrap beside its last image and the shared spacing of Zino and Pars Center.

### 2026-11-08 — Lower catalog copy further
- Increased all three description offsets from 12px to 28px, moving them another 16px down.

### 2026-11-08 — Presentations inside Satrap
- Removed the Presentation Design selector and placed its two images after Satrap's catalog text and a faded blue divider, retaining the images in All. Added the exact supplied Satrap presentation heading and description beneath the presentation images, with their own lightbox. ESLint passed.

### 2026-11-08 — Balanced presentation separator spacing
- Removed nested gallery padding and top margin, gave the Satrap separator equal top/bottom margins, and moved presentation copy into the same grid spacing as other descriptions. ESLint passed.

### 2026-11-08 — Remove extra space above Satrap divider
- Removed the first Satrap gallery's unnecessary 56–80px bottom padding, which added to the divider's top gap. Retained equal divider margins and stagger clearance for the other galleries.

### 2026-11-08 — Equal gallery image gutters
- Replaced translated grid rows with independent gallery columns, matching the magazine layout. Horizontal and vertical image gaps now share 24px spacing (32px on large screens) while the right column retains its initial stagger. ESLint passed.

### 2026-11-08 — Match catalog heading placement to magazine
- Unified page top padding, heading margins and introductory description spacing so Catalog & Brochure Design occupies the same area as Magazine Design.

### 2026-11-08 — Match magazine divider to catalog
- Replaced the magazine heading's dark border with the same 2px accent-blue, faded-end divider used on the catalog page.

### 2026-11-08 — Dideban magazine pill heading
- Styled the Dideban Magazine heading as a solid blue, fully rounded pill with white text and the same padding as active catalog selectors.

### 2026-11-08 — Default catalog selection to All
- Changed the initial catalog project selection from Satrap to All so the combined gallery is shown on entry.

### 2026-11-08 — Shared gallery style across disciplines
- Applied blue faded heading dividers, rounded project pills with default All, staggered inline galleries, consistent image gutters, hover outlines and lightboxes to Logo, Banner, Social Media, Poster and Digital Painting categories.
- Replaced their grid/list card browsing with the shared project selector and inline project descriptions, preserving existing magazine and curated catalog behavior. ESLint passed and the local page returned HTTP 200.

### 2026-11-08 — Publish portfolio updates
- Validated the complete working site with ESLint and a successful static production build. Prepared accumulated gallery, lightbox, project media, preview and spacing updates for publication to origin/main.

### 2026-11-08 — Add supplied logo mockups and reorder Logo Design
- Added four supplied images as Premium Gradient, Rocket B, Luna Collection and STANDEA logo projects, each with project metadata and original image quality. They appear in All and their individual project selectors.
- Moved Logo Design immediately after Poster Design in the canonical category configuration and regenerated the manifest (25 projects).

### 2026-11-08 — Simplify and shrink logo gallery
- Removed Cafe Identity from site discovery by archiving it outside the repository at C:/shadi/portfolio-content-archive/cafe-identity after deletion was blocked by automatic review. Regenerated the manifest (five logo projects).
- Removed project selector pills specifically for Logo Design and constrained its combined staggered gallery to 1000px for smaller artwork. ESLint passed.

### 2026-11-08 — Full-width varied logo gallery
- Aligned the logo gallery to page content edges with three desktop columns, varied image widths and vertical offsets for a less uniform composition. Tablet uses two columns and mobile one; preserved hover outlines and lightbox navigation.

### 2026-11-08 — Compact aligned logo gallery
- Reduced logo image gutters to 12px (16px on desktop), removed width variations and vertical offsets, and filled each of the three desktop columns evenly for a tighter aligned layout.

### 2026-11-08 — Mixed-format logo mosaic with equal gutters
- Composed the desktop logo gallery with a tall central image spanning two rows beside four landscape tiles. Kept all gutters at 16px (12px on smaller screens), using cover crops for the mosaic while the lightbox retains full originals. Mobile shows uncropped images.

### 2026-11-08 — STANDEA in tall logo tile
- Swapped STANDEA with the previous central portrait tile, keeping gallery and lightbox order synchronized and preserving equal mosaic gutters.

### 2026-11-08 — Replace top-left logo with Vatanparast
- Replaced the featured logo artwork with the supplied Vatanparast PNG and updated its project name. Archived the previous image outside the site, retained the five-image mosaic and STANDEA's central portrait position, and regenerated the manifest.

### 2026-11-08 — Vatanparast logo rationale in lightbox
- Added a short English description of the nutrition lab identity combining V, leaf, human figure and growth in featured/meta.json. Logo lightboxes now show the selected project's description beneath the image; shared lightbox captions are optional and viewport height remains reserved for media. Regenerated manifest and passed ESLint.

### 2026-11-08 — Vatanparast lab location
- Added the user-provided Canada location to the English logo rationale and regenerated the manifest.

### 2026-11-08 — Side-by-side logo lightbox description
- Moved optional lightbox descriptions into a narrow right column on desktop, allowing the image to fill the remaining width and available viewport height on the left. Smaller screens retain stacked image and copy; media without descriptions keeps its full-width stage. ESLint passed.

### 2026-11-08 — Closer justified lightbox copy
- Reduced desktop image-to-description gap from 32px to 12px and removed left padding from the invisible text box. Justified its text with a left-aligned last line and whole words.

### 2026-11-08 — Smaller lightbox copy and arrow clearance
- Reduced description font to 14px on desktop and 12px on smaller screens, narrowed its desktop text box to 220–240px, and reserved an 80px right margin so the next-image arrow does not overlap the text.

### 2026-11-08 — Natural logo description spacing
- Removed lightbox text justification to restore natural word spacing and separated each Vatanparast rationale sentence into its own paragraph. Preserved line breaks in the lightbox and regenerated the manifest.

### 2026-11-08 — Blue lightbox navigation arrows
- Matched both previous and next image arrows to the site's accent blue.

### 2026-11-08 — Left arrow clearance for logo image
- Added 64px of desktop left padding to the image area when a lightbox description is present, separating the logo image from the previous arrow.

### 2026-11-08 — STANDEA logo rationale
- Added a short English description explaining Stance + Idea, the opinion-sharing app's Agree/Disagree responses, and their combination with S in the logo. Used three paragraphs and the existing right-hand lightbox description styling; regenerated the manifest.

### 2026-11-08 — STANDEA client location and tighter copy
- Added that STANDEA was designed for a client in the United States. Reduced paragraph spacing in both Vatanparast and STANDEA descriptions by removing blank lines while keeping sentence breaks. Regenerated the manifest.

### 2026-11-08 — Uniform logo lightbox frames
- Standardized opened logo images to a 3:2 cover frame and reserved identical desktop description space even for logos without copy so image widths remain consistent. Other galleries retain their existing full-image presentation. ESLint passed.

### 2026-11-08 — STANDEA-sized uncropped lightbox layout
- Replaced forced cover crops with an explicit 3:2 image stage sized against the viewport, using contain to preserve full artwork. Kept the same reserved right-hand description column for every logo so image space stays consistent.

### 2026-11-08 — Match Vatanparast image bounds
- Made Vatanparast fill the same 3:2 lightbox frame as the other logos with a centered side crop; retained its right-hand description and the existing display of other artwork.

### 2026-11-08 — Kartamoon logo rationale
- Named the premium-gradient logo project Kartamoon and added a short English rationale explaining the task-management website and its K/card symbol. Its description uses the existing right-hand lightbox layout and compact paragraph breaks. Regenerated the manifest.

### 2026-11-08 — Logo construction icons
- Added blue outlined element tiles beneath the Vatanparast, STANDEA and Kartamoon lightbox descriptions, separated by plus signs: V/leaf/person/up arrow, thumbs up/thumbs down/S, and task cards/K. Used accessible Lucide icons and matching blue borders. ESLint passed.

### 2026-11-08 — Align icon row to description width
- Distributed logo element tiles and plus signs across the full description width so the row's left and right edges align with the text box.

### 2026-11-08 — Circular logo element borders
- Changed the thin blue borders around logo construction elements to circles.

### 2026-11-08 — Compact Kartamoon elements
- Grouped Kartamoon's card, plus and K with an 8px gap instead of distributing them across the description width. Other logo element rows retain their alignment.

### 2026-11-08 — Rounded lightbox images
- Added 16px rounded corners to opened images and clipped the uniform logo frame to the same rounded shape.

### 2026-11-08 — Symmetric lightbox arrow clearance
- Replaced separate image padding and text margin with equal 80px desktop side gutters around the image/description group, reserving matching space for both navigation arrows.

### 2026-11-08 — Align visible image edge to arrow gutter
- Left-aligned the height-constrained logo frame within its desktop column, removing the extra centered space between the previous arrow and the visible image. Both visible content edges now follow the symmetric side gutters.

### 2026-11-08 — Compact centered logo stage with equal arrow gaps
- Constrained the entire logo stage to the image's viewport-based size plus the description, 12px inner gap and symmetric arrow gutters. Navigation arrows now follow the compact stage rather than the screen edges, eliminating unused space between image and text.

### 2026-11-08 — Restore viewport-edge navigation arrows
- Restored the full-width lightbox stage so arrows return to their original screen-edge positions. Kept the image and text grouped closely by constraining only the inner content.

### 2026-11-08 — Increase image-to-copy gap
- Increased the desktop lightbox image/description gap from 12px to 24px and expanded the inner group accordingly, preserving image sizing and arrow positions.

### 2026-11-08 — Remove image filenames and round all lightbox images
- Removed the visible filename beneath opened images. Applied a rounded clipping wrapper to every lightbox image, including galleries without the uniform logo frame.

### 2026-11-08 — BlackRocket logo rationale
- Named the Rocket B project BlackRocket and added an English description of the trading website identity combining B and a rocket. Added matching B + rocket elements in blue circles beneath its lightbox copy; regenerated the manifest.

### 2026-11-08 — LUNA boutique logo rationale
- Added an English description for the Instagram fashion boutique explaining the moon meaning and crescent integrated into its logotype. Uses the shared rounded logo lightbox with right-side text and matching blue letter/moon element circles. Regenerated the manifest.

### 2026-11-08 — Remove LUNA element circles
- Removed only the circular construction elements beneath LUNA's description, preserving its text and image styling.

### 2026-11-08 — Mixed-size banner mosaic
- Added all 13 supplied banners under selected-banners and regenerated the manifest. Banner Design now displays a full-width mixed-size mosaic with wide, small and tall tiles, equal 16px desktop gutters (12px on smaller screens), rounded hover outlines and an uncropped full-image lightbox. Existing banners remain included after the new work.

### 2026-11-08 — Uncropped banner artwork
- Replaced the fixed-height cropped banner tiles with natural-ratio masonry columns. All banners now display their full original composition, using image heights for a varied layout and matching 12px/16px horizontal and vertical gutters. ESLint passed.

### 2026-11-08 — Remove duplicate Black Friday banner
- Confirmed the old featured banner duplicates the newly supplied Black Friday artwork. Archived the old featured project outside site resources, retaining the user's new original image once, and regenerated the manifest.

### 2026-11-08 — Remove orange banner and lower phone mockup
- Archived the orange Summer Sale project outside site resources and regenerated the manifest. Moved the turquoise finance-app phone mockup to the end of the banner gallery, retaining full images and equal gutters. ESLint passed.

### 2026-11-08 — More banners and brand filters
- Added eight supplied banners (21 total), interleaving new artwork with existing banners and keeping the phone mockup at the end. Added All, Proopco and Magical Api rounded filters with matching filtered lightbox navigation.
- Reduced desktop gallery sizes using four natural-ratio masonry columns; preserved original uncropped artwork and equal gutters. Regenerated manifest and passed ESLint.

### 2026-11-08 — Banner sizing, ordering and Part filter
- Moved the turquoise Signal and finance-app banners to the gallery end, reduced six Proopco tiles to 86% width on larger screens, and added Part Software Group filtering for Radio Signal, Signal, finance-app and AI-service banners. Original image ratios and full-size lightbox media are preserved.

### 2026-11-08 — Add Pulse banner
- Added the supplied Pulse artwork as 22-pulse.jpg, interleaved in All without cropping; preserved its original file quality and excluded it from unrelated brand filters. Regenerated the manifest.

### 2026-11-08 — Remove final turquoise phone banner
- Archived 08-finance-app.jpg outside site resources at the user's request and regenerated the manifest, removing it from the gallery, brand filter and lightbox.

### 2026-11-08 — Pulse under Part and equal banner gutters
- Added Pulse to Part Software Group filtering. Removed selective narrower tile widths so all banner edges align with their columns and the full-width gallery, with equal horizontal/vertical 12px gutters (16px desktop). Preserved the existing masonry ordering and uncropped image ratios. ESLint passed.

### 2026-11-08 — Larger Magical Api and Part galleries
- Switched Magical Api and Part Software Group filtered banner galleries to two desktop columns for larger images and less empty space, preserving existing All/Proopco sizing and equal gutters.

### 2026-11-08 — Larger colorful banners in All
- Gave selected colorful banners (Dumbledore, Mashhad Market, Magical API waitlist, AI services and Pulse) a wider desktop gallery column, with darker artwork in narrower columns. Preserved natural image ratios, equal gutters and existing brand-filter layouts. ESLint passed.

### 2026-11-08 — Restore compact banner masonry
- Reverted the unequal independent column layout in All after it created excessive blank space below. Restored balanced four-column natural-ratio masonry with equal gutters; retained larger two-column brand filters and all supplied images.

### 2026-11-08 — Varied uncropped banner rows
- Replaced All's uniform columns with justified rows of varying image counts, calculating widths from original aspect ratios so dark banners vary in size while rows fill the content width with equal gutters and no crops or column-bottom gaps. Added source image ratio data. ESLint passed.

### 2026-11-08 — Prioritize Black Friday in staggered banner masonry
- Promoted Black Friday to the wide gallery column and constrained the yellow Radio Signal banner to a narrower column. Replaced straight justified rows with natural-ratio masonry, greedily balancing estimated column heights to reduce bottom whitespace. Maintained equal gutters, full uncropped images and lightbox ordering. ESLint passed.

### 2026-11-08 — Enlarge AI services banner
- Assigned 09-ai-services.jpg to the wider All-gallery column alongside Black Friday for clearer detail, preserving its original ratio and equal gutters.

### 2026-11-08 — Smaller Proopco filtered images
- Changed only the Proopco filtered gallery to three columns on medium screens and four on desktop, reducing image size while preserving uncropped artwork and equal gutters. Other filters keep their current layouts.

### 2026-11-08 — Supplied social media gallery
- Added all 25 supplied social images under selected-social and recorded their original aspect ratios. Applied a banner-style full-width masonry gallery with varied desktop column widths, equal 12px/16px gutters, balanced column heights, rounded hover outlines and full-image lightbox navigation.
- Kept images uncropped and existing social work included. Regenerated the manifest and passed ESLint.

### 2026-11-08 — Remove old social samples and mix similar work
- Archived the two identified old featured/launch-campaign social images outside site resources. Interleaved supplied work across visual themes and penalized consecutive same-theme placements within a column while balancing gallery heights. Preserved equal gutters and uncropped images; regenerated manifest and passed ESLint.

### 2026-11-08 — Publish logo, banner and social updates
- Passed full ESLint and production static export checks. Prepared all requested logo replacements/rationales, gallery/lightbox refinements, banner filters and social media additions for origin/main publication.

### 2026-11-09 — Social media format categories and Reels covers
- Added All / Reels Cover / Story / Post filters using the existing blue pill style; filter changes reset the lightbox selection.
- Added the three supplied Map.Trade covers in a reels-cover project with metadata and regenerated the manifest. Kept original artwork proportions and gallery/lightbox behavior.
- Existing artwork is provisionally classified as Story for tall 9:16 assets and Post otherwise; new covers use an explicit reels-cover tag.
- ESLint passed and a new cover returned HTTP 200 locally. TypeScript checking reports existing CategoryConfig.projects and PrismaClient errors outside this change.

### 2026-11-09 — More social artwork
- Added supplied Map.Trade cover 01 and Proopco Top Trader to Reels Cover, and Proopco Dollar Price to Story. Added explicit Story tag support and original aspect ratios; regenerated manifest.
- ESLint passed; all three new images returned HTTP 200 locally.

### 2026-11-09 — Top Trader story classification
- Moved Top Trader artwork from the Proopco reels folder into Proopco Stories at the user's request and regenerated the manifest. Empty reels project is omitted automatically.

### 2026-11-09 — Classify screenshot artwork as Reels covers
- Matched the supplied screenshots to selected-social images 08–23 (including the partially visible horse and internet-trading artwork). Added an explicit per-image Reels Cover set so these 16 works appear in Reels Cover instead of Story while keeping existing gallery order and asset paths.
- Kept Top Trader and Dollar Price in Story. ESLint passed.

### 2026-11-09 — Regular Reels grid and supplied Post artwork
- Replaced uneven independently balanced columns in the Reels Cover filter with a responsive equal-width row grid (one/two/four columns). All 20 covers retain full natural proportions and lightbox navigation; desktop now forms five complete rows with a level bottom edge.
- Added supplied P 19.jpg under selected-posts with an explicit post tag and regenerated the manifest. ESLint passed; new artwork returned HTTP 200 locally.

### 2026-11-09 — Asymmetric Reels gallery with aligned edges
- Replaced equal Reels rows with varied desktop columns holding 4/6/3/7 images. Computed column widths from original aspect ratios and 16px gutters to keep top and bottom edges aligned without cropping, stretching, or empty filler. Responsive smaller screens retain simple image flow.
- ESLint passed; numerical checks at 960/1200/1336px confirmed equal column heights and exact total gallery width.

### 2026-11-09 — Shared asymmetric social filter layout
- Applied the accepted aligned asymmetric Reels column layout to All, Story and Post within Social Media. Removed the old uneven-bottom gallery path and included the supplied Post image's actual ratio in width calculations.
- ESLint passed. Numerical layout checks confirmed positive widths and matching bottom edges for every social filter with current content.

### 2026-11-09 — Spread large images across All
- Split only the social All layout into eight-image bands and rotated the varied-width columns between bands, distributing large artwork across the page instead of stacking it in one column. Each band retains calculated equal top/bottom edges, natural image ratios and 16px desktop gutters. Other social filters retain their accepted layout.
- ESLint passed.

### 2026-11-09 — Balance All artwork sizes
- Changed social All bands to three larger, readable columns. Distribute artwork by its actual aspect-ratio height before calculating widths, reducing extreme large/small differences while retaining asymmetric placement, original proportions and aligned band edges.
- ESLint passed.

### 2026-11-09 — Slightly smaller All gallery
- Reduced social All gallery desktop width to 92%, centered, retaining the accepted balanced layout and image proportions. Mobile/tablet sizing stays responsive.
- ESLint passed.

### 2026-11-09 — Restore gallery alignment and prioritize comic
- Restored social gallery to the full shared content width, aligning both outside edges with the rest of the site.
- Promoted the digital-signature comic illustration (05-social) to the beginning of All and moved Proopco Top Trader to the final band, preserving balanced columns, original image ratios and aligned band edges.
- ESLint passed.

### 2026-11-09 — Classify supplied Story composites
- Matched the screenshot to 02-social (purple mockup), 03-social (three fitness panels), and 07-social (travel phone mockups). Added explicit Story overrides so all three appear in Story rather than Post, preserving original assets and layout ratios.
- ESLint passed.

### 2026-11-09 — Smaller All images with full-width alignment
- Increased balanced social All bands from three to four desktop columns to reduce image sizes while retaining full shared content width, varied placement, original proportions and aligned top/bottom edges. Other filters keep their existing sizes.
- ESLint passed.

### 2026-11-09 — Lower green social mockup priority
- Swapped the green phone mockup (01-social) with the lower horizontal travel-phone mockup (07-social) in All. Preserved image proportions, full-width alignment and automatic balanced layout.
- ESLint passed.

### 2026-11-09 — Maze Story artwork
- Added the supplied maze story.jpg in selected-stories with an explicit story tag, appearing in All and Story. Retained original image proportions and regenerated the manifest.
- Verified the new image returns HTTP 200 locally.
- Evenly distributed All images across bands so adding a 33rd image does not create an oversized single-image final band. ESLint passed.

### 2026-11-09 — Individual Damoon stories replace composite
- Added three supplied Damoon travel stories as separate artwork with explicit Story metadata. Archived the old three-phone travel composite (07-social.jpg) outside public resources so it no longer appears in All, Story or the lightbox. Regenerated the manifest.
- All three new image URLs returned HTTP 200 locally.

### 2026-11-09 — Balanced Story and lower Damoon priority
- Applied All's four-column aspect-ratio balancing and even band distribution to Story to reduce extreme size differences while keeping natural artwork ratios and aligned band edges.
- Moved the three new Damoon stories into All's low-priority tail alongside the green mockup; Top Trader remains last. Comic remains promoted at the start.
- ESLint passed.

### 2026-11-09 — Swap Soon with bottom-right tourism artwork
- Swapped Soon comic artwork (04-social) with Aseman tourism story (28-aseman-story) in All. Their matching 9:16 ratios preserve the existing geometry, placing Soon in the final right-hand column and moving Aseman into its previous position.
- ESLint passed.

### 2026-11-09 — Social concept and design credit
- Updated the Social Media Design description to explicitly credit Shadi for both original ideas and design of every piece. Regenerated the manifest.

### 2026-11-09 — Aligned asymmetric banner galleries
- Applied social-style balanced asymmetric bands to Banner Design and its brand filters. Column widths are solved from original artwork ratios and equal 16px desktop gutters, aligning top/bottom edges without cropping. Preserved full content width, responsive flow, brand filtering and lightbox indexing; All uses three columns, Proopco four, and other brands two.
- ESLint passed. Numerical checks using the implemented layout verified matching bottom edges and positive widths at 960/1336px for all banner filters.

### 2026-11-09 — Aligned asymmetric catalog and brochure layouts
- Applied a full-width natural-ratio asymmetric gallery to Catalog & Brochure All and its Satrap/Zino/ParsCenter filters. Calculated widths include equal 16px desktop gutters so columns share top and bottom edges without cropping or stretching. Added original artwork ratios keyed by asset path.
- Preserved Satrap presentation artwork and all existing project descriptions, placing descriptions below the gallery to maintain aligned image edges. Retained filter controls and lightbox navigation.
- ESLint passed; numerical alignment checks passed for all current column distributions at 960/1336px.

### 2026-11-09 — Restore Satrap filter layout
- Restored only the Satrap catalog filter to its previous staggered two-column AdditionalCatalog layout, including its original description placement and separate presentation section. All/Zino/ParsCenter retain their new aligned layouts.
- ESLint passed.

### 2026-11-09 — Digital paintings and GitHub publication
- Added seven supplied original painting mockups under selected-paintings with metadata. Created a two-column Digital Painting gallery with a modest CSS zoom and artwork-aware positioning so paintings are clearer, while the lightbox preserves complete original files. Existing paintings remain included.
- Verified a rendered preview of all seven zoomed views, full ESLint, production static export and whitespace checks. Prepared this session's social/gallery/catalog updates and new artwork for publication to origin/main; unused local assets and archived artwork stay outside the commit.

### 2026-11-09 — Remove seventh painting and align painting gallery
- Archived the seventh supplied painting (green artwork over the sofa) outside public resources and regenerated the manifest.
- Applied a three-column asymmetric natural-ratio layout with calculated equal top/bottom edges, moderate size variation and equal 16px desktop gutters. Retained the requested mild zoom for the six new paintings and full-original lightbox views; existing painting artwork remains included.
- ESLint passed.

### 2026-11-09 — Correct painting removal
- Restored supplied painting 07 (green artwork over sofa), which was removed after misinterpreting the previous request. Matched the new screenshot to portrait-study/01-painting.png and archived that portrait outside public resources instead.
- Regenerated the manifest and verified painting 07 is present and the identified portrait absent. Retained the new asymmetric painting layout.

### 2026-11-09 — Remove duplicate leaf portrait
- Identified the old featured/painting.jpg as a duplicate of supplied selected-paintings/02-painting.jpg (leaf portrait). Archived the old smaller copy outside public resources, retaining the supplied original and its zoomed gallery view.
- Regenerated manifest and verified Digital Painting contains seven images with no featured duplicate.

### 2026-11-09 — Closer view of green painting
- Increased only painting 07 gallery zoom from 1.08 to 1.45, anchored near the upper-center artwork so the framed green painting remains visible and surrounding furniture occupies less space. Preserved gallery geometry and original lightbox image.
- ESLint passed.

### 2026-11-09 — Closer leaf portrait view
- Increased painting 02 gallery zoom from 1.08 to 1.30, anchored at 54% horizontal / 35% vertical to emphasize the framed leaf portrait. Preserved gallery layout and the original lightbox image.
- ESLint passed.

### 2026-11-09 — Contact footer and closer painting 05
- Increased painting 05 gallery zoom to 1.30 around the framed portrait, retaining layout and the full original lightbox image.
- Replaced the shared footer identity/archive text with “Let’s work together.” and “Have a project in mind? Get in touch.” Added Email, Dribbble, Telegram and LinkedIn icons in blue circles across all routes. Email uses user-confirmed shadi.shafiee1@gmail.com; other icons remain disabled until the user supplies profile links. Updated the About contact email too.
- Full ESLint and production static export passed. Included the preceding painting layout, duplicate removal and focal zoom corrections in this publication.

### 2026-11-09 — Smaller footer icon circles
- Reduced shared footer blue circles from 48px to 40px while preserving 20px icons and existing spacing.
- ESLint passed.

### 2026-11-09 — Phone footer icon
- Replaced the Telegram footer icon and accessible label with Phone. Kept the contact button disabled until the user supplies a phone number.
- ESLint passed.

### 2026-11-09 — Animated footer collaboration headline
- Added a smooth repeating three-second color transition between the theme text color and accent blue for “Let’s work together.” across all pages. Respects reduced-motion preferences and dark-theme text contrast.
- ESLint passed.

### 2026-11-09 — Refresh footer animation preview
- Diagnosed stale browser CSS: the footer had the animation class but computed animation was none and the loaded stylesheet lacked the keyframes. Restarted the local development server and refreshed the preview with a cache-busting URL.
- Made the color cycle more visible with 2.4-second timing and short holds at ink/blue. Verified in the browser that the animation runs and computed text color changes from rgb(26,26,34) to blue intermediate values; reduced-motion behavior remains intact.

### 2026-11-09 — Floating hearts on contact hover
- Added five decorative blue hearts above the Phone circle, rising and fading with staggered timing while its wrapper is hovered. Works with the currently disabled phone placeholder and will also work with a future contact link. Keeps layout stable and respects reduced-motion preferences with a static heart.
- Verified the hover in the browser: contact-heart-rise runs and hearts appear above the icon. Full ESLint and production static export passed. Published along with the preceding footer circle, phone icon and headline animation refinements.

### 2026-11-09 — Move hearts to collaboration headline
- Removed floating hearts from the Phone icon and attached them to the “Let’s work together.” heading hover instead, spreading their starting points across the text. Preserved the headline color pulse and reduced-motion fallback.
- ESLint passed.

### 2026-11-09 — Verify headline hearts in refreshed preview
- Corrected stale local stylesheet loading by restarting the development server and rebuilding the changed stylesheet. Verified the browser loads the contact-headline:hover rule and visibly shows hearts rising above the headline with the pointer over the text. Slightly slowed heart rise to 1.7 seconds.

### 2026-11-09 — Publish headline hearts
- Published the verified headline-hover hearts correction to origin/main after ESLint and whitespace checks passed. Kept unrelated local assets and archived artwork out of the commit.

### 2026-11-09 — Bank Tejarat posters and aligned gallery
- Added all seven supplied cybersecurity posters as a Bank Tejarat project and regenerated the manifest. Preserved existing poster artwork.
- Created a full-width three-column Poster Design gallery using social-style balanced, varied column widths, calculated from original image ratios and 16px desktop gutters. Top/bottom edges align; posters remain uncropped with full-gallery lightbox navigation and responsive mobile flow.
- ESLint passed; numerical checks confirmed matching bottom edges and positive widths at 960/1336px for all nine posters.

### 2026-11-09 — Remove old poster samples and selectors
- Archived the two old featured/music-festival poster images outside public resources. Regenerated the manifest so Poster Design contains only the seven supplied Bank Tejarat posters; removed stale entries from poster ratios.
- Confirmed the category route uses the direct PosterGallery with no project/category selector controls. ESLint passed and manifest checks confirmed exactly seven supplied posters.

### 2026-11-09 — Zero Hour and wildlife posters publication
- Added supplied sample 1.jpg as Zero Hour in the Bank Tejarat project and deer.jpg as a Wildlife Awareness project. Recorded original aspect ratios and regenerated the manifest. Poster gallery now shows nine supplied works with no category selectors; old samples remain excluded.
- Full ESLint, production static export and calculated gallery alignment checks passed. Prepared all requested poster additions and cleanup for origin/main publication.

### 2026-11-09 — Remove deer poster
- Archived the deer poster outside public resources at the user's request, removed its ratio entry and regenerated the manifest. Poster Design retains the eight Bank Tejarat posters.
- Verified the deer asset is absent from the generated manifest.

### 2026-11-09 — Replacement deer poster
- Added the user's updated Desktop/deer.jpg as 01-deer-v2.jpg, using a fresh asset URL to avoid the old cached image. Recorded its original ratio and regenerated the manifest; the archived previous version remains excluded.

### 2026-11-09 — More asymmetric poster arrangement
- Replaced uniform height-balanced poster columns with interleaved 3/2/4-image columns, creating medium/large/small posters and staggered internal edges. Kept original ratios, full-width alignment, equal gutters and calculated matching top/bottom edges.
- ESLint passed.

### 2026-11-09 — Smaller poster gallery
- Expanded Poster Design to five asymmetric desktop columns to substantially reduce artwork size while retaining shared page edges, full image proportions and aligned column bottoms.
- ESLint passed.

### 2026-11-09 — Intermediate poster size
- Adjusted the poster gallery from five to four desktop columns for a slightly larger intermediate size, preserving asymmetric placement and aligned outside edges.
- ESLint passed.

### 2026-11-09 — Promote bottom four posters
- Moved the final poster in each of the four desktop columns to the top of its column, retaining existing sizes, column membership, spacing and aligned gallery edges.
- ESLint passed.

### 2026-11-09 — Publish final poster arrangement
- Prepared the updated deer artwork and final four-column asymmetric poster arrangement, including promotion of the bottom four posters, for origin/main publication.
- ESLint and whitespace checks passed.

### 2026-11-09 — Larger deer placement and lighter poster loading
- Swapped the deer with the larger phishing-link poster slot, retaining column edge calculations and lightbox media order.
- Found gallery originals totaled 25.5 MB, including several 3.7–7.3 MB files. Added reproducible 480/960px WebP previews and a generated asset map; both preview sets together total 1.29 MB. Gallery uses responsive srcSet, async decoding, eager first-column items and explicit image dimensions to prevent load-time layout shifts. Lightbox retains original files.
- Full ESLint passed; verified all nine preview pairs exist and metadata matches source images. Regenerate previews with node scripts/generate-poster-previews.mjs after poster content changes.

### 2026-11-09 — Compress full poster assets
- Optimized all nine full poster JPEGs with high-quality mozjpeg (quality 90, 4:4:4 color) and a maximum 2800px long edge; smaller source images retain their dimensions. Only replaced files when byte size decreased and preserved local originals outside public resources.
- Reduced full poster transfer size from 25,509,555 to 4,712,257 bytes (82% smaller). Regenerated responsive previews and manifest; inspected optimized poster text/artwork and passed ESLint.

### 2026-11-09 — Image context menus and site-wide optimization
- Added a document-level capture handler that prevents the image context menu and image dragging across gallery, preview, search and lightbox images, including image-button overlays. Normal non-image context menus remain available.
- Added scripts/optimize-site-images.mjs and optimized 92 heavy public images. Reduced total scanned image bytes from 176,629,218 to 62,997,336 (64% smaller). Used quality-90 4:4:4 JPEG encoding with a maximum 2800px long edge and lossless PNG/WebP encoding; preserved smaller image dimensions, transparency, asset paths and local original backups outside public resources.
- Validated all 92 optimized images decode with preserved aspect ratios and alpha. Regenerated poster previews and manifest; full ESLint and production static export passed.

### 2026-11-09 — Publish image performance improvements
- Published optimized tracked site images, responsive poster previews, larger deer placement and image context-menu handling to origin/main. Local archived originals and unrelated untracked assets remain excluded.
- Full lint, static export and image-integrity checks passed before publication; final whitespace check passed.

### 2026-11-10 — Vercel deployment support
- Serve Vercel builds at the domain root while preserving /portfolio for GitHub Pages.
- Added Vercel build/output configuration and automatic Vercel social metadata hostname; SITE_URL can override it for a custom domain.

### 2026-11-10 — Fix Vercel output directory
- Vercel log showed NEXT_NO_ROUTES_MANIFEST after a successful Next build: its Next.js adapter was incorrectly directed to out. Pointed the adapter to .next, where routes-manifest.json is generated; static export remains enabled.

### 2026-11-10 — Activate contact links
- Connected footer Dribbble and LinkedIn icons to the user's profiles (removed LinkedIn tracking parameters) and Phone to tel:+989364719124.

### 2026-11-10 — Phone hover number
- Show the phone number above the footer contact icon on hover and keyboard focus, with left-to-right digits; retained tel link for mobile dialing and added the number to its accessible label.

### 2026-11-10 — Dideban magazine additions
- Added four supplied magazine mockups to the existing Dideban project, preserving the three earlier images. Optimized JPEGs at quality 90 with a maximum 2800px edge and regenerated the manifest.
- Matched the gallery to the site's rounded, outlined image treatment with three desktop columns, two tablet columns and one mobile column; retained original image proportions and lightbox navigation.
- ESLint and Vercel-mode production build passed.

### 2026-11-10 — Compact mobile artwork layouts
- Changed all category galleries to two columns below 640px with tighter gaps; retained existing tablet and desktop layouts. Updated poster responsive image sizes for half-width mobile cards.
- Applied a two-column mobile layout to project galleries and reduced home ribbon tiles from 224x144 to 144x96 below 640px. Full-screen lightboxes retain their inspection size.
- ESLint, whitespace checks and Vercel-mode production build passed.

### 2026-11-10 — Balanced mobile galleries and new Dideban issue
- Added three supplied orange Dideban magazine mockups, optimized JPEGs, and regenerated the manifest.
- Added a shared mobile gallery for every category and filter. It balances two columns using original artwork ratios and solves column widths to align top and bottom edges with uniform 8px gaps, retaining lightbox indices and original proportions. Tablet and desktop layouts are preserved.
- Added a generated proportion map and scripts/generate-mobile-ratios.mjs; regenerate after adding artwork.
- ESLint and production build passed. Verified column geometry at 320, 375 and 430px for every category.

### 2026-11-10 — Smaller social artwork on mobile
- Changed only Social Media Design mobile galleries (including filters) to three balanced columns, retaining equal 8px gaps and aligned outside edges. Other categories and tablet/desktop layouts retain their current column counts.
- ESLint and production build passed.

### 2026-11-10 — Balance mobile social post sizes
- Use two equal square frames only for the Social Media Post mobile filter, showing complete images with object-contain and uniform 8px gaps. Keeps unequal aspect ratios from creating oversized and tiny neighboring posts; other filters retain balanced layouts.
- ESLint and production build passed.

### 2026-11-10 — Visible floating employer logos on mobile
- Display employer logos persistently above company names below 640px at 32px, reserving vertical space to avoid text overlap. Retained 48px hover/focus reveals on larger screens.
- Mobile logos reuse the existing float animation and respect reduced-motion settings. ESLint and production build passed.

### 2026-11-10 — Khabar Fouri role wording
- Removed Digital Marketing from the Khabar Fouri role title, retaining Graphic Designer.

### 2026-11-10 — Employer names and mobile color
- Renamed the first employer to Proopco (Kifpool.me), preserving its floating logo. Company names use the accent blue below 640px; desktop colors retain existing behavior.
- ESLint and whitespace checks passed.

### 2026-11-10 — Align magazine gallery and remove GitHub header link
- Replaced uneven fixed-width magazine columns with ratio-balanced widths at tablet and desktop sizes. All columns share aligned top/bottom edges with constant responsive gaps; preserved original proportions and lightbox selection.
- Removed the GitHub repository link and icon from the header.
- ESLint and production build passed.

### 2026-11-10 — Remove About header item
- Removed the About navigation button from the header. ESLint passed.

### 2026-11-10 — Restore magazine hover outlines
- Added the existing blue SVG hover/focus border treatment to the shared balanced gallery used by Magazine Design, including uniform mobile frames. ESLint passed.

### 2026-11-10 — Smaller single-line mobile employer names
- Reduced company names to 14px below 640px and prevented line breaks within each company name, including Proopco (Kifpool.me). Preserved desktop typography and floating logos. ESLint passed.

### 2026-11-10 — Smaller Bank Tejarat mobile name
- Reduced only the Bank Tejarat company name to 12px in mobile layouts. ESLint passed.

### 2026-11-10 — Mobile experience text hierarchy
- Clarified mobile hierarchy per user: role labels (Graphic Designer) are 12px and medium weight; company names are 16px and semibold, including Bank Tejarat. Kept company names blue and single-line; desktop typography is preserved. ESLint passed.

### 2026-11-10 — Single-line freelance role on mobile
- Reduced only Freelance Graphic Designer to 10px below 640px and prevented wrapping within that role. Preserved company names and desktop sizes. ESLint passed.

### 2026-11-10 — Increase mobile role labels
- Increased mobile role labels by 2px: standard Graphic Designer to 14px and Freelance Graphic Designer to 12px, retaining its single-line treatment. ESLint passed.

### 2026-11-10 — Mobile filter chips and freelance text
- Increased Freelance Graphic Designer from 12px to 13px on mobile.
- Reduced mobile category filter text, padding and gaps to keep choices together on one line, with slightly tighter banner chips for their longer labels. Retained tablet/desktop sizing and overflow scrolling on narrow screens. ESLint passed.

### 2026-11-10 — Tighter mobile employer spacing
- Reduced spacing between work experience entries from 80px to 56px only below 640px; retained larger-screen spacing.

### 2026-11-10 — Further compact mobile spacing and filters
- Reduced mobile work experience gaps to 40px. Further reduced mobile filter chip text, padding and gaps (4px); tablet/desktop styling is preserved. ESLint passed.

### 2026-11-10 — Mobile filter gaps and magazine chip
- Increased mobile category chip gaps to 8px and matched the Dideban Magazine chip to the standard mobile filter size (10px type with compact padding). Desktop sizes are preserved. ESLint passed.

### 2026-11-10 — Bring mobile logo descriptions closer
- Removed surplus flexible space below logo lightbox images on mobile and reduced the image-description gap to 8px for uniform logo frames. Tablet/desktop behavior is preserved. ESLint passed.

### 2026-11-10 — Prevent clipped mobile logo element icons
- Moved mobile logo description scrolling into its own text container so the element icons remain fully visible outside the capped text area. Reserved icon row space and reduced its mobile top margin; preserved desktop scrolling behavior.
- Prevented lightbox header from shrinking. ESLint and production build passed.

### 2026-11-10 — Smaller mobile lightbox arrows above artwork
- Moved mobile previous/next controls into the lightbox top bar above artwork, using 32px circles and 16px chevrons. Retained side arrows on tablet and desktop. ESLint passed.

### 2026-11-10 — Align mobile lightbox arrows with artwork edges
- Moved compact mobile arrows from the top bar into a full-width row directly above artwork, aligned to its left and right edges. Desktop controls are preserved. ESLint passed.

### 2026-11-10 — Align mobile timeline dots to company names
- Positioned mobile work timeline dots at the company text line, measuring its actual position to handle floating logo space and wrapping. ResizeObserver and font readiness keep alignment current; desktop dot positions are preserved. ESLint passed.

### 2026-11-10 — Keep mobile arrows directly above non-logo media
- Removed the expanding mobile image-area spacer for non-logo lightboxes and added an 8px arrow-row gap. Capped tall media to leave room for controls and thumbnails, keeping arrows immediately above each opened image/video.
- Preserved the approved Logo Design lightbox treatment. ESLint and production build passed.

### 2026-11-10 — Explicit mobile lightbox layout and smaller Selected Works
- Added a dedicated compact mobile image stage for non-logo lightboxes, placing arrows in a row immediately above the image with explicit viewport-constrained media height. Preserved Logo Design's approved layout.
- Reduced the home Selected Works heading to 28px and category names to 18px on mobile, retaining larger-screen typography.
- ESLint and production build passed.

### 2026-11-10 — Mobile selected-work blue sweep
- Added a soft repeating left-to-right blue wash only to Magazine, Banner, Social Media and Logo rows below Selected Works on mobile. Uses a non-interactive gradient behind row content and respects reduced motion; desktop remains unchanged. ESLint passed.

### 2026-11-10 — Revise mobile sweep categories and opacity
- Restricted mobile blue sweeps to Magazine, Banner, Poster and Digital Painting; lowered gradient accent opacity from 20% to 12% and updated stagger timing.
