"use client";

import { Check, Link2, Share2 } from "lucide-react";
import { useClipboard } from "@/hooks/use-clipboard";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  /** The project display name, used in the share text + aria-label. */
  projectName: string;
  className?: string;
}

/**
 * A "Share" button for a project page.
 *
 * Builds a deep link from the current location (so it works on both the dev
 * server and the GitHub Pages production URL without hardcoding a domain),
 * writes a short share text + URL to the clipboard, and shows a transient
 * "Copied" confirmation. If the Web Share API is available (mobile), it opens
 * the native share sheet instead.
 */
export function ShareButton({ projectName, className }: ShareButtonProps) {
  const { copied, copy } = useClipboard();

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `${projectName} — Shadi Shafiee`;
    // Native share sheet on capable devices (mobile / some desktops)
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: projectName, text, url });
        return;
      } catch {
        // user dismissed — fall through to clipboard
      }
    }
    copy(`${text}\n${url}`);
  };

  return (
    <button
      type="button"
      onClick={share}
      aria-label={copied ? "Link copied" : `Share ${projectName}`}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm font-medium transition-all duration-200 hover:bg-accent",
        copied && "border-emerald-600/40 text-emerald-700 dark:text-emerald-400",
        className,
      )}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 transition-transform group-hover:-rotate-12" />
          Share
          <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
        </>
      )}
    </button>
  );
}
