"use client";

import type { CSSProperties } from "react";
import { MOBILE_IMAGE_RATIOS } from "@/data/mobile-image-ratios.generated";
import { assetUrl } from "@/lib/assets";
import type { Project } from "@/lib/types";

/** Balanced columns with equal outside edges and a constant 8px gap. */
export function MobileGallery({ media, onOpen, columnCount = 2 }: { media: Project["media"]; onOpen: (index: number) => void; columnCount?: 2 | 3 }) {
  const columns: number[][] = Array.from({ length: columnCount }, () => []);
  const loads = columns.map(() => 0);
  media.forEach((item, i) => {
    const c = loads.indexOf(Math.min(...loads));
    columns[c].push(i);
    loads[c] += 1 / (MOBILE_IMAGE_RATIOS[item.path] ?? 1);
  });
  const active = columns.filter(column => column.length);
  const sums = active.map(column => column.reduce((sum, i) => sum + 1 / (MOBILE_IMAGE_RATIOS[media[i].path] ?? 1), 0));
  const inverseSum = sums.reduce((sum, value) => sum + 1 / value, 0);
  const offsets = sums.map((sum, c) => (active[c].length - 1) / sum);
  const correction = 8 * (offsets.reduce((sum, value) => sum + value, 0) - (active.length - 1));
  const tracks = sums.map((sum, c) => {
    const share = 1 / sum / inverseSum;
    return `calc(${share * 100}% + ${correction * share - 8 * offsets[c]}px)`;
  }).join(" ");
  if (!media.length) return null;
  return <div className="grid items-start gap-2 sm:hidden" style={{ gridTemplateColumns: active.length === 1 ? "minmax(0, 1fr) minmax(0, 1fr)" : tracks } as CSSProperties}>
    {active.map((column, c) => <div key={c} className="flex min-w-0 flex-col gap-2">
      {column.map(i => <button key={media[i].path} type="button" onClick={() => onOpen(i)} aria-label={`Open ${media[i].name}`} className="catalog-image-glow block w-full cursor-zoom-in overflow-hidden rounded-xl">
        <img src={assetUrl(media[i].path)} alt={media[i].name} width={1000} height={1000 / (MOBILE_IMAGE_RATIOS[media[i].path] ?? 1)} className="block h-auto w-full" loading="lazy" decoding="async" />
      </button>)}
    </div>)}
  </div>;
}
