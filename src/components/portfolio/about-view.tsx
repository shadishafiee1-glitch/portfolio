"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Briefcase, GraduationCap, Sparkles, User } from "lucide-react";
import type { NavigateFn } from "@/hooks/use-hash-route";

const ease = [0.22, 1, 0.36, 1] as const;

interface AboutViewProps {
  navigate: NavigateFn;
}

const EDUCATION = [
  {
    period: "2015–2017",
    title: "Advanced diploma",
    place: "Alzahra University of Mashhad-Iran",
  },
  {
    period: "2017–2019",
    title: "Bachelor",
    place: "Ferdows Institute of higher Education, Mashhad-Iran",
  },
];

const EXPERIENCE = [
  {
    role: "Graphic Designer",
    org: "Proopco, part of Kifpool.me",
    period: "August 2026 – Present",
    bullets: [
      "Manage end-to-end social media design, from creative ideation and concept development to final visual execution.",
      "Integrate AI-powered tools and image generation into the creative workflow to produce engaging social media content.",
      "Develop brand-aligned visual concepts and creatives tailored to marketing goals and social media platforms.",
    ],
  },
  {
    role: "Freelance Graphic Designer",
    org: "Bank Tejarat",
    place: "Tehran, Iran · Freelance",
    bullets: [
      "Design cybersecurity awareness posters and educational visual materials for bank employees using AI-powered tools throughout the creative process.",
      "Develop visual concepts and generate AI-assisted imagery to communicate cybersecurity risks and security best practices.",
      "Translate complex security topics into clear, engaging, and accessible visual communications.",
    ],
  },
  {
    role: "Graphic Designer, Digital Marketing",
    org: "Khabar Fouri",
    period: "2026 · 3 months",
    bullets: [
      "Designed AI-assisted social media content and promotional visuals for multiple brands and pages.",
      "Used AI-powered tools for visual ideation and image generation, adapting creative concepts to different brand identities and campaigns.",
    ],
  },
  {
    role: "Graphic Designer",
    org: "Part Software Group",
    period: "2020–2026",
    bullets: [
      "Led the design of Dideban magazine, covering technology and industry-related topics.",
      "Created promotional materials, banners, and social media visuals for products including Vira, Signal, and Icup.",
      "Developed brand-aligned assets for marketing campaigns, product launches, and digital and print communications.",
    ],
  },
  {
    role: "Graphic Designer",
    org: "Algorithm Sharq",
    period: "2019–2020",
    bullets: [
      "Designed social media campaigns, banners, and branded visuals for clients across multiple industries.",
      "Adapted creative concepts to different brand identities while delivering high-quality assets under tight deadlines.",
    ],
  },
];

const SKILLS = [
  {
    label: "Design Tools",
    items: "Adobe Photoshop, Illustrator, InDesign, Premiere Pro, Audition",
  },
  {
    label: "AI-Powered Design",
    items: "AI-assisted social media design, Instagram post & cover design, AI image generation",
  },
  { label: "Core Skills", items: "Branding, layout design, advertising creatives, social media visuals" },
  {
    label: "Creative Skills",
    items: "Visual storytelling, composition, color theory, typography, digital illustration",
  },
  { label: "Soft Skills", items: "Collaboration, problem-solving, adaptability" },
  { label: "Languages", items: "Persian (Native), English (Advanced)" },
];

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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50"
        >
          <User className="h-3.5 w-3.5" /> About me
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.05 }}
          className="display-heavy text-balance text-[clamp(2.4rem,7vw,4.5rem)]"
        >
          Shadi <span className="italic font-normal text-[var(--accent)]">Shafiee</span>
        </motion.h1>
      </header>

      {/* ── ABOUT ME ──────────────────────────────────────────────────── */}
      <Section icon={<User className="h-4 w-4" />} title="About me">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="text-pretty text-base leading-relaxed text-foreground/80 sm:text-lg"
        >
          Graphic Designer with 7+ years of experience combining visual design,
          creative problem-solving, and digital communication to create impactful
          brand experiences. Experienced in social media design, advertising
          creatives, and print materials, with a focus on integrating AI-powered
          tools and image generation into modern design workflows. Passionate
          about visual storytelling, design innovation, and creating purposeful,
          engaging visuals.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="mt-4 text-sm text-muted-foreground"
        >
          Based in Mashhad, Iran · Open to relocation to Tehran.
        </motion.p>
      </Section>

      {/* ── EDUCATION ─────────────────────────────────────────────────── */}
      <Section icon={<GraduationCap className="h-4 w-4" />} title="Education">
        <div className="grid gap-4 sm:grid-cols-2">
          {EDUCATION.map((e, i) => (
            <motion.div
              key={e.place}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: 0.06 * i }}
              className="rounded-2xl border border-foreground/15 bg-card/70 p-5 backdrop-blur-sm"
            >
              <p className="font-mono text-xs text-[var(--accent)]">{e.period}</p>
              <p className="mt-2 text-base font-semibold text-foreground">{e.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{e.place}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── WORK EXPERIENCE ───────────────────────────────────────────── */}
      <Section icon={<Briefcase className="h-4 w-4" />} title="Work experience">
        <div className="space-y-8">
          {EXPERIENCE.map((job, i) => (
            <motion.article
              key={`${job.org}-${i}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease, delay: 0.05 * Math.min(i, 5) }}
              className="relative border-l border-foreground/20 pl-6"
            >
              {/* period / place dot */}
              <span
                className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-[var(--accent)]"
                aria-hidden
              />
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  {job.role}
                  <span className="text-muted-foreground"> · {job.org}</span>
                </h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {job.period ?? job.place}
                </span>
              </div>
              <ul className="mt-3 space-y-2">
                {job.bullets.map((b, bi) => (
                  <li
                    key={bi}
                    className="flex gap-2.5 text-sm leading-relaxed text-foreground/75"
                  >
                    <span
                      className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]"
                      aria-hidden
                    />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </Section>

      {/* ── SKILLS ────────────────────────────────────────────────────── */}
      <Section icon={<Sparkles className="h-4 w-4" />} title="Skills">
        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {SKILLS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease, delay: 0.05 * i }}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                {s.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
                {s.items}
              </p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── CONTACT CTA ───────────────────────────────────────────────── */}
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

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-16 border-b border-foreground/15 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease }}
        className="mb-6 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/50"
      >
        {icon}
        {title}
      </motion.div>
      {children}
    </section>
  );
}
