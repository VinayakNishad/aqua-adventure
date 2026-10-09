import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ActivityForm from "../../components/admin/ActivityForm";
import { createActivity } from "../../services/activityService";
import { getErrorMessage } from "../../services/apiClient";
import { ROUTES } from "../../routes/paths";

export default function CreateActivityPage() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createActivity(formData);
      toast.success("Activity created");
      navigate(ROUTES.ACTIVITIES);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to create activity."));
    }
  };

  return (
    <>
      <header className="admin-page-header">
        <div>
          <h1>New activity</h1>
          <p>Add a water sport or experience guests can book.</p>
        </div>
      </header>
      <ActivityForm
        submitLabel="Create activity"
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.ACTIVITIES)}
      />
    </>
  );
}
