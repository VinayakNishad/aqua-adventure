import { Outlet } from "react-router-dom";
import NavbarComp from "./components/Navbar";
import Footer from "./components/Footer";

const Layout = () => (
  <>
    <NavbarComp />
    <Outlet /> {/* This renders the active page */}
    <Footer />
  </>
);

export default Layout;
