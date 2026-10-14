# Shadi Shafiee — Portfolio

A minimalist, single-page portfolio for visual designer **Shadi Shafiee**,
built with Next.js 16, statically exported to GitHub Pages. The interaction
model is inspired by [robin-noguier.com](https://robin-noguier.com/) — hover a
discipline to preview it, click to enter its archive.

🔗 **Live:** `https://shadishafiee1-glitch.github.io/portfolio/`

---

## Disciplines

Magazine · Design · Catalog & Brochure · Logo Design · Banner Design ·
Social Media Design · Poster Design · Digital Painting

## Add your work (no code required)

The site is a static archive of `public/resources/`:

```
public/resources/<discipline>/<project>/<media>
```

1. Create a folder named after your project inside the discipline folder.
2. Drop images / videos into it (`jpg png webp svg mp4 webm mov`).
3. *(optional)* add a `meta.json` for a richer card:
   ```json
   { "name": "My Project", "description": "…", "year": "2025",
     "client": "…", "tags": ["print","identity"] }
   ```
4. Commit & push. GitHub Actions rebuilds and redeploys automatically.

To add a brand-new discipline, also append an entry in
[`src/data/categories.ts`](src/data/categories.ts).

> Full docs for agents & contributors live in [`AGENTS.md`](AGENTS.md).

## Develop

```bash
bun install
bun run dev      # http://localhost:3000  (predev regenerates the manifest)
```

## Build (static export)

```bash
bun run build:static   # outputs ./out/  (basePath /portfolio applied in prod)
```

## Deploy

Pushing to `main` or `dev` triggers `.github/workflows/deploy.yml`, which builds
and publishes to GitHub Pages. One-time repo setup: **Settings → Pages →
Source = GitHub Actions**.

## Tech

Next.js 16 · TypeScript 5 · Tailwind CSS 4 · shadcn/ui · framer-motion ·
Instrument Serif + Geist.
