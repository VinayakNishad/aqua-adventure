import { useEffect, useRef, useState } from "react";
import { REVEAL_OBSERVER_OPTIONS } from "../constants/animation";

const supportsObserver = () => typeof IntersectionObserver !== "undefined";

/** Reports when an element first scrolls into view (fires once). */
export default function useInView(options = REVEAL_OBSERVER_OPTIONS) {
  const ref = useRef(null);
  // Without IntersectionObserver support, render content visible immediately.
  const [inView, setInView] = useState(() => !supportsObserver());
  const { threshold, rootMargin } = options;

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, threshold, rootMargin]);

  return [ref, inView];
}
