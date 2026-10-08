import { useEffect } from "react";

import { TILT_MAX_DEG } from "../constants/animation";

/**
 * Adds a pointer-driven 3D tilt with a moving glare to every element matching
 * `selector`. Uses one delegated listener and requestAnimationFrame, and is
 * skipped on touch devices and for users who prefer reduced motion.
 */
export default function useTilt3D(selector = "[data-tilt]") {
  useEffect(() => {
    const finePointer = window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return undefined;

    let active = null;
    let frame = 0;

    const reset = (el) => {
      el.style.removeProperty("--tilt-x");
      el.style.removeProperty("--tilt-y");
      el.classList.remove("is-tilting");
    };

    const onMove = (event) => {
      const el = event.target.closest?.(selector);
      if (active && active !== el) reset(active);
      active = el;
      if (!el) return;

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        el.classList.add("is-tilting");
        el.style.setProperty("--tilt-x", `${(0.5 - py) * TILT_MAX_DEG * 2}deg`);
        el.style.setProperty("--tilt-y", `${(px - 0.5) * TILT_MAX_DEG * 2}deg`);
        el.style.setProperty("--glare-x", `${px * 100}%`);
        el.style.setProperty("--glare-y", `${py * 100}%`);
      });
    };

    const onLeave = () => {
      if (active) reset(active);
      active = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [selector]);
}
