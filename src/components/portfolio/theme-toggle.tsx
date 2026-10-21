"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={
        "inline-flex h-9 w-9 items-center justify-center border-2 border-foreground text-foreground transition-colors hover:bg-foreground hover:text-background " +
        (className ?? "")
      }
    >
      <Sun
        className={
          "h-4 w-4 transition-all duration-300 " +
          (isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100")
        }
      />
      <Moon
        className={
          "absolute h-4 w-4 transition-all duration-300 " +
          (isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0")
        }
      />
    </button>
  );
}
