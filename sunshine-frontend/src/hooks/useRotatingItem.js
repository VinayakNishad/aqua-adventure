import { useEffect, useState } from "react";

/** Cycles through `items` every `intervalMs`; stays on the first item for reduced-motion users. */
export default function useRotatingItem(items, intervalMs) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return undefined;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % items.length), intervalMs);
    return () => window.clearInterval(id);
  }, [items.length, intervalMs]);

  return items[index];
}
