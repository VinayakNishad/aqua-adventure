import { useState, useEffect } from "react";
import "./ScrollToTopArrow.css";

const ScrollToTopArrow = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    let rafId = null;

    const updateVisibility = () => {
      const shouldBeVisible = window.scrollY > 300;
      setIsVisible((prev) => (prev === shouldBeVisible ? prev : shouldBeVisible));
      rafId = null;
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(updateVisibility);
    };

    updateVisibility();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <div className="scroll-to-top">
      {isVisible && (
        <button onClick={scrollToTop} className="arrow-button" aria-label="Go to top">
          &#8679;
        </button>
      )}
    </div>
  );
};

export default ScrollToTopArrow;