import { useEffect, useMemo, useRef, useState } from "react";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import "./ImageUploader.css";

const ACCEPT = "image/jpeg,image/png,image/webp";

/**
 * Drag-and-drop image picker with previews.
 * - `existing`: already-uploaded image URLs (removable via onRemoveExisting)
 * - `files` / `onFilesChange`: newly picked File objects
 */
export default function ImageUploader({
  existing = [],
  onRemoveExisting,
  files,
  onFilesChange,
  max = 10,
  label = "Photos",
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);
  const remaining = max - existing.length - files.length;

  useEffect(() => () => previews.forEach((url) => URL.revokeObjectURL(url)), [previews]);

  const addFiles = (list) => {
    const picked = Array.from(list).filter((f) => ACCEPT.includes(f.type));
    if (picked.length) onFilesChange([...files, ...picked].slice(0, max - existing.length));
  };

  return (
    <div className="image-uploader">
      <span className="admin-label">
        {label} <small className="text-muted fw-normal">(up to {max})</small>
      </span>

      <div className="image-uploader__grid">
        {existing.map((url) => (
          <figure key={url} className="image-uploader__item">
            <img src={getOptimizedCloudinaryUrl(url, { width: 240, height: 240 })} alt="" />
            {onRemoveExisting && (
              <button type="button" onClick={() => onRemoveExisting(url)} aria-label="Remove photo">
                <i className="bi bi-x" aria-hidden="true" />
              </button>
            )}
          </figure>
        ))}
        {previews.map((src, i) => (
          <figure key={src} className="image-uploader__item is-new">
            <img src={src} alt="" />
            <span className="image-uploader__new">New</span>
            <button
              type="button"
              onClick={() => onFilesChange(files.filter((_, idx) => idx !== i))}
              aria-label="Remove photo"
            >
              <i className="bi bi-x" aria-hidden="true" />
            </button>
          </figure>
        ))}

        {remaining > 0 && (
          <button
            type="button"
            className={`image-uploader__drop ${dragging ? "is-dragging" : ""}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              addFiles(e.dataTransfer.files);
            }}
          >
            <i className="bi bi-cloud-arrow-up" aria-hidden="true" />
            <span>Add photos</span>
            <small>JPG, PNG or WebP</small>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        hidden
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
