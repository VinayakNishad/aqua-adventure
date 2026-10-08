import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import "./WhatsAppButton.css";
import { buildWhatsAppUrl } from "../../utils/whatsapp";

const WhatsAppButton = () => {
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <a
      href={whatsappUrl}
      className="whatsapp_float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="whatsapp-icon" />
    </a>
  );
};

export default WhatsAppButton;
