import React from "react";
import HeroCarousel from "../components/HeroCarousel";
import Packages from "../pages/packages";
import About from "../components/About";
import VideoGallery from "../components/VideoGallery";
import FAQ from "../components/FAQ";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Review from "../../../sunshine-activities/models/Review";
const Home = () => (
  <>
    <HeroCarousel />
    <Packages />
    <About />
    <Review />
    <VideoGallery />
    <FAQ />
    <ContactForm />
    <Footer />
  </>
);

export default Home;
