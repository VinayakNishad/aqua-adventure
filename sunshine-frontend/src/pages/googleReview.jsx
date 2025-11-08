import React, { useState, useEffect } from "react";
import axios from "axios";

// --- Helper Icons (Self-contained SVG Components) ---
const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffc107" stroke="#ffc107" strokeWidth="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
    </svg>
);



const WriteReviewIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>;

const Avatar = ({ src, name }) => {
    const [imgError, setImgError] = useState(false);
    const initial = name ? name.charAt(0).toUpperCase() : '?';

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
                const [reviewsRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/google/reviews"),
                    
                ]);
                setReviews(reviewsRes.data);
              
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
        setVisibleReviewsCount(prevCount => prevCount + 2);
    };

 

    const toggleReviewExpansion = (index) => {
        setExpandedReviews(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const writeReviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;

    if (loading) return <div className="text-center p-5">Loading Google Reviews...</div>;
    if (error) return <div className="alert alert-warning text-center">{error}</div>;

    return (
        <>
            <style>{`
                .google-reviews-section { font-family: 'Poppins', sans-serif; background-color: #ffffff; padding: 4rem 1rem; }
                
                /* --- NEW: Header style for title and button --- */
                .section-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
                .section-header h2 { margin-bottom: 0 !important; }
                
                /* --- NEW: Style for the "Write a Review" button --- */
                .write-review-btn { background-color: #4285F4; color: white; padding: 0.75rem 1.5rem; border-radius: 50px; text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; gap: 0.5rem; transition: background-color 0.3s ease, box-shadow 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: none; }
                .write-review-btn:hover { background-color: #3367D6; color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }

                .review-card { background-color: #fff; border: none; border-radius: 15px; padding: 1.5rem; display: flex; flex-direction: column; height: 100%; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                .review-header { display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem; }
                .author-avatar { width: 45px; height: 45px; border-radius: 50%; object-fit: cover; }
                .author-info h5 { margin: 0; font-weight: 600; font-size: 1rem; }
                .author-info p { margin: 0; color: #6c757d; font-size: 0.8rem; }
                .review-body p { color: #333; line-height: 1.6; font-size: 0.9rem; margin-bottom: 0.5rem; }
                .review-rating { display: flex; gap: 2px; margin-bottom: 0.75rem; }
                .read-more-btn { background: none; border: none; color: #0d6efd; font-weight: 500; padding: 0; font-size: 0.85rem; cursor: pointer; }

                .photo-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; transition: transform 0.3s ease; aspect-ratio: 1 / 1; cursor: pointer; }
                .photo-item img:hover { transform: scale(1.05); }

                .show-more-container { text-align: center; margin-top: 1.5rem; }
                .show-more-link { background: none; border: none; color: #0d6efd; font-weight: 500; text-decoration: underline; display: inline-flex; align-items: center; gap: 0.3rem; padding: 0; cursor: pointer; font-size: 1rem; }
                .show-more-link:hover { text-decoration: none; }

                /* --- Lightbox Modal Styles --- */
                .lightbox-modal .modal-content { background-color: rgba(0, 0, 0, 0.85); backdrop-filter: blur(5px); border: none; }
                .lightbox-modal .modal-header { border-bottom: none; }
                .lightbox-modal .modal-body { padding: 0.5rem; display: flex; justify-content: center; align-items: center; }
                .lightbox-modal .btn-close { filter: invert(1) grayscale(100%) brightness(200%); }
                .lightbox-image { max-width: 90vw; max-height: 80vh; object-fit: contain; }
                .lightbox-nav { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.3); color: white; border: none; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; z-index: 1060; }
                .lightbox-nav.prev { left: 15px; }
                .lightbox-nav.next { right: 15px; }
                .lightbox-counter { position: absolute; top: 15px; left: 20px; color: white; background: rgba(0,0,0,0.4); padding: 5px 10px; border-radius: 20px; font-size: 0.9rem; z-index: 1060; }
                
                /* --- REMOVED .fab-write-review styles --- */
            `}</style>

            <section id="reviews" className="google-reviews-section">
                <div className="container">
                    {/* --- MODIFIED: Header with new button --- */}
                    <div className="section-header mb-5">
                        <h2 className="fw-bold">What Our Guests Say on Google</h2>
                        <a href={writeReviewUrl} target="_blank" rel="noopener noreferrer" className="write-review-btn">
                            <WriteReviewIcon />
                            <span>Write a Review</span>
                        </a>
                    </div>


                    {/* --- Reviews Grid --- */}
                    <div className="row">
                        {reviews.slice(0, visibleReviewsCount).map((review, index) => {
                            const isExpanded = expandedReviews.includes(index);
                            const canTruncate = review.text.length > 150;
                            const displayText = isExpanded || !canTruncate ? review.text : `${review.text.substring(0, 150)}...`;
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
                                                {[...Array(review.rating)].map((_, i) => <StarIcon key={i} />)}
                                            </div>
                                            <p>{displayText}</p>
                                            {canTruncate && (
                                                <button onClick={() => toggleReviewExpansion(index)} className="read-more-btn">
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