import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { SECTION_IDS } from "../../constants/home";
import { deletePackage, getPackages } from "../../services/packageService";
import { EditIcon, PackageListDeleteIcon } from "../icons";
import BookingModal from "./BookingModal";
import PackageCard from "./PackageCard";
import "./PackageList.css";

/** Home-page grid of all packages, with admin edit/delete controls. */
export default function PackageList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [bookingPackage, setBookingPackage] = useState(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getPackages()
      .then(setPackages)
      .catch((err) => {
        console.error("Error fetching packages:", err);
        toast.error("Failed to load packages.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    try {
      await deletePackage(deleteId);
      setPackages((list) => list.filter((p) => p._id !== deleteId));
      toast.success("Package deleted successfully!");
    } catch {
      toast.error("Failed to delete package.");
    } finally {
      setDeleteId(null);
    }
  };

  const renderAdminActions = (pkg) =>
    isAdmin && (
      <div className="pkg-admin-actions">
        <button
          type="button"
          className="btn btn-light"
          onClick={() => navigate(`/admin/edit-package/${pkg._id}`)}
          aria-label={`Edit ${pkg.name}`}
        >
          <EditIcon />
        </button>
        <button
          type="button"
          className="btn btn-light"
          onClick={() => setDeleteId(pkg._id)}
          aria-label={`Delete ${pkg.name}`}
        >
          <PackageListDeleteIcon />
        </button>
      </div>
    );

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
                adminActions={renderAdminActions(pkg)}
              />
            ))}
          </div>
        )}
      </div>

      {bookingPackage && (
        <BookingModal pkg={bookingPackage} show onClose={() => setBookingPackage(null)} />
      )}

      <Modal show={Boolean(deleteId)} onHide={() => setDeleteId(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title as="h5">Delete package?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This permanently removes the package and cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}
