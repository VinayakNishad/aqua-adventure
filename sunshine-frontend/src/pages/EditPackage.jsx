import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

const EditPackage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [description, setDescription] = useState("");
  const [points, setPoints] = useState([""]);

  // --- New state for managing activities ---
  const [allActivities, setAllActivities] = useState([]); // Holds all possible activities
  const [selectedActivities, setSelectedActivities] = useState([]); // Holds IDs of selected activities
  // --- End of new state ---

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch both the package details and all available activities
  useEffect(() => {
    const fetchPackageAndActivities = async () => {
      try {
        // Fetch package and activities data in parallel for efficiency
        const [packageRes, activitiesRes] = await Promise.all([
          axios.get(`${API}/packages/${id}`),
          axios.get(`${API}/activities`),
        ]);

        const pkg = packageRes.data;
        
        // Set package-specific state
        setName(pkg.name);
        setPrice(pkg.price);
        setDescription(pkg.description);
        setPickupTime(pkg.pickupTime || "");
        setDropTime(pkg.dropTime || "");
        setPoints(pkg.points?.length > 0 ? pkg.points : [""]);
        setExistingImages(pkg.images || []);

        // Set activities state
        setAllActivities(activitiesRes.data);
        
        // Initialize selected activities from the package's existing data
        // The backend populates 'activities', so we map over the array of objects to get their IDs
        const initialActivityIds = pkg.activities?.map(act => act._id) || [];
        setSelectedActivities(initialActivityIds);

      } catch (err) {
        console.error("Error fetching data", err);
        setError("Failed to load package details or activities");
      } finally {
        setLoading(false);
      }
    };
    fetchPackageAndActivities();
  }, [id]);

  const handlePointChange = (index, value) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };

  const addPoint = () => setPoints([...points, ""]);
  
  const removePoint = (index) => {
    if (points.length > 1) {
        setPoints(points.filter((_, i) => i !== index));
    } else {
        setPoints([""]);
    }
  };

  // --- New handler for activity checkbox changes ---
  const handleActivityChange = (activityId) => {
    setSelectedActivities(prevSelected =>
      prevSelected.includes(activityId)
        ? prevSelected.filter(id => id !== activityId) // If already selected, uncheck it
        : [...prevSelected, activityId] // Otherwise, check it
    );
  };
  // --- End of new handler ---

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleRemoveExistingImage = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this image?"
    );
    if (confirmDelete) {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("pickupTime", pickupTime);
      formData.append("dropTime", dropTime);
      
      const validPoints = points.filter(p => p.trim() !== "");
      formData.append("points", JSON.stringify(validPoints));
      formData.append("existingImages", JSON.stringify(existingImages));

      // --- Append selected activities to FormData ---
      formData.append("activities", JSON.stringify(selectedActivities));
      // --- End of append ---

      images.forEach((img) => formData.append("images", img));

      await axios.put(`${API}/packages/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Package updated successfully!");
      setTimeout(() => navigate(`/`), 2000); // Redirect after success
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update package");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center my-5">Loading package...</div>;
  }

  return (
    <div className="container my-5">
      <h2>Edit Package</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleUpdate} encType="multipart/form-data">
        {/* Package Name, Price, Times, and Description fields remain unchanged... */}
        <div className="mb-3">
          <label className="form-label">Package Name</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="row">
            <div className="col-md-4 mb-3">
                <label className="form-label">Price</label>
                <input
                    className="form-control"
                    type="number"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Pickup Time</label>
                <input
                    className="form-control"
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Drop Time</label>
                <input
                    className="form-control"
                    type="time"
                    value={dropTime}
                    onChange={(e) => setDropTime(e.target.value)}
                    required
                />
            </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* --- Section for Including Activities --- */}
        <div className="mb-4 p-3 border rounded">
          <label className="form-label fw-bold">Include Activities</label>
          <div className="row">
            {allActivities.length > 0 ? (
              allActivities.map(activity => (
                <div key={activity._id} className="col-md-4 col-sm-6">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={activity._id}
                      checked={selectedActivities.includes(activity._id)}
                      onChange={() => handleActivityChange(activity._id)}
                    />
                    <label className="form-check-label" htmlFor={activity._id}>
                      {activity.title}
                    </label>
                  </div>
                </div>
              ))
            ) : (
              <p>No activities available.</p>
            )}
          </div>
        </div>
        {/* --- End of Activities Section --- */}
        
        <div className="mb-4 p-3 border rounded">
             <label className="form-label fw-bold">Package Points/Highlights</label>
             {points.map((point, index) => (
                 <div key={index} className="d-flex mb-2 align-items-center">
                     <input
                         className="form-control me-2"
                         value={point}
                         onChange={(e) => handlePointChange(index, e.target.value)}
                         placeholder={`Point ${index + 1}`}
                     />
                     <button
                         type="button"
                         className="btn btn-sm btn-outline-danger"
                         onClick={() => removePoint(index)}
                         style={{ minWidth: '80px' }}
                     >
                         {points.length > 1 ? "Remove" : "Clear"}
                     </button>
                 </div>
             ))}
             <button type="button" className="btn btn-sm btn-outline-primary" onClick={addPoint}>
                 + Add New Point
             </button>
        </div>

        {/* Image upload and preview sections remain unchanged... */}
        <div className="mb-3">
          <label className="form-label">Upload New Images</label>
          <input
            type="file"
            className="form-control"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {existingImages.length > 0 && (
          <div className="mb-3 p-3 border rounded">
            <h6 className="fw-bold">Existing Images (Click ✕ to remove)</h6>
            <div className="d-flex gap-2 flex-wrap">
              {existingImages.map((src, i) => (
                <div
                  key={i}
                  className="position-relative"
                  style={{ display: "inline-block" }}
                >
                  <img
                    src={src}
                    alt="existing"
                    className="rounded"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0"
                    style={{ borderRadius: "50%", padding: "0 6px", lineHeight: "1.2" }}
                    onClick={() => handleRemoveExistingImage(i)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {imagePreviews.length > 0 && (
          <div className="mb-3 p-3 border rounded">
            <h6 className="fw-bold">New Images Preview</h6>
            <div className="d-flex gap-2 flex-wrap">
              {imagePreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="preview"
                  className="rounded"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Updating..." : "Update Package"}
        </button>
      </form>
    </div>
  );
};

export default EditPackage;