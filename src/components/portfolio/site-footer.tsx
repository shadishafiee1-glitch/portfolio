"use client";

import { ArrowUp } from "lucide-react";

interface SiteFooterProps {
  totalCategories: number;
  totalProjects: number;
}

const SOCIAL = [
  { label: "Email", href: "mailto:hello@shadishafiee.com" },
  {
    label: "GitHub",
    href: "https://github.com/shadishafiee1-glitch/portfolio",
  },
  { label: "Instagram", href: "#" },
  { label: "Behance", href: "#" },
];

export function SiteFooter({
  totalCategories: _tc,
  totalProjects: _tp,
}: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-foreground/15 bg-background/50">
      <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <p className="display-text text-2xl italic text-foreground">
              Shadi Shafiee
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-foreground/55">
              A working archive of editorial, identity, print and digital
              painting projects.
            </p>
          </div>

          {/* Social / contact */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/45">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-2.5">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-foreground/75 transition-colors hover:text-[var(--accent)]"
                  >
                    <span className="h-1 w-1 rounded-full bg-foreground/30 transition-colors group-hover:bg-[var(--accent)]" />
                    {s.label}
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Back to top */}
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/45">
              Colophon
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
              Back to top
            </button>
            <p className="text-xs text-foreground/40">
              © {new Date().getFullYear()} · Built with Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
