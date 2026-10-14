"use client";

import { useState } from "react";
import { assetUrl } from "@/lib/assets";
import { cn } from "@/lib/utils";

interface SmartImageProps {
  /** Path relative to public/ root (e.g. "resources/magazine/featured/01.jpg"). */
  src: string;
  alt: string;
  className?: string;
  /** Class applied to the inner <img>. */
  imgClassName?: string;
  /** Render above-the-fold images eagerly. */
  priority?: boolean;
  /** Accent color for the shimmer placeholder glow (defaults to neutral). */
  accent?: string;
  /** Optional caption rendered bottom-left over the image (used in lightbox). */
  caption?: string;
}

/**
 * SmartImage — a blur-up + fade-in image with an animated shimmer placeholder.
 *
 * The portfolio's source images are large (≈1–2MB, 1758×1080) so they don't
 * paint instantly. SmartImage shows a tinted, animated placeholder until the
 * image decodes, then cross-fades it in — eliminating the blank-flash on slow
 * connections and giving the gallery a deliberate, editorial load rhythm.
 *
 * Uses a plain <img> (not next/image) because the site is a static export with
 * `images.unoptimized`, and we need fine control over the cross-fade. basePath
 * is applied via assetUrl().
 */
export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
  accent,
  caption,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {/* Shimmer placeholder — fades out once the image is ready */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity duration-700",
          loaded ? "opacity-0" : "opacity-100",
        )}
        style={{
          background: accent
            ? `linear-gradient(110deg, ${accent}14, ${accent}22 40%, ${accent}10 60%, ${accent}1a)`
            : undefined,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.6s linear infinite",
          }}
        />
      </div>

      <img
        src={assetUrl(src)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "h-full w-full object-cover transition-[opacity,filter] duration-700 ease-out",
          loaded ? "opacity-100 blur-0" : "opacity-0 blur-md",
          imgClassName,
        )}
        draggable={false}
      />

      {caption && (
        <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/80 drop-shadow">
          {caption}
        </span>
      )}
    </div>
  );
}
