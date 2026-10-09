import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ActivityForm from "../../components/admin/ActivityForm";
import { getActivity, updateActivity } from "../../services/activityService";
import { getErrorMessage } from "../../services/apiClient";
import { ROUTES } from "../../routes/paths";

export default function EditActivityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getActivity(id)
      .then((data) => active && setActivity(data))
      .catch((err) => active && setError(getErrorMessage(err, "Could not load activity.")));
    return () => {
      active = false;
    };
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await updateActivity(id, formData);
      toast.success("Activity updated");
      navigate(ROUTES.ACTIVITIES);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update activity."));
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Edit activity</h1>
          <p>{activity?.title || "Update details and photos."}</p>
        </div>
      </header>
      {error ? (
        <div className="admin-empty" role="alert">
          <i className="bi bi-exclamation-triangle" aria-hidden="true" />
          <p>{error}</p>
        </div>
      ) : !activity ? (
        <div className="text-center py-5" role="status">
          <span className="spinner-border" aria-hidden="true" />
          <span className="visually-hidden">Loading activity…</span>
        </div>
      ) : (
        <ActivityForm
          key={activity._id}
          initialValues={activity}
          existingImages={activity.images || []}
          submitLabel="Save changes"
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.ACTIVITIES)}
        />
      )}
    </>
  );
}
