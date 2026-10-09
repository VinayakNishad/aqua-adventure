import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StarRating from "../common/StarRating";
import UserAvatar from "../common/UserAvatar";
import { REVIEWS_PREVIEW_COUNT } from "../../constants/packageInfo";
import { getGoogleReviews } from "../../services/reviewService";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import "./PackageReviews.css";

const RATING_LABELS = { 5: "Excellent", 4: "Very good", 3: "Average", 2: "Poor", 1: "Terrible" };

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : null;

/** Long comments are clamped to a few lines with a "Read more" toggle. */
function ReviewCard({ review, onImageClick }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.comment?.length > 220;
  const date = review.dateLabel ?? formatDate(review.createdAt);

  return (
    <li className="review-card">
      <i className="bi bi-quote review-card__quote" aria-hidden="true" />
      <div className="review-card__head">
        <UserAvatar name={review.userName} />
        <div>
          <strong>{review.userName}</strong>
          <span className="review-card__meta">
            {review.fromGoogle ? (
              <>
                <i className="bi bi-google" aria-hidden="true" /> Google review
              </>
            ) : (
              <>
                <i className="bi bi-patch-check-fill" aria-hidden="true" /> Verified guest
              </>
            )}
            {date && <> &middot; {date}</>}
          </span>
        </div>
      </div>
      <div className="review-card__rating">
        <StarRating value={review.rating} size="0.95rem" />
        <span>{RATING_LABELS[review.rating]}</span>
      </div>
      {review.comment && (
        <>
          <p className={`review-card__text ${expanded ? "is-expanded" : ""}`}>{review.comment}</p>
          {isLong && (
            <button
              type="button"
              className="btn btn-link btn-sm px-0 review-card__more"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </>
      )}
      {review.image && (
        <img
          src={getOptimizedCloudinaryUrl(review.image, { width: 240, height: 240, crop: "fill" })}
          alt={`Photo from ${review.userName}`}
          className="review-card__photo"
          onClick={() => onImageClick(review.image)}
          loading="lazy"
          decoding="async"
        />
      )}
    </li>
  );
}

/** Rating summary with a star breakdown, followed by guest review cards. */
export default function PackageReviews({ pkg, onImageClick }) {
  const [showAll, setShowAll] = useState(false);
  const [googleReviews, setGoogleReviews] = useState([]);
  const reviews = pkg.reviews ?? [];

  // Real Google reviews of the business fill out the list; only the 4-5 star ones with text.
  useEffect(() => {
    let active = true;
    getGoogleReviews()
      .then((data) => {
        if (!active) return;
        setGoogleReviews(
          data
            .filter((r) => r.rating >= 4 && r.text)
            .map((r, i) => ({
              _id: `google-${i}`,
              userName: r.authorName,
              rating: r.rating,
              comment: r.text,
              dateLabel: r.relativeTimeDescription,
              fromGoogle: true,
            })),
        );
      })
      .catch((err) => console.error("Failed to load Google reviews:", err));
    return () => {
      active = false;
    };
  }, []);

  const allReviews = [...reviews, ...googleReviews];
  const visible = showAll ? allReviews : allReviews.slice(0, REVIEWS_PREVIEW_COUNT);
  const total = reviews.length;
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const recommendPercent = total
    ? Math.round((reviews.filter((r) => r.rating >= 4).length / total) * 100)
    : 0;

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

      {allReviews.length === 0 ? (
        <div className="reviews-empty">
          <i className="bi bi-chat-heart" aria-hidden="true" />
          <p className="mb-0">No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <>
          {total > 0 && (
            <div className="reviews-overview">
              <div className="reviews-overview__score">
                <span className="reviews-overview__number">{pkg.avgRating.toFixed(1)}</span>
                <StarRating value={pkg.avgRating} size="1.2rem" />
                <span className="text-muted small">
                  Based on {pkg.reviewCount} {pkg.reviewCount === 1 ? "review" : "reviews"}
                </span>
                <span className="reviews-overview__recommend">
                  <i className="bi bi-hand-thumbs-up-fill" aria-hidden="true" /> {recommendPercent}%
                  recommend
                </span>
              </div>
              <ul className="rating-bars" aria-label="Rating breakdown">
                {breakdown.map(({ star, count }) => (
                  <li key={star}>
                    <span className="rating-bars__label">{star} ★</span>
                    <span className="rating-bars__track">
                      <span
                        className="rating-bars__fill"
                        style={{ width: `${(count / total) * 100}%` }}
                      />
                    </span>
                    <span className="rating-bars__count">{count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <ul className="review-list">
            {visible.map((review) => (
              <ReviewCard key={review._id} review={review} onImageClick={onImageClick} />
            ))}
          </ul>

          {allReviews.length > REVIEWS_PREVIEW_COUNT && (
            <div className="text-center mt-3">
              <button
                type="button"
                className="btn btn-outline-primary rounded-pill px-4"
                onClick={() => setShowAll((v) => !v)}
              >
                {showAll ? "Show fewer reviews" : `See all ${allReviews.length} reviews`}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
