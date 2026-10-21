"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { AboutSections } from "./about-sections";
import type { NavigateFn } from "@/hooks/use-hash-route";

const ease = [0.22, 1, 0.36, 1] as const;

interface AboutViewProps {
  navigate: NavigateFn;
}

/**
 * Long-form About deep-link view (`#/about`). Renders the same About
 * sections that live inline on the home page (shared `AboutSections`),
 * plus a breadcrumb back to the index and the hero header.
 */
export function AboutView({ navigate }: AboutViewProps) {
  return (
    <div className="mx-auto max-w-[1000px] px-5 pb-24 pt-10 sm:px-8 sm:pt-16">
      {/* Breadcrumb */}
      <motion.button
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease }}
        onClick={() => navigate({ kind: "home" })}
        className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Index
        <span className="text-border">/</span>
        <span className="font-medium text-foreground">About</span>
      </motion.button>

      {/* Header */}
      <header className="mt-10 border-b border-foreground/15 pb-10">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.05 }}
          className="display-heavy text-balance text-[clamp(2.4rem,7vw,4.5rem)]"
        >
          About <span className="italic font-normal text-[var(--accent)]">me</span>
        </motion.h1>
      </header>

      {/* Shared sections */}
      <AboutSections />

      {/* Contact CTA */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
        className="mt-16 flex flex-col items-start gap-5 rounded-2xl border border-foreground/15 bg-card/70 p-7 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between sm:p-9"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50">
            Start a project
          </p>
          <p className="display-text mt-2 text-2xl italic">Have a brief in mind?</p>
        </div>
        <a
          href="mailto:hello@shadishafiee.com?subject=Project%20enquiry"
          className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[var(--accent)]"
        >
          hello@shadishafiee.com
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </motion.section>
    </div>
  );
}
