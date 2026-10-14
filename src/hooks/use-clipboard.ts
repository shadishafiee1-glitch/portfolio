"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useClipboard — copy-to-clipboard with a transient "copied" flag.
 *
 * Uses the async Clipboard API where available, falling back to a hidden
 * textarea + execCommand for older browsers. The `copied` flag resets after
 * `timeout` ms so the UI can show a transient "Copied!" affordance.
 */
export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(
    async (text: string) => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        setCopied(false);
        return false;
      }
    },
    [timeout],
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { copied, copy };
}
