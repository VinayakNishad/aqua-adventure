import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "./firebaseconfig";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import { Carousel } from "react-bootstrap";
import BookingForm from "../components/BookingForm";
// NOTE: Adjust paths for firebaseconfig and BookingForm as per your project structure

const WHATSAPP_NUMBER = "919763703724";
const WHATSAPP_TEMPLATE = "Hello, I'm interested in the *{packageName}* package priced at ₹{packagePrice}. Can I get more details?";
const API_BASE_URL = process.env.REACT_APP_API_URL;

// --- Icon Components ---
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const StarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffc107" stroke="#ffc107" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;


const Packages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [bookingPackage, setBookingPackage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const token = await getIdTokenResult(user);
                setIsAdmin(!!token.claims.admin);
            } else {
                setIsAdmin(false);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/packages`);
                setPackages(res.data);
            } catch (err) {
                console.error("Error fetching packages:", err);
                toast.error("Failed to load packages.");
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    const confirmDelete = (pkgId, e) => { e.stopPropagation(); setDeleteId(pkgId); };
    const cancelDelete = () => setDeleteId(null);
    const handleEdit = (packageId, e) => { e.stopPropagation(); navigate(`/admin/edit-package/${packageId}`); };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/packages/${deleteId}`);
            setPackages(packages.filter(p => p._id !== deleteId));
            toast.success("Package deleted successfully!");
        } catch (err) {
            toast.error("Failed to delete package.");
        } finally {
            setDeleteId(null);
        }
    };

    const handleEnquire = (pkg, e) => {
        e.stopPropagation();
        const message = WHATSAPP_TEMPLATE.replace('{packageName}', pkg.name).replace('{packagePrice}', pkg.price);
        const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(whatsappLink, '_blank');
    };

    const handleBookNow = (pkg, e) => {
        e.stopPropagation();
        setBookingPackage({ id: pkg._id, title: pkg.name });
    };

    const handleCloseBooking = () => setBookingPackage(null);

    if (loading) return <div className="d-flex justify-content-center align-items-center vh-100"><div className="spinner-border"></div></div>;

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <style>{`
                .packages-section { background-color: #ffffffff; padding: 3rem 1rem;}
                .packages-header { text-align: center; margin-bottom: 3rem; }
                .packages-header h1 { font-weight: 700; color: #333; }
                .packages-header p { color: #666; max-width: 600px; margin: 0.5rem auto 0; }
                
                .packages-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                    /* Center cards when there's only one column (mobile view) */
@media (max-width: 768px) {
  .packages-grid {
    display: flex;
    flex-direction: column;
    align-items: center; /* Centers cards horizontally */
  }

  .package-card {
    max-width: 360px;
    width: 100%;
  }
}


                .package-card {
                    background: #fff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.08);
                    display: flex;
                    flex-direction: column;
                    cursor: pointer;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    position: relative;
                    
                }
                .package-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 35px rgba(0,0,0,0.12);
                }
                
                .card-carousel-container { height: 220px; background-color: #e9ecef; }
                .carousel-img { width: 100%; height: 220px; object-fit: cover; }
                
                .card-content { padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1; }
                .package-name { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; color: #333; }
                
                .price-wrapper { display: flex; align-items: baseline; gap: 10px; margin-bottom: 1rem; }
                .current-price { font-size: 1.6rem; font-weight: 700; color: #28a745; }
                .original-price { font-size: 1rem; color: #6c757d; text-decoration: line-through; }
                .discount-badge { font-size: 0.6rem; font-weight: bold; color: #28a745; background-color: #d1e7dd; padding: 4px 8px; border-radius: 6px; }

                /* ✅ NEW/UPDATED Styles for Description */
                .package-description {
                    font-size: 0.9rem;
                    color: #666;
                    margin-bottom: 1rem;
                    /* Truncate to 3 lines */
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 3; /* Number of lines to show */
                    -webkit-box-orient: vertical;
                }

                .activities-list { list-style: none; padding: 0; font-size: 0.9rem; color: #555; }
                .activities-list li { display: flex; align-items: center; gap: 8px; margin-bottom: 0.25rem; }
                .activities-list svg { color: #28a745; }
                
                .rating-display { display: flex; align-items: center; gap: 5px; font-size: 0.9rem; color: #6c757d; margin-bottom: 1rem; }
                
                .card-actions { display: flex; gap: 10px; padding-top: 1.5rem; border-top: 1px solid #eee; margin-top: auto; }
                .card-actions .btn { flex-grow: 1; font-weight: 600; border-radius: 8px; }

                .admin-actions { position: absolute; top: 12px; right: 12px; z-index: 10; display: flex; gap: 8px; }
                .admin-actions .btn { background: rgba(255,255,255,0.8); backdrop-filter: blur(4px); border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: none; }
                
                .delete-confirm-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; justify-content: center; align-items: center; z-index: 9999; }
                .delete-confirm-box { background: white; padding: 2rem; border-radius: 12px; text-align: center; }
                .delete-btn{display:flex; justify-content:space-evenly;}
            `}</style>

            <section id="packages" className="packages-section">
                <div className="packages-header">
                    <h1>Exciting Packages</h1>
                    <p>Explore a world of Paradise watersports and scuba! with grand island, water sports and scuba with beautiful scenic sight scene view!</p>
                </div>
                <div className="packages-grid">
                    {packages.map(pkg => {

                        const originalPrice = Math.ceil(pkg.price * 1.10); // 10% higher, rounded up

                        return (
                            <div key={pkg._id} className="package-card" onClick={() => navigate(`/package/${pkg._id}`)}>
                                {isAdmin && (
                                    <div className="admin-actions">
                                        <button className="btn btn-light" onClick={(e) => handleEdit(pkg._id, e)}><EditIcon /></button>
                                        <button className="btn btn-light" onClick={(e) => confirmDelete(pkg._id, e)}><DeleteIcon /></button>
                                    </div>
                                )}
                                <div className="card-carousel-container">
                                    {pkg.images && pkg.images.length > 0 ? (
                                        <Carousel fade interval={2000} controls={pkg.images.length > 1} indicators={pkg.images.length > 1}>
                                            {pkg.images.map((imgUrl, idx) => (
                                                <Carousel.Item key={idx}>
                                                    <img className="d-block w-100 carousel-img" src={imgUrl} alt={`${pkg.name} slide ${idx + 1}`} />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    ) : (
                                        <div className="d-flex justify-content-center align-items-center h-100"><p className="text-muted">No Image</p></div>
                                    )}
                                </div>
                                <div className="card-content">
                                    <h3 className="package-name">{pkg.name}</h3>
                                    {pkg.reviewCount > 0 ? (
                                        <div className="rating-display">
                                            <StarIcon filled={true} />
                                            <strong>{pkg.avgRating?.toFixed(1)}</strong>
                                            <span className="count">({pkg.reviewCount} Reviews)</span>
                                        </div>
                                    ) : (
                                        <div className="rating-display"><span className="count">No reviews yet</span></div>
                                    )}


                                    <p className="package-description">{pkg.description}</p>

                                    <div className="price-wrapper">

                                        <span className="current-price">₹{pkg.price}</span>
                                        <del className="original-price">₹{originalPrice}</del>

                                        <div className="text-muted">/person</div>
                                    </div>

                                    {/* Unchanged list logic */}
                                    <ul className="activities-list">
                                        {Array.isArray(pkg.includes) && pkg.includes.slice(0, 3).map((item, index) => (
                                            <li key={index}><CheckIcon /> {item}</li>
                                        ))}
                                        {Array.isArray(pkg.includes) && pkg.includes.length > 3 && <li>... and more!</li>}
                                    </ul>

                                    <div className="card-actions">
                                        <button className="btn btn-outline-success" onClick={(e) => handleEnquire(pkg, e)}>Enquire</button>
                                        <button className="btn btn-primary" onClick={(e) => handleBookNow(pkg, e)}>Book Now</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {deleteId && (
                <div className="delete-confirm-overlay">
                    <div className="delete-confirm-box">
                        <p>Are you sure you want to delete this package?</p>
                        <div className="delete-btn">
                            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                            <button className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {bookingPackage && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <BookingForm
                                packageId={bookingPackage.id}
                                title={bookingPackage.title}
                                onClose={handleCloseBooking}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Packages;
