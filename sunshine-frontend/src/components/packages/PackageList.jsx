import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { deletePackage, getPackages } from "../../services/packageService";
import { ToastContainer, toast } from "react-toastify";
import { Carousel } from "react-bootstrap";
import BookingForm from "./BookingForm";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import "./PackageList.css";
import { packageEnquiryMessage } from "../../constants/messages";
import { buildWhatsAppUrl } from "../../utils/whatsapp";
import { EditIcon, PackageListCheckIcon, PackageListDeleteIcon, StarIcon } from "../icons";
// NOTE: Adjust paths for firebaseconfig and BookingForm as per your project structure

// --- Icon Components ---

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const [deleteId, setDeleteId] = useState(null);
  const [bookingPackage, setBookingPackage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setPackages(await getPackages());
      } catch (err) {
        console.error("Error fetching packages:", err);
        toast.error("Failed to load packages.");
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const confirmDelete = (pkgId, e) => {
    e.stopPropagation();
    setDeleteId(pkgId);
  };
  const cancelDelete = () => setDeleteId(null);
  const handleEdit = (packageId, e) => {
    e.stopPropagation();
    navigate(`/admin/edit-package/${packageId}`);
  };

  const handleDelete = async () => {
    try {
      await deletePackage(deleteId);
      setPackages(packages.filter((p) => p._id !== deleteId));
      toast.success("Package deleted successfully!");
    } catch {
      toast.error("Failed to delete package.");
    } finally {
      setDeleteId(null);
    }
  };

  const handleEnquire = (pkg, e) => {
    e.stopPropagation();
    window.open(buildWhatsAppUrl(packageEnquiryMessage(pkg)), "_blank");
  };

  const handleBookNow = (pkg, e) => {
    e.stopPropagation();
    setBookingPackage({ id: pkg._id, title: pkg.name });
  };

  const handleCloseBooking = () => setBookingPackage(null);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border"></div>
      </div>
    );

  return (
    <div className="package-list">
      <ToastContainer position="top-right" autoClose={3000} />

      <section id="packages" className="packages-section">
        <div className="packages-header">
          <h2>Exciting Packages</h2>
          <p>
            Explore a world of Paradise watersports and scuba! with grand island, water sports and
            scuba with beautiful scenic sight scene view!
          </p>
        </div>
        <div className="packages-grid">
          {packages.map((pkg, packageIndex) => {
            const originalPrice = Math.ceil(pkg.price * 1.1); // 10% higher, rounded up

            return (
              <div
                key={pkg._id}
                className="package-card"
                data-tilt
                onClick={() => navigate(`/package/${pkg._id}`)}
              >
                {isAdmin && (
                  <div className="admin-actions">
                    <button className="btn btn-light" onClick={(e) => handleEdit(pkg._id, e)}>
                      <EditIcon />
                    </button>
                    <button className="btn btn-light" onClick={(e) => confirmDelete(pkg._id, e)}>
                      <PackageListDeleteIcon />
                    </button>
                  </div>
                )}
                <div className="card-carousel-container">
                  {pkg.images && pkg.images.length > 0 ? (
                    <Carousel
                      fade
                      interval={2000}
                      controls={pkg.images.length > 1}
                      indicators={pkg.images.length > 1}
                    >
                      {pkg.images.map((imgUrl, idx) => (
                        <Carousel.Item key={idx}>
                          <img
                            className="d-block w-100 carousel-img"
                            src={getOptimizedCloudinaryUrl(imgUrl, {
                              width: 960,
                              height: 540,
                              crop: "fill",
                            })}
                            alt={`${pkg.name} slide ${idx + 1}`}
                            loading={packageIndex < 2 && idx === 0 ? "eager" : "lazy"}
                            fetchPriority={packageIndex < 2 && idx === 0 ? "high" : "auto"}
                            decoding="async"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <div className="d-flex justify-content-center align-items-center h-100">
                      <p className="text-muted">No Image</p>
                    </div>
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
                    <div className="rating-display">
                      <span className="count">No reviews yet</span>
                    </div>
                  )}

                  <p className="package-description">{pkg.description}</p>

                  <div className="price-wrapper">
                    <span className="current-price">₹{pkg.price}</span>
                    <del className="original-price">₹{originalPrice}</del>

                    <div className="text-muted">/person</div>
                  </div>

                  {/* Unchanged list logic */}
                  <ul className="activities-list">
                    {Array.isArray(pkg.includes) &&
                      pkg.includes.slice(0, 3).map((item, index) => (
                        <li key={index}>
                          <PackageListCheckIcon /> {item}
                        </li>
                      ))}
                    {Array.isArray(pkg.includes) && pkg.includes.length > 3 && (
                      <li>... and more!</li>
                    )}
                  </ul>

                  <div className="card-actions">
                    <button
                      className="btn btn-outline-success"
                      onClick={(e) => handleEnquire(pkg, e)}
                    >
                      Enquire
                    </button>
                    <button className="btn btn-primary" onClick={(e) => handleBookNow(pkg, e)}>
                      Book Now
                    </button>
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
              <button className="btn btn-danger" onClick={handleDelete}>
                Delete
              </button>
              <button className="btn btn-secondary" onClick={cancelDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {bookingPackage && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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
    </div>
  );
};

export default Packages;
