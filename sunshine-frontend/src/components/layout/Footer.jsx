import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/nerualparadise.webp";
import "./Footer.css";
import {
  EMAIL,
  EMAIL_DISPLAY,
  LOCATION_LABEL,
  PHONE_DISPLAY,
  PHONE_NUMBER,
  SOCIAL_LINKS,
} from "../../constants/contact";
import { buildWhatsAppUrl } from "../../utils/whatsapp";
import {
  EmailIcon,
  FacebookIcon,
  FooterWhatsAppIcon,
  InstagramIcon,
  LocationIcon,
  PhoneIcon,
  YoutubeIcon,
} from "../icons";
// --- Self-Contained SVG Icons ---

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollLink = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  return (
    <>
      <footer className="footer-section" id="contact">
        <div className="footer-container">
          <div className="footer-about">
            <img
              src={logo}
              alt="Paradise Watersports Logo"
              style={{ width: "150px", marginBottom: "1rem" }}
            />
            <p>
              Your premier destination for unforgettable aquatic adventures in Goa. We are committed
              to providing safe, thrilling, and memorable experiences for everyone.
            </p>
          </div>
          <div className="footer-links">
            <h5>Quick Links</h5>
            <ul>
              <li>
                <a href="#packages" onClick={(e) => handleScrollLink(e, "packages")}>
                  Packages
                </a>
              </li>
              <li>
                <a href="#reviews" onClick={(e) => handleScrollLink(e, "reviews")}>
                  Reviews
                </a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleScrollLink(e, "about")}>
                  About Us
                </a>
              </li>
              <li>
                <a href="#faq" onClick={(e) => handleScrollLink(e, "faq")}>
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-contact">
            <h5>Contact Us</h5>
            <ul>
              <li>
                <a
                  href="https://share.google/XchyGu41ekfSAZpmw"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LocationIcon /> {LOCATION_LABEL}
                </a>
              </li>
              <li>
                <a href={`tel:+${PHONE_NUMBER}`}>
                  <PhoneIcon /> {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                  <FooterWhatsAppIcon /> WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`}>
                  <EmailIcon /> {EMAIL_DISPLAY}
                </a>
              </li>
            </ul>
          </div>
          <div className="footer-social">
            <h5>Follow Us</h5>
            <div className="footer-social-links">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a
                href={SOCIAL_LINKS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <YoutubeIcon />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-container">
          <div className="footer-bottom">
            <p>© 2025 Paradise Scuba Goa. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
