import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PackageForm from "../../components/admin/PackageForm";
import { createPackage } from "../../services/packageService";
import { getErrorMessage } from "../../services/apiClient";
import { ROUTES } from "../../routes/paths";

export default function CreatePackagePage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await createPackage(formData);
      toast.success("Package created");
      navigate(ROUTES.ADMIN_PACKAGES);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to create package"));
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>New package</h1>
          <p>Set the price, timings, activities and photos guests will see.</p>
        </div>
        <Link to={ROUTES.ADMIN_PACKAGES} className="btn btn-link px-0">
          <i className="bi bi-arrow-left me-1" aria-hidden="true" />
          Back to packages
        </Link>
      </header>
      <PackageForm onSubmit={handleSubmit} submitting={submitting} submitLabel="Create package" />
    </>
  );
}
