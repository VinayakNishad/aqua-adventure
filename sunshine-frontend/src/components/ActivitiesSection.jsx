import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "../pages/firebaseconfig";
import { ToastContainer, toast } from 'react-toastify';
import { Carousel } from "react-bootstrap";

const API = process.env.REACT_APP_API_URL;

// --- SVGs for admin ---
const FiEdit = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const FiTrash2 = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;

// --- ActivityCard with Carousel ---
const ActivityCard = ({ activity, isAdmin, onUpdate, onDelete }) => {
    const { _id, title, images, description } = activity;
    const navigate = useNavigate();

    const handleCardClick = () => navigate(`/activity/${_id}`);
    const handleUpdateClick = (e) => { e.stopPropagation(); onUpdate(_id); };
    const handleDeleteClick = (e) => { e.stopPropagation(); onDelete(_id); };

    return (
        <div className="activity-card" onClick={handleCardClick}>
            {isAdmin && (
                <div className="admin-actions">
                    <button onClick={handleUpdateClick} className="admin-btn update-btn"><FiEdit /></button>
                    <button onClick={handleDeleteClick} className="admin-btn delete-btn"><FiTrash2 /></button>
                </div>
            )}
            <div className="card-image-container">
                {images && images.length > 0 ? (
                    <Carousel interval={null} fade={true} controls={images.length > 1} indicators={images.length > 1}>
                        {images.map((imageObj, index) => (
                            <Carousel.Item key={imageObj.public_id || index}>
                                <img
                                    className="d-block w-100 card-img"
                                    src={imageObj.url}
                                    alt={`Slide ${index + 1}`}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ) : (
                    <div className="no-image-placeholder">
                        <span>No Image Available</span>
                    </div>
                )}
            </div>

            <div className="card-content">
                <h5 className="card-title">{title}</h5>
                <p className="card-description">{description}</p>
            </div>
        </div>
    );
};

// --- Main ActivitiesSection ---
const ActivitiesSection = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                await user.getIdToken(true);
                const token = await getIdTokenResult(user);
                setIsAdmin(!!token.claims.admin);
            } else {
                setIsAdmin(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        axios.get(`${API}/activities`)
            .then(res => setActivities(res.data))
            .catch(err => {
                console.error(err);
                setError("Failed to load activities");
            })
            .finally(() => setLoading(false));
    }, []);

    const handleUpdate = (id) => navigate(`/admin/edit-activity/${id}`);
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this activity?")) {
            try {
                await axios.delete(`${API}/activities/${id}`);
                setActivities(prev => prev.filter(act => act._id !== id));
                toast.success("Activity deleted successfully!");
            } catch (err) {
                console.error(err);
                toast.error("Failed to delete activity.");
            }
        }
    };
    if (loading) return <div className="text-center my-5"><div className="spinner-border"></div></div>;
    if (error) return <div className="alert alert-danger mx-auto" style={{ maxWidth: '600px' }}>{error}</div>;

    return (
        <>
            <style>{`
            .activities-section-container { font-family: 'Poppins', sans-serif; padding: 3rem 1rem; }
            .activities-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 2rem; }
            .activity-card {
                background: #fff; border-radius: 15px; overflow: hidden;
                box-shadow: 0 4px 15px rgba(0,0,0,0.05); cursor: pointer;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                display: flex; flex-direction: column; position: relative;
            }
            .activity-card:hover { transform: translateY(-8px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            .card-image-container { height: 220px; background-color: #f0f0f0; }
            .carousel, .carousel-inner, .carousel-item, .card-img { height: 100%; }
            .card-img { object-fit: cover; }
            .no-image-placeholder { display: flex; align-items: center; justify-content: center; height: 100%; color: #6c757d; }
            
            .card-content { padding: 1.25rem; flex-grow: 1; display: flex; flex-direction: column; }
            .card-title { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem; color: #333; }
            .card-description { font-size: 0.9rem; color: #6c757d; flex-grow: 1; margin-bottom: 1rem; }
            .card-footer-details { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f0f0f0; padding-top: 1rem; margin-top: auto; }
            .price { font-size: 1.25rem; font-weight: bold; color: #007bff; }
            .rating { font-size: 0.9rem; color: #ffc107; }

            .admin-actions { position: absolute; top: 10px; right: 10px; display: flex; gap: 8px; z-index: 10; }
            .admin-btn { background-color: rgba(255,255,255,0.8); border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; color: #333; }
            .update-btn:hover { background-color: #0d6efd; color: white; }
            .delete-btn:hover { background-color: #dc3545; color: white; }
        `}</style>
            <div className="container activities-section-container">
                <ToastContainer position="top-right" autoClose={3000} />
                <h2 className="text-center fw-bold">Our Activities</h2>
                <p className="text-center mb-5 text-muted">
                    Dive into a world of adventure with our wide range of water sports.
                </p>
                <div className="activities-grid">
                    {activities.map(act => (
                        <ActivityCard
                            key={act._id}
                            activity={act}
                            isAdmin={isAdmin}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default ActivitiesSection;

