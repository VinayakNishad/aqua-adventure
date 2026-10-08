import React from "react";
import HeroCarousel from "../../components/home/HeroCarousel";
import Navbar from "../../components/layout/Navbar";
import Packages from "../../components/packages/PackageList";
import WhatsAppIcon from "../../components/layout/WhatsAppIcon";
import About from "../../components/home/About";
import VideoGallery from "../../components/home/VideoGallery";
import ContactForm from "../../components/home/ContactForm";
import Footer from "../../components/layout/Footer";
import FAQ from "../../components/home/FAQ";
import GoogleReviews from "../../components/home/GoogleReviews";
import BikeDetail from "../../components/home/BikeDetail";

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
