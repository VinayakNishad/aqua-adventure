import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import ImageUploader from "./ImageUploader";
import { getActivities } from "../../services/activityService";
import { getErrorMessage } from "../../services/apiClient";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import { MAX_PACKAGE_IMAGES } from "../../constants/admin";
import { ROUTES } from "../../routes/paths";
import "./PackageForm.css";

const ACTIVITY_THUMB = { width: 320, height: 240 };

const EMPTY_VALUES = {
  name: "",
  description: "",
  price: "",
  duration: "",
  category: "",
  pickupTime: "",
  dropTime: "",
  points: [],
  activities: [],
  existingImages: [],
};

const FIELD_ORDER = ["name", "price", "pickupTime", "dropTime"];

const validate = (values) => {
  const errors = {};
  if (!values.name.trim()) errors.name = "Package name is required.";
  const price = Number(values.price);
  if (values.price === "" || !Number.isFinite(price) || price <= 0) {
    errors.price = "Enter a price greater than 0.";
  }
  if (!values.pickupTime) errors.pickupTime = "Pickup time is required.";
  if (!values.dropTime) errors.dropTime = "Drop time is required.";
  return errors;
};

/** Converts form values into the multipart payload the packages API expects. */
const buildFormData = (values, files, includeExisting) => {
  const formData = new FormData();
  ["name", "description", "price", "duration", "category", "pickupTime", "dropTime"].forEach(
    (key) =>
      formData.append(key, typeof values[key] === "string" ? values[key].trim() : values[key]),
  );
  formData.append("points", JSON.stringify(values.points));
  formData.append("activities", JSON.stringify(values.activities));
  if (includeExisting) formData.append("existingImages", JSON.stringify(values.existingImages));
  files.forEach((file) => formData.append("images", file));
  return formData;
};

/**
 * Shared create/edit form for packages.
 * `initialValues.existingImages` being present (edit mode) adds `existingImages` to the payload.
 * `onSubmit(formData)` should return a promise; it is awaited while `submitting` is shown.
 */
