import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { createActivity } from "../../services/activityService";
import "./CreateActivityPage.css";

// Ensure your API endpoint is correct

const AddActivity = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Limit the number of files to 5, matching the backend
    if (files.length > 5) {
      toast.warn("You can only upload a maximum of 5 images.");
      return;
    }
    setImages(files);

    // Clean up old previews before creating new ones
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);

    formData.append("description", description);
    formData.append("duration", duration);
    formData.append("category", category);

    // This correctly appends each raw file for the backend to process
    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await createActivity(formData);

      toast.success("Activity added successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1500); // Give user time to see the success message
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding activity. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="add-activity-page">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className="form-container">
          <h2>Add New Activity</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group full-width">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group full-width">
              <label className="form-label">Full Description</label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  className="form-control"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 3 hours"
                />
              </div>
              <div className="form-group ">
                <label className="form-label">Category</label>
                <input
                  className="form-control"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g., Adventure"
                />
              </div>
            </div>

            <div className="form-group full-width mt-4 mb-4">
              <label className="form-label">Upload Images (up to 5)</label>
              <label htmlFor="file-upload" className="image-upload-box">
                Click to browse or drag & drop files
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  {imagePreviews.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="preview-image"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="form-group full-width">
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? "Adding..." : "Add Activity"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddActivity;
