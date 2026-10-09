import { useState } from "react";
import { packageEnquiryMessage } from "../../constants/messages";
import { getErrorMessage } from "../../services/apiClient";
import { createEnquiry } from "../../services/enquiryService";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import { formatPrice } from "../../utils/format";
import { buildWhatsAppUrl } from "../../utils/whatsapp";
import "./BookingForm.css";

const COUNTRY_CODE = "+91";
const INDIAN_MOBILE = /^[6-9]\d{9}$/;

const validate = ({ name, phone }) => {
  const errors = {};
  if (name.trim().length < 2) errors.name = "Please enter your name.";
  if (!INDIAN_MOBILE.test(phone)) errors.phone = "Enter a valid 10-digit mobile number.";
  return errors;
};

/** Booking enquiry form for one package; shows a confirmation screen when sent. */
export default function BookingForm({ pkg, onClose }) {
  const [values, setValues] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | sent
  const [submitError, setSubmitError] = useState("");

  const cover = pkg.images?.[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const next = name === "phone" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setValues((v) => ({ ...v, [name]: next }));
    if (errors[name]) setErrors((errs) => ({ ...errs, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("submitting");
    setSubmitError("");
    try {
      await createEnquiry({
        packageId: pkg._id,
        name: values.name.trim(),
        countryCode: COUNTRY_CODE,
        phone: values.phone,
      });
      setStatus("sent");
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Could not send your request. Please try again."));
      setStatus("idle");
    }
  };

  return (
    <div className="booking-form">
      <header className="booking-form__head">
        {cover && (
          <img
            src={getOptimizedCloudinaryUrl(cover, { width: 160, height: 160, crop: "fill" })}
            alt=""
            className="booking-form__thumb"
          />
        )}
        <div className="booking-form__heading">
          <span className="booking-form__eyebrow">Book your trip</span>
          <h2 className="booking-form__title">{pkg.name}</h2>
          {typeof pkg.price === "number" && (
            <span className="booking-form__price">
              {formatPrice(pkg.price)} <small>per person</small>
            </span>
          )}
        </div>
        <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
      </header>

      {status === "sent" ? (
        <div className="booking-form__done" role="status">
          <span className="booking-form__done-icon">
            <i className="bi bi-check-lg" aria-hidden="true" />
          </span>
          <h3>Request sent!</h3>
          <p>
            Thanks, {values.name.trim().split(" ")[0]}. We&rsquo;ll contact you on{" "}
            <strong>
              {COUNTRY_CODE} {values.phone}
            </strong>{" "}
            shortly to confirm your booking.
          </p>
          <button type="button" className="btn btn-cta w-100" onClick={onClose}>
            Done
          </button>
        </div>
      ) : (
        <form className="booking-form__body" onSubmit={handleSubmit} noValidate>
          <div className="booking-field">
            <label htmlFor="booking-name">Your name</label>
            <div className={`booking-field__control ${errors.name ? "has-error" : ""}`}>
              <i className="bi bi-person" aria-hidden="true" />
              <input
                id="booking-name"
                name="name"
                autoComplete="name"
                placeholder="e.g. Priya Sharma"
                value={values.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "booking-name-error" : undefined}
              />
            </div>
            {errors.name && (
              <span id="booking-name-error" className="booking-field__error">
                {errors.name}
              </span>
            )}
          </div>

          <div className="booking-field">
            <label htmlFor="booking-phone">Mobile number</label>
            <div className={`booking-field__control ${errors.phone ? "has-error" : ""}`}>
              <span className="booking-field__prefix">{COUNTRY_CODE}</span>
              <input
                id="booking-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10-digit number"
                value={values.phone}
                onChange={handleChange}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "booking-phone-error" : "booking-phone-hint"}
              />
            </div>
            {errors.phone ? (
              <span id="booking-phone-error" className="booking-field__error">
                {errors.phone}
              </span>
            ) : (
              <span id="booking-phone-hint" className="booking-field__hint">
                We&rsquo;ll call or WhatsApp you to confirm. No payment now.
              </span>
            )}
          </div>

          {submitError && (
            <div className="alert alert-danger py-2 small" role="alert">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-cta btn-lg w-100"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
                Sending…
              </>
            ) : (
              "Request booking"
            )}
          </button>

          <div className="booking-form__or">
            <span>or</span>
          </div>

          <a
            href={buildWhatsAppUrl(packageEnquiryMessage(pkg))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-whatsapp w-100"
          >
            <i className="bi bi-whatsapp me-2" aria-hidden="true" />
            Chat with us on WhatsApp
          </a>
        </form>
      )}
    </div>
  );
}
