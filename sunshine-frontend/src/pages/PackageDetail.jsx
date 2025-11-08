import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserAvatar from "./UseAvatar";
import { Container, Row, Col, Card, Button, Spinner, Carousel, Badge } from "react-bootstrap"; // Added Badge
import "bootstrap/dist/css/bootstrap.min.css";
import BookingForm from "../components/BookingForm";
import NavbarComp from "../components/Navbar";
import Footer from "../components/Footer";
import VideoGallery from "../components/VideoGallery";
import GeneralInfoPage from "../components/GeneralInfoPage";
import FAQ from "../components/FAQ";
import "../App.css";
import { ArrowRightCircle, Clock, Sunset, Check2Circle } from "react-bootstrap-icons";
import LocationSteps from "../components/LocationSteps";

const API = process.env.REACT_APP_API_URL;

// Helper functions (renderStars, formatTime) and ReviewsSection component remain unchanged
const renderStars = (rating) => {
  const roundedRating = Math.round(rating);
  return (
    <>
      {"★".repeat(roundedRating)}
      {"☆".repeat(5 - roundedRating)}
    </>
  );
};

const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  const [hourString, minute] = timeString.split(":");
  const hour = parseInt(hourString, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  let formattedHour = hour % 12;
  if (formattedHour === 0) {
    formattedHour = 12;
  }
  return `${formattedHour}:${minute} ${ampm}`;
};

const ReviewsSection = ({ pkg, onImageClick }) => {
  // ... This component's code is unchanged
  const [showAllReviews, setShowAllReviews] = useState(false);
  const totalReviews = pkg.reviewCount || 0;
  const ratingsCount = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: pkg.reviews?.filter((r) => r.rating === star).length || 0,
  }));
  return (
    <div id="reviews-section" className="my-5">
      <h2 className="mb-4">Reviews ({totalReviews})</h2>
      <Card className="p-4 mb-4 shadow-sm">
        <Row className="align-items-center">
          <Col xs={12} md={5} className="text-center mb-3 mb-md-0">
            <h1 className="display-4 mb-0 fw-bold">{pkg.avgRating?.toFixed(1) || "0.0"}</h1>
            <div style={{ fontSize: "1.5rem", color: "#ffc107" }}>{renderStars(pkg.avgRating || 0)}</div>
            <small className="text-muted">Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}</small>
          </Col>
          <Col xs={12} md={7}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingsCount.find((r) => r.star === star)?.count || 0;
              const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="d-flex align-items-center mb-1">
                  <span className="me-2">{star}★</span>
                  <div className="progress flex-grow-1" style={{ height: "10px" }}>
                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="text-muted ms-2" style={{ width: "30px" }}>{count}</span>
                </div>
              );
            })}
          </Col>
        </Row>
      </Card>
      {(showAllReviews ? pkg.reviews : pkg.reviews?.slice(0, 3))?.map((r) => (
        <Card key={r._id} className="mb-3 p-3">
          <div>
            <UserAvatar name={r.userName} />
            <span className="fw-bold fs-6">{r.userName}</span>
            <small className="text-muted ms-2">{new Date(r.createdAt).toLocaleDateString()}</small>
          </div>
           <span className="ms-5 text-warning mt-0">{renderStars(r.rating)}{" "}<span className="text-muted">({r.rating})</span></span>
          <p className="ms-2 mb-1">{r.comment}</p>
          {r.image && <img src={r.image} alt="review" className="mt-2 ms-2 rounded img-fluid" style={{ maxWidth: "150px", cursor: "pointer" }} onClick={() => onImageClick(r.image)} />}
        </Card>
      ))}
      {pkg.reviews?.length > 3 && (
        <div className="text-center mt-3">
          <Button variant="outline-primary" onClick={() => setShowAllReviews(!showAllReviews)}>
            {showAllReviews ? "See Less" : "See All Reviews"} <ArrowRightCircle className="ms-1" />
          </Button>
        </div>
      )}
    </div>
  );
};


