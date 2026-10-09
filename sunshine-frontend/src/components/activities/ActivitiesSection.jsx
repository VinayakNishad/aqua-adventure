import { useEffect, useState } from "react";
import { Link, generatePath } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationModal from "../common/ConfirmationModal";
import { deleteActivity, getActivities } from "../../services/activityService";
import { getErrorMessage } from "../../services/apiClient";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import { ROUTES } from "../../routes/paths";
import "./ActivitiesSection.css";

/** Admin list of activities with edit/delete actions. */
export default function ActivitiesSection() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getActivities()
      .then(setActivities)
      .catch((err) => setError(getErrorMessage(err, "Failed to load activities.")))
      .finally(() => setLoading(false));
  }, []);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteActivity(pendingDelete._id);
      setActivities((prev) => prev.filter((a) => a._id !== pendingDelete._id));
      toast.success("Activity deleted");
      setPendingDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete activity."));
    } finally {
      setDeleting(false);
    }
  };

  let content;
  if (loading) {
    content = (
      <div className="text-center py-5" role="status">
        <span className="spinner-border" aria-hidden="true" />
        <span className="visually-hidden">Loading activities…</span>
      </div>
    );
  } else if (error) {
    content = (
      <div className="admin-empty" role="alert">
        <i className="bi bi-exclamation-triangle" aria-hidden="true" />
        <p>{error}</p>
      </div>
    );
  } else if (!activities.length) {
    content = (
      <div className="admin-empty">
        <i className="bi bi-water" aria-hidden="true" />
        <p>No activities yet. Add your first one to get started.</p>
      </div>
    );
  } else {
    content = (
      <ul className="admin-activities">
        {activities.map((act) => {
          const cover = act.images?.[0]?.url;
          return (
            <li key={act._id} className="admin-activity">
              <div className="admin-activity__media">
                {cover ? (
                  <img
                    src={getOptimizedCloudinaryUrl(cover, {
                      width: 600,
                      height: 400,
                      crop: "fill",
                    })}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="admin-activity__placeholder">
                    <i className="bi bi-image" aria-hidden="true" /> No photo
                  </span>
                )}
                {act.images?.length > 1 && (
                  <span className="admin-activity__count">
                    <i className="bi bi-images" aria-hidden="true" /> {act.images.length}
                  </span>
                )}
              </div>
              <div className="admin-activity__body">
                {act.category && <span className="admin-badge">{act.category}</span>}
                <h2 className="admin-activity__title">{act.title}</h2>
                <p className="admin-activity__desc">{act.shortDescription || act.description}</p>
              </div>
              <div className="admin-activity__actions">
                <Link
                  to={generatePath(ROUTES.EDIT_ACTIVITY, { id: act._id })}
                  className="btn btn-outline-secondary btn-sm"
                  aria-label={`Edit ${act.title}`}
                >
                  <i className="bi bi-pencil" aria-hidden="true" /> Edit
                </Link>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => setPendingDelete(act)}
                  aria-label={`Delete ${act.title}`}
                >
                  <i className="bi bi-trash" aria-hidden="true" /> Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>Activities</h1>
          <p>Manage the activities shown on the website.</p>
        </div>
        <Link to={ROUTES.NEW_ACTIVITY} className="btn btn-cta">
          <i className="bi bi-plus-lg" aria-hidden="true" /> Add activity
        </Link>
      </header>
      {content}
      <ConfirmationModal
        show={Boolean(pendingDelete)}
        title="Delete activity"
        message={`Delete "${pendingDelete?.title ?? ""}"? This cannot be undone.`}
        isDeleting={deleting}
        onConfirm={confirmDelete}
        onCancel={() => !deleting && setPendingDelete(null)}
      />
    </>
  );
}
