import React from "react";
import "./BikeDetail.css";
import { Phone } from "lucide-react";
import rentimage from "../../assets/rentcar.webp";
import { buildWhatsAppUrl } from "../../utils/whatsapp";

const BikeDetail = () => {
  const message = `Hi, I'm interested in renting a vehicle. Please share more details.`;
  const whatsappUrl = buildWhatsAppUrl(message);

  const handleCall = () => {
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bike-banner">
      <img src={rentimage} alt="Rented Car" className="banner-image" />
      <div className="floating-call-btn" onClick={handleCall}>
        <span className="pulse-ring"></span>
        <Phone size={22} />
      </div>
    </div>
  );
};

export default BikeDetail;
