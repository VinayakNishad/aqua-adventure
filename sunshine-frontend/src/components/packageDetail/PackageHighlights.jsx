import { useState } from "react";
import { HIGHLIGHTS_PREVIEW_COUNT } from "../../constants/packageInfo";
import "./PackageHighlights.css";

/** Package "sights & services" as a short checklist; the rest is behind "Show all". */
export default function PackageHighlights({ points }) {
  const [showAll, setShowAll] = useState(false);
  if (!points?.length) return null;

  const visible = showAll ? points : points.slice(0, HIGHLIGHTS_PREVIEW_COUNT);
  const hiddenCount = points.length - HIGHLIGHTS_PREVIEW_COUNT;

  return (
    <section className="detail-section" aria-labelledby="highlights-title">
      <h2 id="highlights-title" className="detail-section__title">
        Highlights
      </h2>
      <ul className={`package-highlights ${showAll ? "is-expanded" : ""}`}>
        {visible.map((point) => (
          <li key={point}>
            <i className="bi bi-check-circle-fill" aria-hidden="true" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && (
        <button
          type="button"
          className="btn btn-link px-0"
          onClick={() => setShowAll((v) => !v)}
          aria-expanded={showAll}
        >
          {showAll ? "Show less" : `Show all ${points.length} highlights`}
        </button>
      )}
    </section>
  );
}
