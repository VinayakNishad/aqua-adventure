import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
import { auth } from "../pages/firebaseconfig";
import { ToastContainer, toast } from "react-toastify";
import ConfirmationModal from "./ConfirmationModal"; // Adjust path if needed
import "./HeroCarousel.css"; // Import the CSS file
import "react-toastify/dist/ReactToastify.css";

const API = process.env.REACT_APP_API_URL;

// SVG Icon for Delete (No changes needed here)
const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z" />
  </svg>
);

const HeroCarousel = () => {
  const [ads, setAds] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const intervalRef = useRef(null);

  // ✅ Check admin role using custom claims (no hardcoded email!)
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Force refresh token to get latest custom claims
      await user.getIdToken(true);
      const token = await getIdTokenResult(user);
      setIsAdmin(!!token.claims.admin);
    } else {
      setIsAdmin(false);
    }
  });

  return () => unsubscribe();
}, []);


  // Fetch ads
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const { data } = await axios.get(`${API}/ads`);
        setAds(data.slice(0, 4));
      } catch (err) {
        console.error("Failed to fetch ads:", err);
        toast.error("Failed to load ads", { position: "top-center" });
      }
    };
    fetchAds();
  }, []);

  const nextSlide = () => {
    if (ads.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }
  };

  // Auto slide with pause on hover logic
  const startAutoSlide = () => {
    intervalRef.current = setInterval(nextSlide, 5000);
  };

  const stopAutoSlide = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    if (ads.length > 0) {
      startAutoSlide();
    }
    return () => stopAutoSlide();
  }, [ads]);

  // Delete logic
  const confirmDelete = (ad) => {
    setSelectedAd(ad);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!selectedAd) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/ads/${selectedAd._id}`);
      setAds((prev) => prev.filter((ad) => ad._id !== selectedAd._id));
      toast.success("Ad deleted successfully!", { position: "top-center" });
    } catch (err) {
      console.error("Failed to delete ad:", err);
      toast.error("Failed to delete ad.", { position: "top-center" });
    } finally {
      setDeleting(false);
      setShowConfirm(false);
      setSelectedAd(null);
    }
  };

  if (!ads.length) {
    return <div className="text-center p-5">Loading ads...</div>;
  }

  return (
    <section id="carousal">

      <ToastContainer />
      <div
        className="carousel-container"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        {ads.map((ad, index) => (
          <div
            key={ad._id}
            className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
          >
            <img src={ad.imageUrl} alt={`Ad ${index + 1}`} className="carousel-image" />
            {isAdmin && (
              <button
                onClick={() => confirmDelete(ad)}
                className="delete-ad-btn"
                aria-label={`Delete ad ${index + 1}`}
              >
                <DeleteIcon />
              </button>
            )}
          </div>
        ))}
      </div>

      {showConfirm && (
        <ConfirmationModal
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
          isDeleting={deleting}
        />
      )}
    </section>
  );
};

export default HeroCarousel;
