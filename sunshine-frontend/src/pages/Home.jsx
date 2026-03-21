import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import HeroCarousel from "../components/HeroCarousel";
import Navbar from "../components/Navbar";
import Packages from "./packages";
import WhatsAppIcon from "../components/WhatsaAppIcon";

const About = lazy(() => import("../components/About"));
const VideoGallery = lazy(() => import("../components/VideoGallery"));
const ContactForm = lazy(() => import("../components/ContactForm"));
const Footer = lazy(() => import("../components/Footer"));
const FAQ = lazy(() => import("../components/FAQ"));
const GoogleReviews = lazy(() => import("./googleReview"));
const BikeDetail = lazy(() => import("../components/BikeDetail"));

const DeferredSection = ({ children, minHeight = 120 }) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px 0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} style={{ minHeight: `${minHeight}px` }}>
      {isVisible ? children : null}
    </section>
  );
};

const Home = () => {
  return (
    <div>
      <Navbar />
      <HeroCarousel />
      <Packages />

      <Suspense fallback={null}>
        <DeferredSection minHeight={240}>
          <About />
        </DeferredSection>

        <DeferredSection minHeight={240}>
          <VideoGallery />
        </DeferredSection>

        <DeferredSection minHeight={200}>
          <GoogleReviews />
        </DeferredSection>

        <DeferredSection minHeight={220}>
          <FAQ />
        </DeferredSection>

        <DeferredSection minHeight={260}>
          <ContactForm />
        </DeferredSection>

        <DeferredSection minHeight={220}>
          <BikeDetail />
        </DeferredSection>

        <DeferredSection minHeight={120}>
          <Footer />
        </DeferredSection>
      </Suspense>

      <WhatsAppIcon />
    </div>
  );
};

export default Home;
