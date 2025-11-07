import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUpload, FiXCircle } from "react-icons/fi";

const API = "http://localhost:5000/api";

const EditActivity = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // States
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Images
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [originalImages, setOriginalImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`${API}/activities/${id}`);
        setFormData(res.data);
        setOriginalData(res.data); // Save original data
        setExistingImages(res.data.images || []);
        setOriginalImages(res.data.images || []);
      } catch (err) {
        console.error("Failed to fetch activity", err);
        toast.error("Could not load activity data.");
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const handleRemoveExistingImage = (imageUrl) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submissionData = new FormData();

      // Compare fields and append only changed ones
      Object.keys(formData).forEach((key) => {
        if (key !== "images" && formData[key] !== originalData[key]) {
          submissionData.append(key, formData[key]);
        }
      });

      // Handle existing images (only if changed)
      if (JSON.stringify(existingImages) !== JSON.stringify(originalImages)) {
        existingImages.forEach((imgUrl) =>
          submissionData.append("existingImages", imgUrl)
        );
      }

      // Handle new images
      if (newImages.length > 0) {
        newImages.forEach((imgFile) => submissionData.append("images", imgFile));
      }

      // If no changes at all → stop
      if (
        submissionData.entries().next().done &&
        newImages.length === 0 &&
        JSON.stringify(existingImages) === JSON.stringify(originalImages)
      ) {
        toast.info("No changes detected!");
        setSubmitting(false);
        return;
      }

      // Send update request
      await axios.put(`${API}/activities/${id}`, submissionData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Activity updated successfully!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error("Update failed", err);
      toast.error(err.response?.data?.message || "Failed to update activity.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border"></div>
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        .edit-page { font-family: 'Poppins', sans-serif; background-color: #f4f7fa; padding: 2rem 1rem; min-height: 100vh; }
        .edit-form-container { background: #fff; max-width: 800px; margin: auto; padding: 2.5rem; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
        .form-header { text-align: center; margin-bottom: 2rem; }
        .form-header h2 { font-weight: 600; color: #333; }
        .form-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 768px) { .form-grid { grid-template-columns: 1fr 1fr; } }
        .form-group { margin-bottom: 1.5rem; }
        .full-width { grid-column: 1 / -1; }
        .form-label { font-weight: 500; margin-bottom: 0.5rem; display: block; }
        .form-control { width: 100%; padding: 0.8rem 1rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
        
        .image-management-section .preview-grid { display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem; }
        .image-preview-item { position: relative; }
        .preview-image { width: 100px; height: 100px; object-fit: cover; border-radius: 8px; }
        .remove-image-btn { position: absolute; top: -8px; right: -8px; background: #dc3545; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        
        .image-upload-box { border: 2px dashed #ddd; border-radius: 8px; padding: 1.5rem; text-align: center; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; color: #6c757d; }
        
        .submit-btn { background-color: #28a745; color: white; width: 100%; padding: 0.9rem; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 500; cursor: pointer; }
        .submit-btn:disabled { background-color: #6c757d; }
      `}</style>

      <div className="edit-page">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        <div className="edit-form-container">
          <div className="form-header">
            <h2>Edit Activity: {formData.title || ""}</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group full-width">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

           

            <div className="form-group full-width">
              <label className="form-label">Full Description</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                className="form-control"
                rows="4"
              ></textarea>
            </div>

            <div className="form-grid">
             
              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
               <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            </div>

           

            <div className="form-group full-width image-management-section">
              <label className="form-label">Manage Images</label>
              {existingImages.length > 0 && (
                <p className="text-muted small mb-1">Existing Images:</p>
              )}
              <div className="preview-grid">
                {existingImages.map((url) => (
                  <div key={url} className="image-preview-item">
                    <img
                      src={url.url}
                      alt="Existing"
                      className="preview-image"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingImage(url)}
                      className="remove-image-btn"
                    >
                      <FiXCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <label className="form-label mt-3">Upload New Images</label>
              <label htmlFor="file-upload" className="image-upload-box">
                <FiUpload size={24} />
                <span>Click to browse or drag & drop</span>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              <div className="preview-grid">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="image-preview-item">
                    <img src={src} alt="Preview" className="preview-image" />
                    <button
                      type="button"
                      onClick={() => handleRemoveNewImage(i)}
                      className="remove-image-btn"
                    >
                      <FiXCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="submit-btn mt-3"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditActivity;
