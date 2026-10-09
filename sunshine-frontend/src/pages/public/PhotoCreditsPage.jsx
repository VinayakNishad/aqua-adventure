import { Container } from "react-bootstrap";
import Footer from "../../components/layout/Footer";
import Navbar from "../../components/layout/Navbar";
import { PHOTO_CREDITS } from "../../constants/media";
import "./PhotoCreditsPage.css";

/** Attribution for third-party photos, as required by their Creative Commons licences. */
export default function PhotoCreditsPage() {
  return (
    <>
      <Navbar />
      <main className="photo-credits">
        <Container>
          <h1 className="photo-credits__title">Photo credits</h1>
          <p className="text-muted">
            Some photos on this site are by independent photographers on Wikimedia Commons, used
            under the licences below.
          </p>
          <ul className="photo-credits__list">
            {PHOTO_CREDITS.map((credit) => (
              <li key={credit.source}>
                <strong>{credit.subject}</strong>
                <span>
                  by {credit.author} ·{" "}
                  {credit.licenseUrl ? (
                    <a href={credit.licenseUrl} target="_blank" rel="noopener noreferrer license">
                      {credit.license}
                    </a>
                  ) : (
                    credit.license
                  )}{" "}
                  ·{" "}
                  <a href={credit.source} target="_blank" rel="noopener noreferrer">
                    source
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Footer />
    </>
  );
}
