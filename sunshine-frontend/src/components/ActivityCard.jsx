import React from "react";
import "./ActivityCard.css"; // Make sure this CSS file exists


// SVG Icons for Admin controls
const UpdateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16" style={{ color: '#007bff' }}>
        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
    </svg>
);

const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16" style={{ color: '#dc3545' }}>
        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5zM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 0 0-.998.06zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528zM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5z"/>
    </svg>
);

const ActivityCard = ({ activity, isAdmin, onUpdate, onDelete }) => {
  // Destructure properties from the activity object
  const { title, description, images, _id } = activity;

  // Use the URL of the first image, or a placeholder
  const imageUrl = images && images.length > 0 ? images[0].url : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="card-wrapper position-relative" data-aos="zoom-in">
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
          src={imageUrl}
          className="card-img-top"
          alt={title}
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