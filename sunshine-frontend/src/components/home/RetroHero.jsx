import Bubbles from "../fx/Bubbles";
import Reveal from "../fx/Reveal";
import useRotatingItem from "../../hooks/useRotatingItem";
import { REVEAL_STAGGER_MS } from "../../constants/animation";
import {
  BANNER_HIGHLIGHTS,
  HERO_ROTATING_WORDS,
  HERO_WORD_INTERVAL_MS,
  SECTION_IDS,
} from "../../constants/home";
import "./RetroHero.css";

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/** Full-screen synthwave hero: striped sun, neon mountains, scrolling grid sea. */
export default function RetroHero() {
  const word = useRotatingItem(HERO_ROTATING_WORDS, HERO_WORD_INTERVAL_MS);

  return (
    <section id={SECTION_IDS.HOME} className="retro-hero" aria-labelledby="retro-hero-title">
      <div className="retro-hero__scene" aria-hidden="true">
        <div className="retro-hero__stars" />
        <div className="retro-hero__sun" />
        <div className="retro-hero__mountains retro-hero__mountains--back" />
        <div className="retro-hero__mountains retro-hero__mountains--front" />
        <div className="retro-hero__horizon" />
        <div className="retro-hero__grid" />
        <Bubbles className="retro-hero__bubbles" />
        <div className="retro-hero__scanlines" />
      </div>

      <div className="retro-hero__content container">
        <Reveal effect="zoom">
          <span className="retro-chip">Goa · Arabian Sea</span>
        </Reveal>

        <Reveal effect="up" delay={120}>
          <h2 id="retro-hero-title" className="retro-hero__title">
            <span className="retro-hero__title-line">Dive into</span>
            <span key={word} className="retro-hero__word text-gradient-sunset" data-text={word}>
              {word}
            </span>
          </h2>
        </Reveal>

        <Reveal effect="up" delay={220}>
          <p className="retro-hero__lead">
            Crystal water, coral reefs and sunset rides. Pick a package and we will handle the rest.
          </p>
        </Reveal>

        <Reveal effect="up" delay={320} className="retro-hero__actions">
          <button
            type="button"
            className="btn btn-sunset btn-lg"
            onClick={() => scrollTo(SECTION_IDS.PACKAGES)}
          >
            Explore packages
          </button>
          <button
            type="button"
            className="btn btn-glass btn-lg"
            onClick={() => scrollTo(SECTION_IDS.CONTACT)}
          >
            Talk to us
          </button>
        </Reveal>

        <ul className="retro-hero__highlights">
          {BANNER_HIGHLIGHTS.map((item, i) => (
            <Reveal
              as="li"
              key={item.label}
              effect="flip"
              delay={420 + i * REVEAL_STAGGER_MS}
              className="glass-tile"
            >
              <i className={`bi ${item.icon}`} aria-hidden="true" />
              <span>{item.label}</span>
            </Reveal>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="retro-hero__scroll-cue"
        onClick={() => scrollTo(SECTION_IDS.PACKAGES)}
        aria-label="Scroll to packages"
      >
        <span />
      </button>
    </section>
  );
}
