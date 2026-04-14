import React from "react";
import HeroCarousel from "../components/HeroCarousel";
import Navbar from "../components/Navbar";
import Packages from "./packages";
import WhatsAppIcon from "../components/WhatsaAppIcon";
import About from "../components/About";
import VideoGallery from "../components/VideoGallery";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import GoogleReviews from "./googleReview";
import BikeDetail from "../components/BikeDetail";

const Home = () => {
  return (
    <div>
      <h1 className="visually-hidden">Scuba Diving in Goa with Paradise Scuba Goa</h1>
      <Navbar />
      <HeroCarousel />
      <Packages />

      <About />
      <VideoGallery />
      <GoogleReviews />
      <FAQ />
      <ContactForm />
      <BikeDetail />
      <Footer />

      <WhatsAppIcon />
    </div>
  );
};

export default Home;
