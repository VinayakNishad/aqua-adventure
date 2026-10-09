import { PHONE_NUMBER } from "../constants/contact";

/** Builds a wa.me link to the business number, optionally with a pre-filled message. */
export const buildWhatsAppUrl = (message) =>
  message
    ? `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${PHONE_NUMBER}`;
