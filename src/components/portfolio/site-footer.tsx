"use client";

import { ArrowUp, Mail } from "lucide-react";

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

export function SiteFooter({ totalCategories, totalProjects }: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background/60">
      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <p className="display-text text-2xl text-foreground">
              Shadi <span className="italic">Shafiee</span>
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A working archive of editorial, identity, print and digital
              painting projects — curated, not exhaustive.
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
              {totalCategories} disciplines · {totalProjects} projects
            </p>
          </div>

          {/* Social / contact */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-2.5">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-foreground/85 transition-colors hover:text-foreground"
                  >
                    <Mail className="h-3.5 w-3.5 opacity-50 transition-opacity group-hover:opacity-100" />
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
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Colophon
            </p>
            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
              className="group inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm transition-colors hover:bg-accent"
            >
              <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
              Back to top
            </button>
            <p className="text-xs text-muted-foreground/70">
              © {new Date().getFullYear()} Shadi Shafiee · Built with Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
