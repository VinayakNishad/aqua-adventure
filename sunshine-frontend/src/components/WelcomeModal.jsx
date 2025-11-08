import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const WelcomeModal = () => {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  // State to hold validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setShow(true); // Show immediately on mount

    const interval = setInterval(() => {
      setShow(true);
    }, 60000); // Re-show every 60 seconds

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => setShow(false);

  // Function to validate form data
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters long.";
    }

    // Phone validation (for a 10-digit Indian number)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear the error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the form before submitting
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Stop submission if there are errors
    }

    // If validation passes, proceed
    const phoneNumber = "9763703724";
    const message = `Hello, I'm ${formData.name} (${formData.phone}). I'm interested in your water sports activities!`;
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");

    // Reset form, clear errors, and close modal
    setFormData({ name: "", phone: "" });
    setErrors({});
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      keyboard={false}
      dialogClassName="welcome-modal"
      contentClassName="border-0 rounded-4 shadow"
    >
      <Modal.Header closeButton className="border-0 pb-0" />
      <Modal.Body className="p-3 p-sm-4 text-center">
        <h5 className="fw-bold mb-3 fs-3">
          Welcome to Our Paradise Scuba Adventure!
        </h5>
        <p className="text-muted medium mb-4">
          Fill in your details below and our team will reach out to you with
          exciting offers.
        </p>

        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
              className="py-2 border-1"
              isInvalid={!!errors.name}
            />
            {/* Display error message */}
            <Form.Control.Feedback type="invalid" className="text-start">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="py-2 border-1"
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid" className="text-start">
              {errors.phone}
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 py-2 fw-semibold"
          >
            Chat on WhatsApp
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default WelcomeModal;