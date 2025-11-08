import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppIcon.css'; // We will create this file next for styling

const WhatsAppIcon = () => {
  const whatsappNumber = "+919763703724";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`;

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

export default WhatsAppIcon;