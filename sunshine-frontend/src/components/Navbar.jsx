import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/nerualparadise.png";
import "./Navbar.css";

const NavbarComp = () => {
  const [expanded, setExpanded] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const location = useLocation();
  const navigate = useNavigate();

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
      bg="white blur-effect"
      variant="light"
      expand="lg"
      sticky="top"
      transition="true"
      expanded={expanded}
      className="shadow-lg"
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
              onClick={() => handleNavClick("carousal")}
              active={activeLink === "carousal"}
            >
              Home
            </Nav.Link>
            <Nav.Link
              className="nav-link-custom"
              onClick={() => handleNavClick("packages")}
              active={activeLink === "packages"}
            >
              Packages
            </Nav.Link>
            <Nav.Link
              className="nav-link-custom"
              onClick={() => handleNavClick("about")}
              active={activeLink === "about"}
            >
              About
            </Nav.Link>
            <Nav.Link
              className="nav-link-custom"
              onClick={() => handleNavClick("channel")}
              active={activeLink === "channel"}
            >
              Channel
            </Nav.Link>
            <Nav.Link
              className="nav-link-custom"
              onClick={() => handleNavClick("faq")}
              active={activeLink === "faq"}
            >
              FAQ
            </Nav.Link>
            <Nav.Link
              className="nav-link-contact"
              onClick={() => handleNavClick("contact")}
              active={activeLink === "contact"}
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
