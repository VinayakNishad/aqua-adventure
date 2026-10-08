import Reveal from "../../components/fx/Reveal";
import ScrollProgress from "../../components/fx/ScrollProgress";
import WaveDivider from "../../components/fx/WaveDivider";
import About from "../../components/home/About";
import BikeDetail from "../../components/home/BikeDetail";
import ContactForm from "../../components/home/ContactForm";
import FAQ from "../../components/home/FAQ";
import GoogleReviews from "../../components/home/GoogleReviews";
import HeroCarousel from "../../components/home/HeroCarousel";
import RetroHero from "../../components/home/RetroHero";
import VideoGallery from "../../components/home/VideoGallery";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import WhatsAppButton from "../../components/layout/WhatsAppButton";
import PackageList from "../../components/packages/PackageList";
import useTilt3D from "../../hooks/useTilt3D";
import "./HomePage.css";

export default function HomePage() {
  useTilt3D();

  return (
    <div className="home-page">
      <ScrollProgress />
      <h1 className="visually-hidden">Scuba Diving in Goa with Paradise Scuba Goa</h1>
      <Navbar />

      <main>
        <RetroHero />
        <WaveDivider tone="dark" flip />

        <PackageList />
        <Reveal effect="zoom">
          <HeroCarousel />
        </Reveal>

        <Reveal effect="up">
          <About />
        </Reveal>
        <Reveal effect="zoom">
          <VideoGallery />
        </Reveal>

        <div className="home-page__ocean-band">
          <WaveDivider tone="light" />
          <Reveal effect="up">
            <GoogleReviews />
          </Reveal>
        </div>

        <Reveal effect="left">
          <FAQ />
        </Reveal>
        <Reveal effect="right">
          <ContactForm />
        </Reveal>
        <Reveal effect="flip">
          <BikeDetail />
        </Reveal>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
