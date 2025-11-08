import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const API = process.env.REACT_APP_API_URL;

const BookingForm = ({ activityId, packageId, title, onClose }) => {
  const [enquiry, setEnquiry] = useState({ name: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    if (!enquiry.name || enquiry.name.trim().length < 5) {
      toast.error("Name must be at least 5 characters long.");
      return false;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(enquiry.phone)) {
      toast.error("Enter a valid phone number (10 digits).");
      return false;
    }

    return true;
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: enquiry.name,
        countryCode: "+91", // fixed country code
        phone: enquiry.phone,
        ...(activityId ? { activityId } : { packageId }),
      };

      await axios.post(`${API}/enquiries`, payload);
      toast.success("Enquiry sent successfully! We'll contact you soon.");
      setEnquiry({ name: "", phone: "" });

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error sending enquiry", err);
      toast.error("Failed to send enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
        .booking-form-wrapper { font-family: 'Poppins', sans-serif; padding: 0.5rem }
        .form-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e9ecef; padding-bottom: 1rem; margin-bottom: 1.5rem;  }
        .form-header-title { font-size: 1.25rem; font-weight: 600; color: #333; margin: 0; width: 90%; }
        .form-close-btn { background: none; border: none; font-size: 2rem; cursor: pointer; color: #6c757d; margin-start: -0.5rem; }
        .form-group { margin-bottom: 1rem; }
        .form-label { font-weight: 500; margin-bottom: 0.5rem; display: block; }
        .form-control { width: 100%; padding: 0.8rem 1rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
        .input-group { display: flex; gap: 0.5rem; }
       
        .phone-input { border-radius: 0 8px 8px 0; }
        .form-footer { display: flex; justify-content: space-between; padding-top: 1.5rem; border-top: 1px solid #e9ecef; margin-top: 1.5rem; gap: 12px; flex-direction: row; }
        .btn { padding: 0.75rem 1rem; border-radius: 8px; font-weight: 500; cursor: pointer; border: none; width: 100%; font-size: 1rem; align-items: center; display: inline-flex; justify-content: center; }
        .btn-secondary { color: #007bff; text-wrap: nowrap; border: 1px solid #007bff; background-color: white; }
        .btn-secondary:hover { background-color: #007bff; color: white; }
        .btn-primary { background-color: #007bff; color: white; text-wrap: nowrap; }
        .btn-primary:hover { background-color: #0056b3; }
        .btn:disabled { background-color: #adb5bd; cursor: not-allowed; }
      `}</style>

      <div className="booking-form-wrapper">
        <form onSubmit={handleEnquirySubmit}>
          <div className="form-header">
            <h5 className="form-header-title">{title}</h5>
            <button type="button" className="form-close-btn" onClick={onClose}>
              &times;
            </button>
          </div>

          <div className="form-body">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="nameInput" className="form-label">Name</label>
              <input
                id="nameInput"
                type="text"
                className="form-control"
                value={enquiry.name}
                onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })}
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phoneInput" className="form-label">Phone Number</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control country-code-fixed"
                  value="+91"
                  disabled
                  style={{ maxWidth: "80px", borderRadius: "8px 0 0 8px", backgroundColor: "#e9ecef", color: "#6c757d", textAlign: "center" }}
                />
                <input
                  id="phoneInput"
                  type="tel"
                  className="form-control phone-input"
                  value={enquiry.phone}
                  onChange={(e) => setEnquiry({ ...enquiry, phone: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="form-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Sending..." : "Send Enquiry"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default BookingForm;
