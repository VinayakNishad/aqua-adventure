import React from "react";
import "./ActivityCard.css"; // Make sure this CSS file exists
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import { DeleteIcon, UpdateIcon } from "../icons";

// SVG Icons for Admin controls

const ActivityCard = ({ activity, isAdmin, onUpdate, onDelete }) => {
  // Destructure properties from the activity object
  const { title, description, images, _id } = activity;

  // Use the URL of the first image, or a placeholder
  const imageUrl =
    images && images.length > 0
      ? images[0].url
      : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="card-wrapper position-relative">
      <div className="card shadow-sm h-100" style={{ width: "18rem", borderRadius: "12px" }}>
        {isAdmin && (
          <div className="admin-icons">
            <button onClick={() => onUpdate(_id)} className="icon-btn">
              <UpdateIcon />
            </button>
            <button onClick={() => onDelete(_id)} className="icon-btn">
              <DeleteIcon />
            </button>
          </div>
        )}

        <img
          src={getOptimizedCloudinaryUrl(imageUrl, {
            width: 720,
            height: 480,
            crop: "fill",
          })}
          className="card-img-top"
          alt={title}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{
            height: "180px",
            objectFit: "cover",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
          }}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{title}</h5>
          <p className="card-text flex-grow-1" style={{ fontSize: "0.9rem", color: "#6c757d" }}>
            {description?.substring(0, 80) + (description?.length > 80 ? "..." : "")}
          </p>
          <div className="mt-auto">
            <a href={`/activity/${_id}`} className="btn btn-primary w-100">
              Dive In!
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
