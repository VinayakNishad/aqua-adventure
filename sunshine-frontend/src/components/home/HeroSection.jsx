import Bubbles from "../fx/Bubbles";
import Reveal from "../fx/Reveal";
import WaveDivider from "../fx/WaveDivider";
import useRotatingItem from "../../hooks/useRotatingItem";
import { buildWhatsAppUrl } from "../../utils/whatsapp";
import { LOCATION_LABEL } from "../../constants/contact";
import { REVEAL_STAGGER_MS } from "../../constants/animation";
import {
  HERO_BOOKING_MESSAGE,
  HERO_HIGHLIGHTS,
  HERO_ROTATING_WORDS,
  HERO_WORD_INTERVAL_MS,
  SECTION_IDS,
} from "../../constants/home";
import heroImage from "../../assets/ab5.jpg";
import "./HeroSection.css";

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/** Full-screen photo hero aimed at holiday-makers: clear headline, WhatsApp booking first. */
export default function HeroSection() {
  const word = useRotatingItem(HERO_ROTATING_WORDS, HERO_WORD_INTERVAL_MS);

  return (
    <section id={SECTION_IDS.HOME} className="hero" aria-labelledby="hero-title">
      <div className="hero__media" aria-hidden="true">
        <img src={heroImage} alt="" className="hero__photo" fetchPriority="high" />
        <div className="hero__overlay" />
        <div className="hero__light-rays" />
        <Bubbles />
      </div>

      <div className="hero__content container">
        <Reveal effect="zoom">
          <span className="hero__badge">
            <i className="bi bi-geo-alt-fill" aria-hidden="true" /> {LOCATION_LABEL}
          </span>
        </Reveal>

        <Reveal effect="up" delay={120}>
          <h2 id="hero-title" className="hero__title">
            Dive into{" "}
            <span key={word} className="hero__word">
              {word}
            </span>
          </h2>
        </Reveal>

        <Reveal effect="up" delay={220}>
          <p className="hero__lead">
            Scuba diving, dolphin trips and water sports in Goa. Safe, guided and fun for
            first-timers and families.
          </p>
        </Reveal>

        <Reveal effect="up" delay={320} className="hero__actions">
          <a
            href={buildWhatsAppUrl(HERO_BOOKING_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sunset btn-lg"
          >
            <i className="bi bi-whatsapp" aria-hidden="true" /> Book on WhatsApp
          </a>
          <button
            type="button"
            className="btn btn-glass btn-lg"
            onClick={() => scrollTo(SECTION_IDS.PACKAGES)}
          >
            View packages
          </button>
        </Reveal>

        <ul className="hero__highlights">
          {HERO_HIGHLIGHTS.map((item, i) => (
            <Reveal
              as="li"
              key={item.label}
              effect="up"
              delay={420 + i * REVEAL_STAGGER_MS}
              className="hero__highlight"
            >
              <i className={`bi ${item.icon}`} aria-hidden="true" />
              <span>{item.label}</span>
            </Reveal>
          ))}
        </ul>
      </div>

      <div className="hero__wave">
        <WaveDivider tone="sand" />
      </div>
    </section>
  );
}
