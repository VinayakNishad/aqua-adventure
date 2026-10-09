import React, { useState, useEffect } from "react";
import { getGoogleReviews } from "../../services/reviewService";
import "./GoogleReviews.css";
import { ChevronDownIcon, StarIcon, WriteReviewIcon } from "../icons";

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
  const [error, setError] = useState(null);
  const [expandedReviews, setExpandedReviews] = useState([]);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);

  const placeId = "ChIJ3X6yPX3BvzsRG1hll88VYaQ"; // ⚠️ Replace with your actual Place ID

  useEffect(() => {
    const fetchData = async () => {
      try {
        setReviews(await getGoogleReviews());
      } catch (err) {
        console.error("Failed to fetch Google data:", err);
        setError("Could not load Google reviews and photos at this time.");
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

  const writeReviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;

  if (loading) return <div className="text-center p-5">Loading Google Reviews...</div>;
  if (error) return <div className="alert alert-warning text-center">{error}</div>;

  return (
    <>
      <section id="reviews" className="google-reviews-section">
        <div className="container">
          {/* --- MODIFIED: Header with new button --- */}
          <div className="section-header mb-5">
            <h2 className="fw-bold">What Our Guests Say on Google</h2>
            <a
              href={writeReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="write-review-btn"
            >
              <WriteReviewIcon />
              <span>Write a Review</span>
            </a>
          </div>

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
