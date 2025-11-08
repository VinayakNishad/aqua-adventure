import React, { useState, useEffect } from "react"; // Imported useEffect
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const API = process.env.REACT_APP_API_URL;

const PackageForm = ({ onCreated }) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropTime, setDropTime] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [points, setPoints] = useState([""]);
  const [submitting, setSubmitting] = useState(false);

  // --- New state for activities ---
  const [activities, setActivities] = useState([]); // To store all available activities
  const [selectedActivities, setSelectedActivities] = useState([]); // To store IDs of selected activities
  // --- End of new state ---

  // --- Effect to fetch activities on component mount ---
useEffect(() => {
  const fetchActivities = async () => {
    try {
      const res = await axios.get(`${API}/activities`);
      console.log("Activities fetched:", res.data); // 👈 Add this line
      setActivities(res.data);
    } catch (err) {
      toast.error("Failed to fetch activities");
      console.error("Error fetching activities:", err);
    }
  };
  fetchActivities();
}, []);

  // --- End of effect ---

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handlePointChange = (index, value) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };

  const addPoint = () => setPoints([...points, ""]);
  const removePoint = (index) => setPoints(points.filter((_, i) => i !== index));

  // --- New handler for activity checkbox changes ---
  const handleActivityChange = (activityId) => {
    setSelectedActivities(prevSelected =>
      prevSelected.includes(activityId)
        ? prevSelected.filter(id => id !== activityId) // If already selected, uncheck it
        : [...prevSelected, activityId] // Otherwise, check it
    );
  };
  // --- End of new handler ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      const validPoints = points.filter(p => p.trim() !== "");
      
      formData.append("name", name);
      formData.append("price", price);
      formData.append("pickupTime", pickupTime);
      formData.append("dropTime", dropTime);
      formData.append("description", description);
      formData.append("points", JSON.stringify(validPoints));
      
      // --- Append selected activities to FormData ---
      formData.append("activities", JSON.stringify(selectedActivities));
      // --- End of append ---

      images.forEach((img) => formData.append("images", img));

      const res = await axios.post(`${API}/packages`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onCreated && onCreated(res.data);
      toast.success("Package created successfully!");

      // --- Reset all fields after submission ---
      setName("");
      setPrice("");
      setPickupTime("");
      setDropTime("");
      setDescription("");
      setImages([]);
      setImagePreviews([]);
      setPoints([""]);
      setSelectedActivities([]); // Reset selected activities
      // --- End of reset ---

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create package");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        /* --- (Existing styles are unchanged) --- */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        
        .package-form-container {
            font-family: 'Poppins', sans-serif;
            background-color: #ffffff;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
            max-width: 800px;
            margin: 2rem auto;
        }

        .package-form-container h3 {
            text-align: center;
            font-weight: 600;
            color: #333;
            margin-bottom: 2rem;
        }

        .form-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
        }

        @media (min-width: 768px) {
            .form-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group.full-width {
            grid-column: 1 / -1;
        }

        .form-label {
            font-weight: 500;
            margin-bottom: 0.5rem;
            margin-top: 0.5rem;
            color: #555;
        }

        .form-control, .form-textarea {
            width: 100%;
            padding: 0.8rem 1rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-family: 'Poppins', sans-serif;
            font-size: 1rem;
            transition: border-color 0.3s, box-shadow 0.3s;
        }

        .form-control:focus, .form-textarea:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
        }

        .input-group {
            display: flex;
        }

        .input-group-text {
            background-color: #f8f9fa;
            border: 1px solid #ddd;
            padding: 0.8rem 1rem;
            border-right: none;
            border-radius: 8px 0 0 8px;
        }
        
        .input-group .form-control {
            border-radius: 0 8px 8px 0;
        }

        .image-upload-box {
            border: 2px dashed #ddd;
            border-radius: 8px;
            padding: 1.5rem;
            text-align: center;
            cursor: pointer;
            transition: border-color 0.3s, background-color 0.3s;
        }
        .image-upload-box:hover {
            border-color: #007bff;
            background-color: #f8f9fa;
        }
        .image-previews {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
            margin-top: 1rem;
        }
        .preview-image {
            width: 80px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            border: 1px solid #ddd;
        }
        
        /* --- New styles for Activities Checkbox Grid --- */
        .activities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
          background-color: #f8f9fa;
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid #ddd;
        }
        .activity-checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.75rem; /* Increased gap for better spacing */
        }
        .activity-checkbox-item input[type="checkbox"] {
            width: 1.2em;
            height: 1.2em;
            cursor: pointer;
        }
        .activity-checkbox-item label {
            font-weight: 400;
            color: #333;
            cursor: pointer;
            margin: 0;
        }
        /* --- End of new styles --- */

        .submit-btn {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 0.9rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.2s;
            width: 100%;
        }

        .submit-btn:hover {
            background-color: #0056b3;
            transform: translateY(-2px);
        }
        .submit-btn:disabled {
            background-color: #6c757d;
            cursor: not-allowed;
        }
      `}</style>
      <div className="package-form-container">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <h3>Create New Package</h3>

          <div className="form-group full-width">
            <label className="form-label">Package Name</label>
            <input
              className="form-control"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Ultimate Goa Adventure"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Price</label>
              <div className="input-group">
                <span className="input-group-text">₹</span>
                <input
                  className="form-control"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  min="0"
                />
              </div>
            </div>

            <div className="form-group">
                <label className="form-label">Pickup Time</label>
                <input
                    className="form-control"
                    required
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    type="time"
                />
            </div>
            
            <div className="form-group">
                <label className="form-label">Drop Time</label>
                <input
                    className="form-control"
                    required
                    value={dropTime}
                    onChange={(e) => setDropTime(e.target.value)}
                    type="time"
                />
            </div>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the package..."
            ></textarea>
          </div>

          {/* --- Section for Including Activities --- */}
          <div className="form-group full-width">
            <label className="form-label">Include Activities</label>
            {activities.length > 0 ? (
                <div className="activities-grid">
                {activities.map(activity => (
                    <div key={activity._id} className="activity-checkbox-item">
                    <input
                        type="checkbox"
                        id={activity._id}
                        checked={selectedActivities.includes(activity._id)}
                        onChange={() => handleActivityChange(activity._id)}
                    />
                    <label htmlFor={activity._id}>
                        {activity.title}
                    </label>
                    </div>
                ))}
                </div>
            ) : (
                <p>Loading activities...</p>
            )}
          </div>
          {/* --- End of Activities Section --- */}

          <div className="form-group full-width">
            <label className="form-label">Package Points (Extras)</label>
            {points.map((point, index) => (
              <div key={index} style={{ display: "flex", marginBottom: "0.5rem" }}>
                <input
                  className="form-control"
                  value={point}
                  onChange={(e) => handlePointChange(index, e.target.value)}
                  placeholder="e.g., Pickup & Drop"
                />
                <button
                  type="button"
                  onClick={() => removePoint(index)}
                  style={{ marginLeft: "0.5rem", background: "#dc3545", borderRadius: "8px", border: "none", color: "white", padding: "0 0.8rem", cursor: "pointer" }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addPoint} className="submit-btn" style={{ backgroundColor: "#28a745", marginTop: "0.5rem" ,width:"fit-content"}}>
              Add Point
            </button>
          </div>

          <div className="form-group full-width">
            <label className="form-label">Package Images</label>
            <label htmlFor="image-upload" className="image-upload-box">
              Click to browse or drag & drop images
            </label>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((src, i) => (
                  <img key={i} src={src} alt={`Preview ${i}`} className="preview-image" />
                ))}
              </div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Saving..." : "Create Package"}
          </button>
        </form>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </>
  );
};

export default PackageForm;
