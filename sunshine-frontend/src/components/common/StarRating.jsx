import "./StarRating.css";

/** Read-only 5-star display, rounded to the nearest whole star. */
export default function StarRating({ value = 0, size = "1rem" }) {
  const filled = Math.round(value);
  return (
    <span
      className="star-rating"
      style={{ fontSize: size }}
      role="img"
      aria-label={`${Number(value).toFixed(1)} out of 5 stars`}
    >
      {"★".repeat(filled)}
      <span className="star-rating__empty">{"★".repeat(5 - filled)}</span>
    </span>
  );
}
