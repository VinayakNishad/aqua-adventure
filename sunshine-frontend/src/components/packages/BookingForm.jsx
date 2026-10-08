import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { createEnquiry } from "../../services/enquiryService";
import "./BookingForm.css";

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

      await createEnquiry(payload);
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
              <label htmlFor="nameInput" className="form-label">
                Name
              </label>
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
              <label htmlFor="phoneInput" className="form-label">
                Phone Number
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control country-code-fixed"
                  value="+91"
                  disabled
                  style={{
                    maxWidth: "80px",
                    borderRadius: "8px 0 0 8px",
                    backgroundColor: "#e9ecef",
                    color: "#6c757d",
                    textAlign: "center",
                  }}
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
