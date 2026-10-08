import { Modal } from "react-bootstrap";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import "./ImagePreview.css";

/** Full-screen lightbox for a single image. */
export default function ImagePreview({ image, onClose }) {
  return (
    <Modal
      show={Boolean(image)}
      onHide={onClose}
      centered
      size="xl"
      contentClassName="image-preview"
      aria-label="Image preview"
    >
      <button
        type="button"
        className="btn-close btn-close-white image-preview__close"
        onClick={onClose}
        aria-label="Close"
      />
      {image && (
        <img src={getOptimizedCloudinaryUrl(image, { width: 1600, crop: "limit" })} alt="" />
      )}
    </Modal>
  );
}
