import React, { useEffect, useState, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import { deleteAd, getAds } from "../../services/adService";
import { ToastContainer, toast } from "react-toastify";
import ConfirmationModal from "../common/ConfirmationModal"; // Adjust path if needed
import { SECTION_IDS } from "../../constants/home";
import "./HeroCarousel.css"; // Import the CSS file
import "react-toastify/dist/ReactToastify.css";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import { HeroCarouselDeleteIcon } from "../icons";

// SVG Icon for Delete (No changes needed here)

const HeroCarousel = () => {
  const [ads, setAds] = useState([]);
  const { isAdmin } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const intervalRef = useRef(null);

  const buildHeroSrcSet = (imageUrl) => {
    const candidates = [640, 960, 1280, 1600];

    return candidates
      .map((width) => {
        const height = Math.round((width * 9) / 16);
        const optimized = getOptimizedCloudinaryUrl(imageUrl, {
          width,
          height,
          crop: "fill",
          quality: "auto:good",
        });
        return `${optimized} ${width}w`;
      })
      .join(", ");
  };

  // Fetch ads
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const data = await getAds();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      await deleteAd(selectedAd._id);
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
    <section id={SECTION_IDS.ADS} className="ads-section">
      <ToastContainer />
      <div
        className="carousel-container"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >
        {ads.map((ad, index) => (
          <div key={ad._id} className={`carousel-slide ${index === currentIndex ? "active" : ""}`}>
            <img
              src={getOptimizedCloudinaryUrl(ad.imageUrl, {
                width: 1280,
                height: 720,
                crop: "fill",
                quality: "auto:good",
              })}
              srcSet={buildHeroSrcSet(ad.imageUrl)}
              sizes="(max-width: 768px) 100vw, 1200px"
              alt={ad.title || ad.altText || `Scuba diving in Goa experience ${index + 1}`}
              className="carousel-image"
              width="1600"
              height="900"
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
            />
            {isAdmin && (
              <button
                onClick={() => confirmDelete(ad)}
                className="delete-ad-btn"
                aria-label={`Delete ad ${index + 1}`}
              >
                <HeroCarouselDeleteIcon />
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
