"use client";

import { ArrowUp, Dribbble, Heart, Linkedin, Mail, Phone } from "lucide-react";

interface SiteFooterProps {
  totalCategories: number;
  totalProjects: number;
}

const SOCIAL = [
  { label: "Email", href: "mailto:shadi.shafiee1@gmail.com", icon: Mail },
  { label: "Dribbble", href: null, icon: Dribbble },
  { label: "Phone", href: null, icon: Phone },
  { label: "LinkedIn", href: null, icon: Linkedin },
];

export function SiteFooter(_props: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-foreground/15 bg-background/50">
      <div className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 sm:py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="contact-headline footer-contact-pulse display-text relative inline-block text-balance text-3xl text-foreground sm:text-4xl">
              Let’s work together.
              <span aria-hidden="true" className="pointer-events-none absolute inset-0">
                {[0, 1, 2, 3, 4].map((heart) => <Heart key={heart} className="contact-heart absolute top-0 h-3 w-3 fill-current text-[var(--accent)]" strokeWidth={1.5} />)}
              </span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/60 sm:text-base">
              Have a project in mind? Get in touch.
            </p>
            <ul aria-label="Contact and social profiles" className="mt-6 flex flex-wrap gap-3">
              {SOCIAL.map(({ label, href, icon: Icon }) => {
                const classes = "inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-white transition-colors hover:bg-[var(--accent-deep)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]";
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} aria-label={label} title={label} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className={classes}>
                        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
                      </a>
                    ) : (
                      <button type="button" disabled aria-label={`${label} — link coming soon`} title={`${label} — link coming soon`} className={classes}>
                        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-4 sm:items-end">
            <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="group inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs font-medium transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]">
              <ArrowUp aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
              Back to top
            </button>
            <p className="text-xs text-foreground/40">© {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