const PackageDetail = () => {
  const { id } = useParams();
  const [pkg, setPackage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/packages/${id}`)
      .then((res) => setPackage(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

  if (!pkg)
    return (
      <Container className="text-center mt-5">
        <h2>Package not found</h2>
      </Container>
    );

  // --- MODIFICATION START ---
  // Calculate the original price before the 10% discount
  const originalPrice = Math.round(pkg.price * 1.10);
  // --- MODIFICATION END ---

  return (
    <>
      <NavbarComp />

      <Container className="my-2">
        <Row>
          <Col lg={7}>
            {pkg.images && pkg.images.length > 0 && (
              <Carousel fade indicators controls className="mb-4 rounded shadow-lg">
                {pkg.images.map((image, index) => (
                  <Carousel.Item key={index} interval={4000}>
                    <img
                      className="d-block w-100"
                      src={image}
                      alt={`${pkg.name} - slide ${index + 1}`}
                      style={{ height: "400px", objectFit: "cover", cursor: "pointer" }}
                      onClick={() => setPreviewImage(image)}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            )}
            <h1 className="mt-4">{pkg.name}</h1>
            <p className="lead">{pkg.description}</p>

            {pkg.pickupTime && pkg.dropTime && (
              <div className="d-flex flex-wrap gap-4 text-muted border-top border-bottom py-3 my-4">
                <div className="d-flex align-items-center">
                  <Clock size={18} className="me-2 text-primary" />
                  <strong>Opening:</strong>
                  <span className="ms-1">{formatTime(pkg.pickupTime)}</span>
                </div>
                <div className="d-flex align-items-center">
                  <Sunset size={18} className="me-2 text-primary" />
                  <strong>Closing:</strong>
                  <span className="ms-1">{formatTime(pkg.dropTime)}</span>
                </div>
              </div>
            )}

            {pkg.activities && pkg.activities.length > 0 && (
              <div className="my-5">
                <h2 className="mb-4">What’s Included</h2>
                <Row xs={1} md={2} lg={2} className="g-4">
                  {pkg.activities.map((activity) => (
                    <Col key={activity._id}>
                      <Card className="h-100 shadow-sm">

                        {activity.images && activity.images.length > 0 && (
                          <Carousel indicators={false} interval={null}>
                            {activity.images.map((image) => (
                              <Carousel.Item key={image.public_id}>
                                <img
                                  className="d-block w-100"
                                  src={image.url}
                                  alt={activity.title}
                                  style={{ height: 'auto', objectFit: 'fill', cursor: 'pointer' }}
                                  onClick={() => setPreviewImage(image.url)}
                                />
                              </Carousel.Item>
                            ))}
                          </Carousel>
                        )}

                        <Card.Body>
                          <Card.Title className="fw-bold">{activity.title}</Card.Title>

                          <Card.Text className="text-muted mb-2">
                            ({activity.category})
                          </Card.Text>

                          <Card.Text className="text-muted">
                            {activity.description}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )}


            {pkg.points && pkg.points.length > 0 && (
              <div className="my-5">
                <h2 className="mb-4">Sight Scene & Services</h2>
                <Row>
                  {pkg.points.map((point, index) => (
                    <Col md={6} key={index} className="mb-3">
                      <div className="d-flex align-items-center">
                        <Check2Circle size={20} className="text-info me-3 flex-shrink-0" />
                        <span>{point}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            )}



            <ReviewsSection pkg={pkg} onImageClick={setPreviewImage} />
            <VideoGallery />
            <LocationSteps />
            <GeneralInfoPage />
            <FAQ />
          </Col>

          
          {/* --- MODIFICATION START --- */}
          <Col lg={5} className="mt-2 mt-lg-0 d-none d-lg-block">
            <div className="sticky-top" style={{ top: "100px" }}>
              {/* Price Card */}
              <Card className="p-4 shadow mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0 text-muted">Price per person</h4>
                  <div className="text-end">
                    <h3 className="fw-bold mb-0 text-primary d-inline-block me-2">₹{pkg.price}</h3>
                    <del className="text-muted">₹{originalPrice}</del>
                    <Badge bg="danger" className="ms-2">10% OFF</Badge>
                  </div>
                </div>
                <p className="text-muted mb-4">
                  Book your slot now to secure your spot!
                </p>
                <div className="d-grid">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => setShowBooking(true)}
                  >
                    Book Now
                  </Button>
                </div>
              </Card>

              {/* Location Card */}
              <Card className="p-4 shadow">
                <h4 className="mb-3">Location</h4>
                <div className="ratio ratio-16x9">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.730208216731!2d73.77773757512401!3d15.498937485101022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfc17d3db27edd%3A0xa46115cf9765581b!2sParadise%20Watersports!5e0!3m2!1sen!2sin!4v1759642658765!5m2!1sen!2sin"
                    width="600"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </Card>
            </div>
          </Col>
          

        </Row>
      </Container>

      {/* --- MODIFICATION START --- */}
      <div className="mobile-booking-bar d-lg-none">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="d-flex align-items-center">
              <h5 className="mb-0 fw-bold me-2">₹{pkg.price}</h5>
              <del className="text-muted small">₹{originalPrice}</del>
              <Badge bg="danger" pill className="ms-2" style={{ fontSize: "0.6rem" }}>10% OFF</Badge>
            </div>
            <small className="text-muted d-block">per person</small>
          </div>
          <Button className="btn btn-primary btn-lg" onClick={() => { setShowBooking(true); }}>
            Book Now
          </Button>
        </div>
      </div>
      {/* --- MODIFICATION END --- */}

      {showBooking && (
        <>
          <div className="modal-backdrop show" style={{ backdropFilter: "blur(5px)", zIndex: 2000 }}></div>
          <div className="modal show d-block" tabIndex="-1" style={{ zIndex: 2001 }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <BookingForm
                  packageId={pkg._id}
                  title={pkg.name}
                  onClose={() => setShowBooking(false)}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {previewImage && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ background: "rgba(0,0,0,0.8)", zIndex: 2100 }}
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="btn btn-light position-absolute"
            style={{ top: "20px", right: "20px", zIndex: 2200 }}
            onClick={() => setPreviewImage(null)}
          >
            ✖
          </button>
          <img
            src={previewImage}
            alt="preview"
            className="img-fluid"
            style={{
              maxHeight: "90%",
              maxWidth: "90%",
              border: "none",
              boxShadow: "0 0 15px rgba(0,0,0,0.5)",
            }}
          />
        </div>
      )}

      <Footer />
    </>
  );
};

export default PackageDetail;

