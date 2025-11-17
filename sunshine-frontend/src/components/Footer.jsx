import React from "react";
import { TextWrap } from "react-bootstrap-icons";
import { useLocation, useNavigate } from "react-router-dom";
import logo from '../assets/nerualparadise.png';
// --- Self-Contained SVG Icons ---
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const YoutubeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" /></svg>;

const PhoneIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16"  // Set a base size
        height="50" // Set a base size
        fill="currentColor" 
        viewBox="0 0 24 24" // ✅ FIX: Changed viewBox from 24x24 to 16x16
    >
        {/* This is the complex path data you provided */}
        <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.28 1.465l-.349 1.32c-.12.45-.378.82-.79 1.148l-1.654 1.654a1.745 1.745 0 0 1-2.222.115A19.042 19.042 0 0 1 .51 1.885a1.745 1.745 0 0 1 .116-2.222l1.654-1.654c.328-.313.7-.568 1.148-.79l1.32-.349c.49-.165 1.042-.048 1.465.28l2.257 2.256a1.745 1.745 0 0 1 .163 2.612l-1.794 2.307a.678.678 0 0 0 .122.58l.441.442a13.333 13.333 0 0 0 6.138 6.138l.441.442a.678.678 0 0 0 .58.122l2.307-1.794a1.745 1.745 0 0 1 2.612.163l2.257 2.257c.328.423.445.974.28 1.465l-.349 1.32c-.12.45-.378.82-.79 1.148l-1.654 1.654a1.745 1.745 0 0 1-2.222.115A19.043 19.043 0 0 1 .51 1.885z" />
    </svg>
);

const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z" /></svg>;
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.42 1.32 4.89l-1.46 5.38 5.51-1.44c1.41.83 3.01 1.32 4.7 1.32h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zM17.47 14.38c-.19-.1-.93-.46-1.08-.51s-.26-.08-.37.08c-.11.16-.41.51-.5.61s-.19.11-.34.04c-.16-.08-.68-.25-1.29-.8s-.94-.96-1.05-1.12c-.11-.16-.01-.25.08-.32.08-.08.16-.19.25-.26.08-.08.11-.13.19-.22s.08-.16 0-.31c-.08-.16-.37-.88-.51-1.21s-.28-.28-.37-.28h-.34c-.11 0-.28.04-.42.22s-.53.51-.53 1.24.53 1.44.61 1.55c.08.11 1.05 1.68 2.56 2.26.37.14.65.22.88.28.31.08.59.07.81-.04.25-.11.93-.38 1.05-.75s.13-.69.08-.75c-.04-.05-.16-.08-.34-.18z" />
  </svg>
);
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
            <style>{`
                .footer-section {
                    background-color: #212529;
                    color: #adb5bd;
                    padding: 4rem 1rem;
                    font-family: 'Poppins', sans-serif;
                }
                .footer-container {
                    max-width: 1140px;
                    margin: auto;
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    text-align: center;
                }
                @media (min-width: 768px) {
                    .footer-container {
                        grid-template-columns: repeat(2, 1fr);
                        text-align: left;
                    }
                }
                @media (min-width: 992px) {
                    .footer-container {
                        grid-template-columns: 2fr 1fr 1fr 1fr;
                    }
                }
                .footer-about h5, .footer-links h5, .footer-contact h5, .footer-social h5 {
                    color: #fff;
                    font-weight: 600;
                    margin-bottom: 1.5rem;
                }
                .footer-about p {
                    font-size: 0.9rem;
                    line-height: 1.8;
                }
                .footer-links ul, .footer-contact ul {
                    list-style: none;
                    padding: 0;
                }
                .footer-links li, .footer-contact li {
                    margin-bottom: 0.75rem;
                }
                .footer-links a, .footer-contact a {
                    color: #adb5bd;
                    text-decoration: none;
                    transition: color 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .footer-links a:hover, .footer-contact a:hover {
                    color: #0d6efd;
                }
                .footer-social-links {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                }
                @media (min-width: 768px) {
                    .footer-social-links {
                        justify-content: flex-start;
                    }
                }
                .footer-social-links a {
                    color: #adb5bd;
                    font-size: 1.5rem;
                    transition: color 0.3s ease, transform 0.3s ease;
                }
                .footer-social-links a:hover {
                    color: #0d6efd;
                    transform: translateY(-3px);
                }
                .footer-bottom {
                    border-top: 1px solid #495057;
                    padding-top: 1.5rem;
                    margin-top: 2rem;
                    text-align: center;
                    font-size: 0.9rem;
                }
            `}</style>
            <footer className="footer-section" id="contact">
                <div className="footer-container">
                    <div className="footer-about">
                        <img src={logo} alt="Paradise Watersports Logo" style={{ width: '150px', marginBottom: '1rem' }} />
                        <p>Your premier destination for unforgettable aquatic adventures in Goa. We are committed to providing safe, thrilling, and memorable experiences for everyone.</p>
                    </div>
                    <div className="footer-links">
                        <h5>Quick Links</h5>
                        <ul>
                            <li><a href="#packages" onClick={(e) => handleScrollLink(e, 'packages')}>Packages</a></li>
                            <li><a href="#reviews" onClick={(e) => handleScrollLink(e, 'reviews')}>Reviews</a></li>
                            <li><a href="#about" onClick={(e) => handleScrollLink(e, 'about')}>About Us</a></li>
                            <li><a href="#faq" onClick={(e) => handleScrollLink(e, 'faq')}>FAQ</a></li>
                        </ul>
                    </div>
                    <div className="footer-contact">
                        <h5>Contact Us</h5>
                        <ul>
                            <li><a href="https://share.google/XchyGu41ekfSAZpmw" target="_blank" rel="noopener noreferrer"><LocationIcon /> Jetty Nerul, Goa</a></li>
                           <li><a href="tel:+919763703724"><PhoneIcon /> +91 9763703724</a></li>
                           <li><a href="https://wa.me/919763703724" target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> WhatsApp</a></li>
                            <li ><a href="mailto:paradisewatersportsandscuba@gmail.com" ><EmailIcon /> paradisescubagoa@gmail.com</a></li>
                        </ul>
                    </div>
                    <div className="footer-social">
                        <h5>Follow Us</h5>
                        <div className="footer-social-links">
                            <a href="https://www.instagram.com/paradisescubagoa2025?igsh=eWJ6MzcxajRyNHI0" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><InstagramIcon /></a>
                            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FacebookIcon /></a>
                            <a href="https://youtube.com/@paradisewatersportsandscuba?si=R_Ee9BGATpFJumuZ" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><YoutubeIcon /></a>
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

