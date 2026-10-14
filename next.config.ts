import type { NextConfig } from "next";

/**
 * Static-export configuration tuned for GitHub Pages.
 *
 * - `output: "export"` -> emits a fully static site to `out/` (no Node server).
 * - `basePath` -> "/portfolio" in production (matches the GitHub Pages URL
 *   `https://<user>.github.io/portfolio/`). Empty in `next dev` so the local
 *   preview at http://localhost:3000/ works without a prefix.
 * - `images.unoptimized` -> GitHub Pages cannot run the Next image optimizer.
 * - `trailingSlash: true` -> every route resolves to `<dir>/index.html`,
 *   which is what GitHub Pages expects for project-page sub-paths.
 *
 * The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs
 * `next build` (NODE_ENV=production) so the basePath is applied automatically.
 */
const isProd = process.env.NODE_ENV === "production";
const basePath = isProd ? "/portfolio" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Expose basePath to the client so plain <img> / fetch calls can prefix
  // asset paths correctly for GitHub Pages (project pages live under
  // /portfolio/). next/image & next/link handle basePath automatically; this
  // is for the raw asset URLs used by the gallery + cursor preview.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  // Allow the sandbox preview origin to load /_next/* dev assets.
  allowedDevOrigins: ["*.space-z.ai", "localhost"],
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
