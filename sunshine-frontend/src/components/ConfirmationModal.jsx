// ConfirmationModal.jsx
import React from "react";

const ConfirmationModal = ({ onConfirm, onCancel, isDeleting }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h5>Confirm Delete</h5>
        <p>Are you sure you want to delete this ad?</p>
        <div className="modal-actions">
          <button
            onClick={onCancel}
            className="modal-button cancel"
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="modal-button confirm"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;