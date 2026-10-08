import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import PackageForm from "../../components/admin/PackageForm";
import { getPackage, updatePackage } from "../../services/packageService";
import { getErrorMessage } from "../../services/apiClient";
import { ROUTES } from "../../routes/paths";

const toInitialValues = (pkg) => ({
  name: pkg.name ?? "",
  description: pkg.description ?? "",
  price: pkg.price ?? "",
  duration: pkg.duration ?? "",
  category: pkg.category ?? "",
  pickupTime: pkg.pickupTime ?? "",
  dropTime: pkg.dropTime ?? "",
  points: (pkg.points ?? []).filter((p) => typeof p === "string" && p.trim()),
  activities: (pkg.activities ?? []).map((a) => (typeof a === "string" ? a : a._id)),
  existingImages: pkg.images ?? [],
});

export default function EditPackagePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState({ id: null, values: null, error: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    getPackage(id)
      .then((pkg) => active && setLoaded({ id, values: toInitialValues(pkg), error: "" }))
      .catch(
        (err) =>
          active &&
          setLoaded({ id, values: null, error: getErrorMessage(err, "Package not found") }),
      );
    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await updatePackage(id, formData);
      toast.success("Package updated");
      navigate(ROUTES.ADMIN_PACKAGES);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update package"));
      setSubmitting(false);
    }
  };

  const isCurrent = loaded.id === id;
  const initialValues = isCurrent ? loaded.values : null;
  const loadError = isCurrent ? loaded.error : "";

  let body;
  if (loadError) {
    body = (
      <div className="admin-card package-form-state" role="alert">
        <i className="bi bi-exclamation-circle fs-2 text-muted" aria-hidden="true" />
        <h2 className="admin-card__title mt-2">We couldn&apos;t load this package</h2>
        <p className="text-muted">{loadError}. It may have been deleted.</p>
        <Link to={ROUTES.ADMIN_PACKAGES} className="btn btn-cta">
          Back to packages
        </Link>
      </div>
    );
  } else if (!initialValues) {
    body = (
      <div className="admin-card package-form-state">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading package…</span>
        </Spinner>
      </div>
    );
  } else {
    body = (
      <PackageForm
        key={id}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitLabel="Save changes"
      />
    );
  }

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Edit package</h1>
          <p>{initialValues?.name || "Update details, activities and photos."}</p>
        </div>
        <Link to={ROUTES.ADMIN_PACKAGES} className="btn btn-link px-0">
          <i className="bi bi-arrow-left me-1" aria-hidden="true" />
          Back to packages
        </Link>
      </header>
      {body}
    </>
  );
}
