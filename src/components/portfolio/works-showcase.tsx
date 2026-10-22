"use client";

import type { NavigateFn } from "@/hooks/use-hash-route";
import { WorksShowcaseA } from "./works-showcase-a";
import { WorksShowcaseB } from "./works-showcase-b";
import { WorksShowcaseC } from "./works-showcase-c";

/**
 * Wrapper that renders one of the three works-showcase options based on
 * which boolean is true. Lets the home view switch layouts via a query
 * param (?showcase=a|b|c) for previewing. The showcase is now a pure
 * display vitrin (non-clickable), so navigate is only used by B/C if they
 * still wire clicks — kept for backward compat.
 */
export function WorksShowcase({
  a,
  b,
  c,
}: {
  a: boolean;
  b: boolean;
  c: boolean;
  navigate: NavigateFn;
}) {
  if (b) return <WorksShowcaseB />;
  if (c) return <WorksShowcaseC />;
  return <WorksShowcaseA />;
}
