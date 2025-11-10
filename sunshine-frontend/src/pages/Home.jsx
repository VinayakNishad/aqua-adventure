import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import HeroCarousel from "../components/HeroCarousel";
import Navbar from "../components/Navbar";
import Packages from "./packages";
import About from "../components/About";
import VideoGallery from "../components/VideoGallery";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import WhatsAppIcon from "../components/WhatsaAppIcon";
import GoogleReviews from "./googleReview";
import BikeDetail from "../components/BikeDetail";
const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroCarousel />
      <Packages />
      <About />
      <VideoGallery />
      <GoogleReviews />
      <FAQ />
      <ContactForm />
      <BikeDetail/>
      <Footer />
      <WhatsAppIcon />
    </div>
  );
};

export default Home;
