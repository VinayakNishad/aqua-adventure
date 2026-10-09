import { useState } from "react";
import "./ExpandableText.css";

/** Clamps long text to `lines` with a Read more / Show less toggle. */
export default function ExpandableText({ text, lines = 3, className = "" }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;

  return (
    <div className={`expandable-text ${className}`.trim()}>
      <p
        className={`expandable-text__body ${expanded ? "" : "is-clamped"}`}
        style={{ "--lines": lines }}
      >
        {text}
      </p>
      {text.length > 160 && (
        <button
          type="button"
          className="expandable-text__toggle"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
