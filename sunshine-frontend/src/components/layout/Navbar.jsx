import React, { useState } from "react";
import { Container, Nav, Navbar, Offcanvas } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/nerualparadise.webp";
import { NAV_LINKS, SECTION_IDS } from "../../constants/home";
import useScrolled from "../../hooks/useScrolled";
import "./Navbar.css";

const NavbarComp = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeLink, setActiveLink] = useState(SECTION_IDS.HOME);
  const location = useLocation();
  const navigate = useNavigate();
  const scrolled = useScrolled();

  const handleNavClick = (link, path = "/") => {
    setActiveLink(link);
    setExpanded(false);

    // If we are not on home, navigate to home first
    if (location.pathname !== "/") {
      navigate(path, { replace: true });
      // Optional: scroll after navigation
      setTimeout(() => {
        const section = document.getElementById(link);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      // If already on home, just scroll
      const section = document.getElementById(link);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Navbar
      variant="light"
      expand="lg"
      sticky="top"
      transition="true"
      expanded={expanded}
      className={`site-navbar ${scrolled ? "site-navbar--scrolled" : ""}`}
      style={{ zIndex: 2000 }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            alt="Nerul Paradise Logo"

            style={{ maxHeight: "50px", width: "auto" }}
            className="d-inline-block align-middle"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="site-nav-drawer" onClick={() => setExpanded(true)} />
        <Navbar.Offcanvas
          id="site-nav-drawer"
          placement="end"
          aria-labelledby="site-nav-drawer-title"
          className="site-drawer"
          backdropClassName="site-drawer-backdrop"
          onHide={() => setExpanded(false)}
        >
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title id="site-nav-drawer-title">
              <img src={logo} alt="Paradise Scuba Goa" className="site-drawer__logo" />
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="ms-auto align-items-lg-center site-nav">
              {NAV_LINKS.map((link, i) => (
                <Nav.Link
                  key={link.id}
                  className={link.cta ? "nav-link-contact" : "nav-link-custom"}
                  onClick={() => handleNavClick(link.id)}
                  active={activeLink === link.id}
                  style={{ "--item-index": i }}
                >
                  <i className={`bi ${link.icon} site-nav__icon`} aria-hidden="true" />
                  {link.label}
                </Nav.Link>
              ))}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default NavbarComp;