export default function PackageForm({ initialValues, onSubmit, submitting, submitLabel }) {
  const uid = useId();
  const fid = (name) => `${uid}-${name}`;
  const isEdit = Array.isArray(initialValues?.existingImages);

  const [values, setValues] = useState(() => ({ ...EMPTY_VALUES, ...initialValues }));
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [pointDraft, setPointDraft] = useState("");
  const [activities, setActivities] = useState([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const formRef = useRef(null);

  useEffect(() => {
    let active = true;
    getActivities()
      .then((list) => active && setActivities(list))
      .catch((err) => toast.error(getErrorMessage(err, "Failed to load activities")))
      .finally(() => active && setActivitiesLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const setField = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const bind = (key) => ({
    id: fid(key),
    name: key,
    value: values[key],
    onChange: (e) => setField(key, e.target.value),
  });

  const invalidProps = (key) => ({
    className: `form-control${errors[key] ? " is-invalid" : ""}`,
    "aria-invalid": Boolean(errors[key]),
    "aria-describedby": errors[key] ? fid(`${key}-error`) : undefined,
  });

  const errorText = (key) =>
    errors[key] && (
      <div id={fid(`${key}-error`)} className="invalid-feedback d-block">
        {errors[key]}
      </div>
    );

  const addPoint = () => {
    const text = pointDraft.trim();
    if (!text) return;
    setField("points", [...values.points, text]);
    setPointDraft("");
  };

  const removePoint = (index) =>
    setField(
      "points",
      values.points.filter((_, i) => i !== index),
    );

  const toggleActivity = (activityId) =>
    setField(
      "activities",
      values.activities.includes(activityId)
        ? values.activities.filter((idValue) => idValue !== activityId)
        : [...values.activities, activityId],
    );

  const removeExisting = (url) =>
    setField(
      "existingImages",
      values.existingImages.filter((u) => u !== url),
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    const firstError = FIELD_ORDER.find((key) => nextErrors[key]);
    if (firstError) {
      const el = formRef.current?.querySelector(`#${CSS.escape(fid(firstError))}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus({ preventScroll: true });
      return;
    }
    onSubmit(buildFormData(values, files, isEdit));
  };

  return (
    <form ref={formRef} className="package-form" onSubmit={handleSubmit} noValidate>
      <section className="admin-card" aria-labelledby={fid("basic-title")}>
        <h2 id={fid("basic-title")} className="admin-card__title">
          Basic details
        </h2>
        <div className="admin-form">
          <div className="admin-field is-full">
            <label htmlFor={fid("name")}>Package name</label>
            <input
              {...bind("name")}
              {...invalidProps("name")}
              placeholder="e.g. Grand Island Day Trip"
            />
            {errorText("name")}
          </div>

          <div className="admin-field">
            <label htmlFor={fid("price")}>Price per person</label>
            <div className={`input-group${errors.price ? " has-validation" : ""}`}>
              <span className="input-group-text">₹</span>
              <input
                {...bind("price")}
                {...invalidProps("price")}
                type="number"
                min="1"
                inputMode="numeric"
              />
            </div>
            {errorText("price")}
          </div>

          <div className="admin-field">
            <label htmlFor={fid("duration")}>Duration</label>
            <input {...bind("duration")} className="form-control" placeholder="e.g. 6 hours" />
          </div>

          <div className="admin-field is-full">
            <label htmlFor={fid("category")}>Category</label>
            <input {...bind("category")} className="form-control" placeholder="e.g. Water sports" />
          </div>

          <div className="admin-field">
            <label htmlFor={fid("pickupTime")}>Pickup time</label>
            <input {...bind("pickupTime")} {...invalidProps("pickupTime")} type="time" />
            {errorText("pickupTime")}
          </div>

          <div className="admin-field">
            <label htmlFor={fid("dropTime")}>Drop time</label>
            <input {...bind("dropTime")} {...invalidProps("dropTime")} type="time" />
            {errorText("dropTime")}
          </div>

          <div className="admin-field is-full">
            <label htmlFor={fid("description")}>Description</label>
            <textarea {...bind("description")} className="form-control" rows={5} />
          </div>
        </div>
      </section>

      <section className="admin-card" aria-labelledby={fid("points-title")}>
        <h2 id={fid("points-title")} className="admin-card__title">
          Highlights
        </h2>
        <div className="admin-field">
          <label htmlFor={fid("point")} className="visually-hidden">
            New highlight
          </label>
          <div className="package-points__add">
            <input
              id={fid("point")}
              className="form-control"
              value={pointDraft}
              placeholder="e.g. Free lunch included"
              onChange={(e) => setPointDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addPoint();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={addPoint}
              disabled={!pointDraft.trim()}
            >
              <i className="bi bi-plus-lg" aria-hidden="true" /> Add
            </button>
          </div>
          <p className="admin-field__hint">Press Enter to add. Shown as bullet points to guests.</p>
        </div>
        {values.points.length > 0 && (
          <ul className="package-points__list">
            {values.points.map((point, index) => (
              <li key={`${index}-${point}`} className="package-points__item">
                <i className="bi bi-check2-circle" aria-hidden="true" />
                <span>{point}</span>
                <button
                  type="button"
                  className="package-points__remove"
                  onClick={() => removePoint(index)}
                  aria-label={`Remove highlight: ${point}`}
                >
                  <i className="bi bi-x-lg" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="admin-card" aria-labelledby={fid("activities-title")}>
        <div className="package-form__card-head">
          <h2 id={fid("activities-title")} className="admin-card__title">
            Included activities
          </h2>
          {values.activities.length > 0 && (
            <span className="admin-field__hint">{values.activities.length} selected</span>
          )}
        </div>
        {activitiesLoading ? (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" role="status">
              <span className="visually-hidden">Loading activities…</span>
            </Spinner>
          </div>
        ) : activities.length === 0 ? (
          <p className="text-muted mb-0">
            No activities yet. <Link to={ROUTES.ACTIVITIES}>Manage activities</Link>
          </p>
        ) : (
          <div className="package-activities">
            {activities.map((activity) => {
              const selected = values.activities.includes(activity._id);
              const thumb = activity.images?.[0]?.url;
              const inputId = fid(`activity-${activity._id}`);
              return (
                <label
                  key={activity._id}
                  htmlFor={inputId}
                  className={`package-activity${selected ? " is-selected" : ""}`}
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    className="form-check-input package-activity__check"
                    checked={selected}
                    onChange={() => toggleActivity(activity._id)}
                  />
                  {thumb ? (
                    <img
                      className="package-activity__thumb"
                      src={getOptimizedCloudinaryUrl(thumb, ACTIVITY_THUMB)}
                      alt=""
                      loading="lazy"
                    />
                  ) : (
                    <span className="package-activity__thumb package-activity__thumb--empty">
                      <i className="bi bi-water" aria-hidden="true" />
                    </span>
                  )}
                  <span className="package-activity__body">
                    <span className="package-activity__title">{activity.title}</span>
                    {activity.category && (
                      <span className="package-activity__category">{activity.category}</span>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </section>

      <section className="admin-card" aria-label="Photos">
        <ImageUploader
          label="Photos"
          existing={values.existingImages}
          onRemoveExisting={isEdit ? removeExisting : undefined}
          files={files}
          onFilesChange={setFiles}
          max={MAX_PACKAGE_IMAGES}
        />
      </section>

      <div className="admin-form-actions">
        <Link to={ROUTES.ADMIN_PACKAGES} className="btn btn-outline-secondary">
          Cancel
        </Link>
        <button type="submit" className="btn btn-cta" disabled={submitting}>
          {submitting && (
            <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
          )}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
