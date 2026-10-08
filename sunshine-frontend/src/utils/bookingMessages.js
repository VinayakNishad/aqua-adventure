import { ROUTES } from "../routes/paths";

const whatsappTo = (enquiry, message) =>
  `https://wa.me/${`${enquiry.countryCode}${enquiry.phone}`.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

export const bookingItemName = (enquiry) =>
  enquiry.packageId?.name ?? enquiry.activityId?.title ?? "your booking";

/** WhatsApp link confirming an approved booking to the customer. */
export const approvalWhatsAppUrl = (enquiry) =>
  whatsappTo(
    enquiry,
    `Hello ${enquiry.name}, your booking for "${bookingItemName(enquiry)}" has been confirmed! We look forward to seeing you.`,
  );

/** WhatsApp link asking the customer to leave a review for the package. */
export const reviewRequestWhatsAppUrl = (enquiry) => {
  const packageId = enquiry.packageId?._id;
  const reviewPath = packageId ? ROUTES.PACKAGE_REVIEW.replace(":id", packageId) : ROUTES.REVIEWS;
  return whatsappTo(
    enquiry,
    `Hi ${enquiry.name}! Hope you enjoyed your ${bookingItemName(enquiry)} trip. We'd love your feedback: ${window.location.origin}${reviewPath}`,
  );
};

export const chatWhatsAppUrl = (enquiry) => whatsappTo(enquiry, `Hi ${enquiry.name},`);

export const telUrl = (enquiry) => `tel:${enquiry.countryCode}${enquiry.phone}`;
