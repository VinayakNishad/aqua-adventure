import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// <-- 1. Import icons from react-icons
import { FaStar,  FaExclamationCircle } from "react-icons/fa";

const API = process.env.REACT_APP_API_URL;

const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="d-flex justify-content-center flex-wrap my-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: "pointer",
            fontSize: "2rem",
            color: star <= rating ? "#FFD700" : "#ccc",
            transition: "color 0.2s",
            margin: "0 8px",
          }}
          onClick={() => onRatingChange(star)}
        >
          {/* <-- 2. Replaced static '★' with the FaStar icon component */}
          <FaStar />
        </span>
      ))}
    </div>
  );
};

// 📋 ReviewForm Component
const ReviewForm = ({ packageId, name, onReviewAdded }) => {
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    if (packageId) formData.append("packageId", packageId);
    formData.append("userName", userName);
    formData.append("rating", rating);
    formData.append("comment", comment);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(`${API}/reviews`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (onReviewAdded) onReviewAdded(res.data);

      setUserName("");
      setRating(5);
      setComment("");
      setImage(null);

      // <-- 3. Enhanced toast message with an icon
      toast.success(
        <div className="d-flex align-items-center">
          Review submitted successfully!
        </div>
      );
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Error submitting review", err);
      // <-- 4. Enhanced toast message with an icon
      toast.error(
        <div className="d-flex align-items-center">
          <FaExclamationCircle className="me-2" />
          Failed to submit review. Please try again.
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <ToastContainer position="bottom-right" autoClose={2500} hideProgressBar />

      <h3 className="mb-3 text-center">Share Your Experience</h3>
      {name && <p className="text-muted text-center">How was your {name}?</p>}

      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded bg-light shadow-sm mx-auto"
        style={{ maxWidth: "600px" }}
      >
        

        {/* Star Rating */}
        <div className="mb-3 text-center">
          <label className="form-label d-block">Rating</label>
          <StarRating rating={rating} onRatingChange={setRating} />
        </div>
        {/* Name */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        {/* Comment */}
        <div className="mb-3">
          <label className="form-label">Comment</label>
          <textarea
            className="form-control"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-3">
          <label className="form-label">Upload an Image (optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Submit */}
        <div className="text-center mt-4 d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-primary px-4 d-flex align-items-center justify-content-center"
            disabled={loading}
            style={{ minWidth: "160px" }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
