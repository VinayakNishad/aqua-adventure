import { useState } from "react";
import ImageUploader from "./ImageUploader";
import { MAX_ACTIVITY_IMAGES } from "../../constants/admin";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import "./ActivityForm.css";

const EMPTY = { title: "", shortDescription: "", description: "", duration: "", category: "" };
const SHORT_MAX = 160;

const validate = (values, files, isEdit) => {
  const errors = {};
  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.shortDescription.trim()) errors.shortDescription = "Short description is required.";
  else if (values.shortDescription.length > SHORT_MAX)
    errors.shortDescription = `Keep it under ${SHORT_MAX} characters.`;
  if (!values.description.trim()) errors.description = "Description is required.";
  if (!values.category.trim()) errors.category = "Category is required.";
  if (!isEdit && files.length === 0) errors.images = "Add at least one photo.";
  return errors;
};

/**
 * Shared create/edit form for activities. Calls `onSubmit(formData)` with multipart data.
 * On edit, `existingImages` are shown read-only: uploading new photos replaces them all.
 */
export default function ActivityForm({
  initialValues,
  existingImages = [],
  submitLabel = "Save",
  onSubmit,
  onCancel,
}) {
  const isEdit = Boolean(initialValues);
  const [values, setValues] = useState(() => ({ ...EMPTY, ...pickFields(initialValues) }));
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleFiles = (next) => {
    setFiles(next);
    if (errors.images) setErrors((prev) => ({ ...prev, images: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values, files, isEdit);
    setErrors(found);
    if (Object.keys(found).length) return;

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => formData.append(key, value.trim()));
    files.forEach((file) => formData.append("images", file));

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, { as = "input", rows, hint, placeholder, full } = {}) => {
    const id = `activity-${name}`;
    const Tag = as;
    const errorId = `${id}-error`;
    return (
      <div className={`admin-field${full ? " is-full" : ""}`}>
        <label htmlFor={id}>{label}</label>
        <Tag
          id={id}
          name={name}
          type={as === "input" ? "text" : undefined}
          rows={rows}
          className={`form-control${errors[name] ? " is-invalid" : ""}`}
          value={values[name]}
          onChange={handleChange}
          placeholder={placeholder}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? errorId : undefined}
        />
        {errors[name] ? (
          <div id={errorId} className="invalid-feedback d-block">
            {errors[name]}
          </div>
        ) : (
          hint && <div className="admin-field__hint">{hint}</div>
        )}
      </div>
    );
  };

  return (
    <form className="activity-form" onSubmit={handleSubmit} noValidate>
      <section className="admin-card">
        <h2 className="admin-card__title">Details</h2>
        <div className="admin-form">
          {field("title", "Title", { full: true, placeholder: "e.g. Parasailing" })}
          {field("category", "Category", { placeholder: "e.g. Water sports" })}
          {field("duration", "Duration", { placeholder: "e.g. 15 minutes" })}
          {field("shortDescription", "Short description", {
            full: true,
            hint: `Shown on cards. Max ${SHORT_MAX} characters.`,
          })}
          {field("description", "Full description", { as: "textarea", rows: 5, full: true })}
        </div>
      </section>

      <section className="admin-card">
        <h2 className="admin-card__title">Photos</h2>
        {isEdit && existingImages.length > 0 && (
          <div className="activity-form__current">
            <span className="admin-label">Current photos</span>
            <ul className="activity-form__thumbs">
              {existingImages.map((img, i) => (
                <li key={img.public_id || img.url || i}>
                  <img
                    src={getOptimizedCloudinaryUrl(img.url, {
                      width: 200,
                      height: 150,
                      crop: "fill",
                    })}
                    alt={`Current photo ${i + 1}`}
                    loading="lazy"
                  />
                </li>
              ))}
            </ul>
            <p className="admin-field__hint">
              <i className="bi bi-info-circle" aria-hidden="true" /> Uploading new photos replaces
              these. Leave empty to keep them.
            </p>
          </div>
        )}
        <ImageUploader
          files={files}
          onFilesChange={handleFiles}
          max={MAX_ACTIVITY_IMAGES}
          label={isEdit ? "New photos" : "Photos"}
        />
        {errors.images && (
          <div className="invalid-feedback d-block" role="alert">
            {errors.images}
          </div>
        )}
      </section>

      <div className="admin-form-actions">
        {onCancel && (
          <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-cta" disabled={submitting}>
          {submitting && (
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
          )}
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

function pickFields(source) {
  if (!source) return {};
  return Object.fromEntries(Object.keys(EMPTY).map((key) => [key, source[key] ?? ""]));
}
