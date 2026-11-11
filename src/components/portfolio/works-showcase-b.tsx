"use client";

import { assetUrl } from "@/lib/assets";

const artworkNames: Record<number, string> = {
  1: "Floral portrait painting",
  4: "White-haired portrait painting",
  5: "Fitness app presentation",
  6: "Dumbledore creative banner",
  8: "Vitamin social media designs",
  10: "Credit scoring brochure",
  11: "Posture brochure",
  12: "Hidden Waves of AI magazine spreads",
  13: "AI product banners",
  15: "Tehran campaign design",
  16: "Chocolate packaging design",
  17: "Hidden Waves of AI magazine cover",
};

// Alternate warm, cool and neutral artwork, including across each loop seam.
// Each artwork belongs to one row only. Repeat within that row to fill wide screens.
const rows = [
  [16, 12, 1, 5],
  [4, 13, 15, 11],
  [6, 8, 17, 10],
].map((row) => [...row, ...row].map((id, index) => ({
  key: `${id}-${index}`,
  src: id === 13 ? "images/ribbons/13-light-gray.png" : `images/ribbons/${id}.jpg`,
  name: artworkNames[id],
})));

/** Decorative, seamless image ribbons; no project navigation. */
export function WorksShowcaseB() {
  return (
    <section aria-label="Selected work" className="border-t border-foreground/15 py-10 sm:py-14">
      <div className="mx-auto max-w-(--portfolio-width) px-5 sm:px-8">
        <div className="space-y-3 overflow-hidden sm:space-y-4">
          {rows.map((items, row) => (
            <div key={row} className="marquee-pause overflow-hidden">
              <div
                className={`flex w-max ${row === 1 ? "animate-marquee-rev" : "animate-marquee"}`}
                style={{ animationDuration: `${(46 + row * 9) * 4 / 3}s` }}
              >
                {[0, 1].map((copy) => (
                  <div key={copy} aria-hidden={copy === 1 ? true : undefined} className="flex shrink-0 gap-3 pr-3 sm:gap-4 sm:pr-4">
                    {items.map((item) => (
                      <div key={item.key} className="h-24 w-36 shrink-0 overflow-hidden rounded-xl bg-foreground/5 sm:h-[max(11rem,11.3vw)] sm:w-[max(18rem,18.5vw)]">
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
