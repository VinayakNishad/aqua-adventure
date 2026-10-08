import { useState } from "react";
import { Link } from "react-router-dom";
import StarRating from "../common/StarRating";
import UserAvatar from "../common/UserAvatar";
import { REVIEWS_PREVIEW_COUNT } from "../../constants/packageInfo";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import "./PackageReviews.css";

/** Compact rating summary plus a swipeable row of guest reviews. */
export default function PackageReviews({ pkg, onImageClick }) {
  const [showAll, setShowAll] = useState(false);
  const reviews = pkg.reviews ?? [];
  const visible = showAll ? reviews : reviews.slice(0, REVIEWS_PREVIEW_COUNT);

  return (
    <section id="package-reviews" className="detail-section" aria-labelledby="reviews-title">
      <div className="detail-section__head">
        <h2 id="reviews-title" className="detail-section__title">
          Guest reviews
        </h2>
        <Link
          to={`/package/${pkg._id}/review`}
          className="btn btn-outline-primary btn-sm rounded-pill"
        >
          <i className="bi bi-pencil" aria-hidden="true" /> Write a review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <p className="text-muted">No reviews yet. Be the first to share your experience!</p>
      ) : (
        <>
          <div className="reviews-summary">
            <span className="reviews-summary__score">{pkg.avgRating.toFixed(1)}</span>
            <div>
              <StarRating value={pkg.avgRating} size="1.2rem" />
              <div className="text-muted small">
                {pkg.reviewCount} {pkg.reviewCount === 1 ? "review" : "reviews"}
              </div>
            </div>
          </div>

          <ul className={`review-list ${showAll ? "review-list--all" : ""}`}>
            {visible.map((review) => (
              <li key={review._id} className="review-card">
                <div className="review-card__head">
                  <UserAvatar name={review.userName} />
                  <div>
                    <strong>{review.userName}</strong>
                    <StarRating value={review.rating} size="0.85rem" />
                  </div>
                </div>
                {review.comment && <p className="review-card__text">{review.comment}</p>}
                {review.image && (
                  <img
                    src={getOptimizedCloudinaryUrl(review.image, {
                      width: 200,
                      height: 200,
                      crop: "fill",
                    })}
                    alt={`Photo from ${review.userName}`}
                    className="review-card__photo"
                    onClick={() => onImageClick(review.image)}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </li>
            ))}
          </ul>

          {reviews.length > REVIEWS_PREVIEW_COUNT && (
            <button
              type="button"
              className="btn btn-link px-0"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? "Show fewer reviews" : `See all ${reviews.length} reviews`}
            </button>
          )}
        </>
      )}
    </section>
  );
}
