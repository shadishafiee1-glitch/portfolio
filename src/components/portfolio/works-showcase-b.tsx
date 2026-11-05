"use client";

import { PORTFOLIO } from "@/data/portfolio";
import { assetUrl } from "@/lib/assets";

const covers = PORTFOLIO.flatMap((category) =>
  category.projects.filter((project) => project.cover).map((project) => ({
    key: `${category.slug}/${project.slug}`,
    src: project.cover,
    name: project.name,
  })),
);

/** Decorative, seamless image ribbons; no project navigation. */
export function WorksShowcaseB() {
  const rows = [0, 1, 2].map((row) => covers.filter((_, i) => i % 3 === row));

  return (
    <section aria-label="Selected work" className="border-t border-foreground/15 py-10 sm:py-14">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="space-y-3 overflow-hidden sm:space-y-4">
          {rows.map((items, row) => (
            <div key={row} className="marquee-pause overflow-hidden">
              <div
                className={`flex w-max ${row === 1 ? "animate-marquee-rev" : "animate-marquee"}`}
                style={{ animationDuration: `${46 + row * 9}s` }}
              >
                {[0, 1].map((copy) => (
                  <div key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4">
                    {items.map((item) => (
                      <div key={item.key} className="h-36 w-56 shrink-0 overflow-hidden rounded-xl bg-foreground/5 sm:h-44 sm:w-72">
                        <img
                          src={assetUrl(item.src)}
                          alt={copy === 0 ? item.name : ""}
                          draggable={false}
                          className="h-full w-full select-none object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
