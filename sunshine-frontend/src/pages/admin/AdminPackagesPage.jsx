import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import { ROUTES } from "../../routes/paths";
import { getErrorMessage } from "../../services/apiClient";
import { deletePackage, getPackages } from "../../services/packageService";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import { formatPrice, formatTime } from "../../utils/format";
import "./AdminPackagesPage.css";

const editPath = (id) => ROUTES.EDIT_PACKAGE.replace(":id", id);
const viewPath = (id) => ROUTES.PACKAGE_DETAIL.replace(":id", id);

function PackageRowActions({ pkg, onDelete }) {
  return (
    <div className="admin-pkg__actions">
      <Link
        to={viewPath(pkg._id)}
        target="_blank"
        className="btn btn-outline-secondary btn-sm"
        aria-label={`View ${pkg.name}`}
      >
        <i className="bi bi-eye" aria-hidden="true" />
      </Link>
      <Link to={editPath(pkg._id)} className="btn btn-outline-primary btn-sm">
        <i className="bi bi-pencil me-1" aria-hidden="true" /> Edit
      </Link>
      <button
        type="button"
        className="btn btn-outline-danger btn-sm"
        onClick={() => onDelete(pkg)}
        aria-label={`Delete ${pkg.name}`}
      >
        <i className="bi bi-trash" aria-hidden="true" />
      </button>
    </div>
  );
}

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getPackages()
      .then(setPackages)
      .catch((err) => toast.error(getErrorMessage(err, "Failed to load packages.")))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePackage(toDelete._id);
      setPackages((list) => list.filter((p) => p._id !== toDelete._id));
      toast.success(`"${toDelete.name}" deleted.`);
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete package."));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Packages</h1>
          <p>Trips shown on the website. Edit prices, photos and what&rsquo;s included.</p>
        </div>
        <Link to={ROUTES.NEW_PACKAGE} className="btn btn-cta">
          <i className="bi bi-plus-lg me-1" aria-hidden="true" /> Add package
        </Link>
      </header>

      {loading ? (
        <div className="admin-empty">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading packages…</span>
          </div>
        </div>
      ) : packages.length === 0 ? (
        <div className="admin-card admin-empty">
          <i className="bi bi-box-seam" aria-hidden="true" />
          No packages yet. Add your first one.
        </div>
      ) : (
        <ul className="admin-pkg-list">
          {packages.map((pkg) => (
            <li key={pkg._id} className="admin-pkg">
              <img
                src={getOptimizedCloudinaryUrl(pkg.images?.[0], { width: 240, height: 180 })}
                alt=""
                className="admin-pkg__thumb"
              />
              <div className="admin-pkg__body">
                <h2 className="admin-pkg__name">{pkg.name}</h2>
                <ul className="admin-pkg__meta">
                  <li>
                    <strong>{formatPrice(pkg.price)}</strong> / person
                  </li>
                  {pkg.pickupTime && (
                    <li>
                      <i className="bi bi-clock" aria-hidden="true" /> {formatTime(pkg.pickupTime)}{" "}
                      – {formatTime(pkg.dropTime)}
                    </li>
                  )}
                  <li>
                    <i className="bi bi-water" aria-hidden="true" /> {pkg.activities?.length ?? 0}{" "}
                    activities
                  </li>
                  <li>
                    <i className="bi bi-images" aria-hidden="true" /> {pkg.images?.length ?? 0}{" "}
                    photos
                  </li>
                  <li>
                    <i className="bi bi-star-fill text-warning" aria-hidden="true" />{" "}
                    {pkg.reviewCount
                      ? `${pkg.avgRating.toFixed(1)} (${pkg.reviewCount})`
                      : "No reviews"}
                  </li>
                </ul>
              </div>
              <PackageRowActions pkg={pkg} onDelete={setToDelete} />
            </li>
          ))}
        </ul>
      )}

      <ConfirmationModal
        show={Boolean(toDelete)}
        title="Delete package?"
        message={toDelete && `"${toDelete.name}" will be removed from the website permanently.`}
        isDeleting={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
