import { useEffect, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/**
 * Types each word, pauses, deletes it, then moves to the next (looping).
 * Returns the currently visible text. Static first word for reduced-motion users.
 */
export default function useTypewriter(
  words,
  { typeMs = 90, deleteMs = 45, holdMs = 1600, gapMs = 350 } = {},
) {
  const [state, setState] = useState({ index: 0, length: 0, deleting: false });
  const reduced = prefersReducedMotion();

  useEffect(() => {
    if (reduced || words.length === 0) return undefined;

    const word = words[state.index];
    let delay = state.deleting ? deleteMs : typeMs;
    let next;

    if (!state.deleting && state.length === word.length) {
      delay = holdMs;
      next = { ...state, deleting: true };
    } else if (state.deleting && state.length === 0) {
      delay = gapMs;
      next = { index: (state.index + 1) % words.length, length: 0, deleting: false };
    } else {
      next = { ...state, length: state.length + (state.deleting ? -1 : 1) };
    }

    const id = window.setTimeout(() => setState(next), delay);
    return () => window.clearTimeout(id);
  }, [state, words, reduced, typeMs, deleteMs, holdMs, gapMs]);

  if (reduced) return words[0] ?? "";
  return words[state.index].slice(0, state.length);
}
