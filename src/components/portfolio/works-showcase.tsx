"use client";

import type { NavigateFn } from "@/hooks/use-hash-route";
import { WorksShowcaseA } from "./works-showcase-a";
import { WorksShowcaseB } from "./works-showcase-b";
import { WorksShowcaseC } from "./works-showcase-c";

/**
 * Wrapper that renders one of the three works-showcase options based on
 * which boolean is true. Lets the home view switch layouts via a query
 * param (?showcase=a|b|c) for previewing.
 */
export function WorksShowcase({
  a,
  b,
  c,
  navigate,
}: {
  a: boolean;
  b: boolean;
  c: boolean;
  navigate: NavigateFn;
}) {
  if (b) return <WorksShowcaseB navigate={navigate} />;
  if (c) return <WorksShowcaseC navigate={navigate} />;
  return <WorksShowcaseA navigate={navigate} />;
}
