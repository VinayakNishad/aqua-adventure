/** Maximum rotation, in degrees, applied by the 3D card tilt. */
export const TILT_MAX_DEG = 8;

/** Base delay between staggered reveal items, in milliseconds. */
export const REVEAL_STAGGER_MS = 90;

export const REVEAL_OBSERVER_OPTIONS = Object.freeze({
  threshold: 0.15,
  rootMargin: "0px 0px -10% 0px",
});

/** Deterministic bubble layout so server and client renders match. */
export const BUBBLES = Object.freeze(
  Array.from({ length: 14 }, (_, i) => ({
    left: (i * 37) % 100,
    size: 6 + ((i * 7) % 18),
    duration: 9 + ((i * 5) % 9),
    delay: -((i * 3) % 12),
  })),
);
