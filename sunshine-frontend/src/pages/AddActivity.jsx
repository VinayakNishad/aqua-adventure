import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

// Ensure your API endpoint is correct
const API = "http://localhost:5000/api";

const AddActivity = () => {
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
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
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        const previews = files.map(file => URL.createObjectURL(file));
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
        images.forEach(image => {
            formData.append("images", image);
        });

        try {
            await axios.post(`${API}/activities`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

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
            <style>{`
                /* Your CSS styles remain unchanged */
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
                
                .add-activity-page {
                    font-family: 'Poppins', sans-serif;
                    background-color: #f4f7fa;
                    min-height: 100vh;
                    padding: 2rem 1rem;
                }

                .form-container {
                    background-color: #ffffff;
                    padding: 2.5rem;
                    border-radius: 12px;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
                    max-width: 800px;
                    margin: auto;
                }

                .form-container h2 {
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
                        grid-template-columns: 1fr 1fr;
                    }
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }
                
                .full-width {
                    grid-column: 1 / -1;
                }

                .form-label {
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                    color: #555;
                }

                .form-control, .form-textarea {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.3s, box-shadow 0.3s;
                }

                .form-control:focus, .form-textarea:focus {
                    outline: none;
                    border-color: #007bff;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
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
                    width: 100px;
                    height: 100px;
                    object-fit: cover;
                    border-radius: 8px;
                    border: 1px solid #ddd;
                }

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
                            <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="form-group full-width">
                            <label className="form-label">Full Description</label>
                            <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows="4" />
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Duration</label>
                                <input className="form-control" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 3 hours" />
                            </div>
                            <div className="form-group ">
                                <label className="form-label">Category</label>
                                <input className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Adventure" />
                            </div>
                        </div>

                        <div className="form-group full-width mt-4 mb-4">
                            <label className="form-label">Upload Images (up to 5)</label>
                            <label htmlFor="file-upload" className="image-upload-box">
                                Click to browse or drag & drop files
                            </label>
                            <input id="file-upload" type="file" multiple accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />

                            {imagePreviews.length > 0 && (
                                <div className="image-previews">
                                    {imagePreviews.map((src, index) => (
                                        <img key={index} src={src} alt={`Preview ${index + 1}`} className="preview-image" />
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