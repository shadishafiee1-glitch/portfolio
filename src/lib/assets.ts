/**
 * Asset URL helper.
 *
 * Media paths in the manifest are stored relative to the public/ root
 * (e.g. `resources/magazine/featured/magazine.jpg`). On GitHub Pages the site
 * is served under `/portfolio/`, so every raw asset URL must be prefixed with
 * the basePath. `next/image` and `next/link` handle this automatically, but
 * plain `<img>`/`<video>`/`fetch` calls use this helper.
 */
export function assetUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${clean}`;
}
