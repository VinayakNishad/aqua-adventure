import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/nerualparadise.webp";
import { SECTION_IDS } from "../../constants/home";
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
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(expanded ? false : true)}
        />
        <Navbar.Collapse id="basic-navbar-nav" className="nav-link-data">
          <Nav className="ms-auto text-center" style={{ gap: "2px" }}>
            <Nav.Link
              className="nav-link-custom"
              onClick={() => handleNavClick(SECTION_IDS.HOME)}
              active={activeLink === SECTION_IDS.HOME}
            >
              Home
            </Nav.Link>
            <Nav.Link
              className="nav-link-custom"
              onClick={() => handleNavClick(SECTION_IDS.PACKAGES)}
              active={activeLink === SECTION_IDS.PACKAGES}
            >
              Packages
            </Nav.Link>
            <Nav.Link
              className="nav-link-custom"
              onClick={() => handleNavClick(SECTION_IDS.ABOUT)}
              active={activeLink === SECTION_IDS.ABOUT}
            >
              About
            </Nav.Link>
            <Nav.Link
              className="nav-link-custom"
              onClick={() => handleNavClick(SECTION_IDS.CHANNEL)}
              active={activeLink === SECTION_IDS.CHANNEL}
            >
              Channel
            </Nav.Link>
            <Nav.Link
              className="nav-link-custom"
              onClick={() => handleNavClick(SECTION_IDS.FAQ)}
              active={activeLink === SECTION_IDS.FAQ}
            >
              FAQ
            </Nav.Link>
            <Nav.Link
              className="nav-link-contact"
              onClick={() => handleNavClick(SECTION_IDS.CONTACT)}
              active={activeLink === SECTION_IDS.CONTACT}
            >
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComp;
