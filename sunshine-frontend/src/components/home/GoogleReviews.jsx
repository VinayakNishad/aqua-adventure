import React, { useState, useEffect } from "react";
import { getGoogleReviews } from "../../services/reviewService";
import { GOOGLE_RATING, MAP_EMBED_URL } from "../../constants/packageInfo";
import "./GoogleReviews.css";
import { ChevronDownIcon, ExternalLinkIcon, StarIcon, WriteReviewIcon } from "../icons";

const PLACE_ID = "ChIJ3X6yPX3BvzsRG1hll88VYaQ";
const WRITE_REVIEW_URL = `https://search.google.com/local/writereview?placeid=${PLACE_ID}`;
const ALL_REVIEWS_URL = `https://search.google.com/local/reviews?placeid=${PLACE_ID}`;

// --- Helper Icons (Self-contained SVG Components) ---

const Avatar = ({ src, name }) => {
  const [imgError, setImgError] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  const handleImageError = () => {
    setImgError(true);
  };

  return (
    <div className="avatar-container">
      {!imgError && src ? (
        <img src={src} alt={name} className="author-avatar" onError={handleImageError} />
      ) : (
        <div className="avatar-fallback">{initial}</div>
      )}
    </div>
  );
};

// --- Main Component ---
const GoogleReviews = () => {
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [expandedReviews, setExpandedReviews] = useState([]);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setReviews(await getGoogleReviews());
      } catch (err) {
        // Without review data (e.g. Places API billing off) the map embed below still shows the rating.
        console.warn("Google reviews unavailable, showing map instead:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Handlers for "Show More" buttons ---
  const handleShowMoreReviews = () => {
    setVisibleReviewsCount((prevCount) => prevCount + 2);
  };

  const toggleReviewExpansion = (index) => {
    setExpandedReviews((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  if (loading) return <div className="text-center p-5">Loading Google Reviews...</div>;

  return (
    <>
      <section id="reviews" className="google-reviews-section">
        <div className="container">
          <div className="section-header mb-5">
            <h2 className="fw-bold">What Our Guests Say on Google</h2>
            <div className="section-header__actions">
              <a
                href={ALL_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="google-reviews-link"
              >
                <span>See all reviews</span>
                <ExternalLinkIcon />
              </a>
              <a
                href={WRITE_REVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="write-review-btn"
              >
                <WriteReviewIcon />
                <span>Write a Review</span>
              </a>
            </div>
          </div>

          {reviews.length === 0 && (
            <div className="reviews-fallback">
              {/* The map's place card shows the live rating, but Google hides it on narrow screens. */}
              <div className="reviews-fallback__summary">
                <span className="reviews-fallback__rating">
                  <StarIcon /> {GOOGLE_RATING} on Google
                </span>
                <p className="reviews-fallback__text">
                  Read every guest review on Google, or find us on the map.
                </p>
              </div>
              <div className="reviews-fallback__map">
                <iframe
                  src={MAP_EMBED_URL}
                  title="Paradise Watersports rating on Google Maps"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* --- Reviews Grid --- */}
          <div className="row">
            {reviews.slice(0, visibleReviewsCount).map((review, index) => {
              const isExpanded = expandedReviews.includes(index);
              const canTruncate = review.text.length > 150;
              const displayText =
                isExpanded || !canTruncate ? review.text : `${review.text.substring(0, 150)}...`;
              return (
                <div key={index} className="col-lg-4 col-md-6 mb-4">
                  <div className="review-card">
                    <div className="review-header">
                      <Avatar src={review.profilePhotoUrl} name={review.authorName} />
                      <div className="author-info">
                        <h5>{review.authorName}</h5>
                        <p>{review.relativeTimeDescription}</p>
                      </div>
                    </div>
                    <div className="review-body">
                      <div className="review-rating">
                        {[...Array(review.rating)].map((_, i) => (
                          <StarIcon key={i} />
                        ))}
                      </div>
                      <p>{displayText}</p>
                      {canTruncate && (
                        <button
                          onClick={() => toggleReviewExpansion(index)}
                          className="read-more-btn"
                        >
                          {isExpanded ? "Read Less" : "Read More"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {visibleReviewsCount < reviews.length && (
            <div className="show-more-container">
              <button onClick={handleShowMoreReviews} className="show-more-link">
                <span>Show More Reviews</span>
                <ChevronDownIcon />
              </button>
            </div>
          )}
        </div>
        {/* --- REMOVED: Floating Action Button is no longer here --- */}
      </section>
    </>
  );
};

export default GoogleReviews;
