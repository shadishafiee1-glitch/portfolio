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

export function SiteFooter({ totalCategories: _tc, totalProjects: _tp }: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t-2 border-foreground bg-background">
      {/* Big wordmark strip */}
      <div className="border-b-2 border-foreground/20 bg-foreground py-6 text-background">
        <p className="display-heavy mx-auto max-w-[1400px] px-5 text-center text-[clamp(2rem,8vw,5rem)] sm:px-8">
          Let&apos;s make something
        </p>
      </div>

      <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <p className="display-heavy text-3xl">SHADI</p>
            <p className="display-heavy -mt-1 text-3xl text-[var(--flame)]">SHAFIEE</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A working archive of editorial, identity, print and digital
              painting projects.
            </p>
          </div>

          {/* Social / contact */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-2.5">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-[var(--flame)]"
                  >
                    <span className="h-1.5 w-1.5 bg-[var(--flame)] transition-transform group-hover:scale-150" />
                    {s.label}
                    <span className="opacity-0 transition-opacity group-hover:opacity-100">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Back to top */}
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Colophon
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-2 border-2 border-foreground px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background"
            >
              <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
              Top
            </button>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} · Next.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
