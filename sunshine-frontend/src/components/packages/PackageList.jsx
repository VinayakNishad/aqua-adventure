import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { SECTION_IDS } from "../../constants/home";
import { getPackages } from "../../services/packageService";
import BookingModal from "./BookingModal";
import PackageCard from "./PackageCard";
import "./PackageList.css";

/** Home-page grid of all packages. */
export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingPackage, setBookingPackage] = useState(null);

  useEffect(() => {
    getPackages()
      .then(setPackages)
      .catch((err) => {
        console.error("Error fetching packages:", err);
        toast.error("Failed to load packages.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id={SECTION_IDS.PACKAGES} className="package-list">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container">
        <header className="package-list__header">
          <span className="package-list__eyebrow">Our trips</span>
          <h2>Popular packages</h2>
          <p>Scuba diving, island hopping and dolphin spotting, with pickup and guides included.</p>
        </header>

        {loading ? (
          <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading packages...</span>
            </div>
          </div>
        ) : (
          <div className="package-list__grid">
            {packages.map((pkg, index) => (
              <PackageCard
                key={pkg._id}
                pkg={pkg}
                priority={index < 2}
                onBook={setBookingPackage}
              />
            ))}
          </div>
        )}
      </div>

      {bookingPackage && (
        <BookingModal pkg={bookingPackage} show onClose={() => setBookingPackage(null)} />
      )}
    </section>
  );
}
