import { Accordion } from "react-bootstrap";
import faqData from "../../data/FAQDetails.json";
import {
  BOOKING_POLICIES,
  MAP_EMBED_URL,
  PICKUP_LOCATIONS,
  SAFETY_TIPS,
  WHAT_TO_BRING,
  googleMapsSearchUrl,
} from "../../constants/packageInfo";
import "./PackageInfoAccordion.css";

const CheckList = ({ items, icon }) => (
  <ul className="info-checklist">
    {items.map((item) => (
      <li key={item}>
        <i className={`bi ${icon}`} aria-hidden="true" />
        {item}
      </li>
    ))}
  </ul>
);

/** All the "good to know" details, collapsed by default so the page stays short. */
export default function PackageInfoAccordion() {
  return (
    <section className="detail-section" aria-labelledby="good-to-know-title">
      <h2 id="good-to-know-title" className="detail-section__title">
        Good to know
      </h2>
      <Accordion className="info-accordion" alwaysOpen>
        <Accordion.Item eventKey="bring">
          <Accordion.Header>
            <i className="bi bi-bag-check" aria-hidden="true" /> What to bring
          </Accordion.Header>
          <Accordion.Body>
            <CheckList items={WHAT_TO_BRING} icon="bi-check-circle-fill text-success" />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="safety">
          <Accordion.Header>
            <i className="bi bi-shield-exclamation" aria-hidden="true" /> Safety tips
          </Accordion.Header>
          <Accordion.Body>
            <CheckList items={SAFETY_TIPS} icon="bi-exclamation-circle-fill text-warning" />
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="pickup">
          <Accordion.Header>
            <i className="bi bi-geo-alt" aria-hidden="true" /> Pickup points &amp; map
          </Accordion.Header>
          <Accordion.Body>
            <p className="small text-muted mb-2">Available for selected packages.</p>
            <ul className="pickup-list">
              {PICKUP_LOCATIONS.map((location) => (
                <li key={location.name}>
                  <span className="pickup-list__type">{location.type}</span>
                  <a href={googleMapsSearchUrl(location)} target="_blank" rel="noopener noreferrer">
                    {location.name} <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="ratio ratio-16x9 mt-3 rounded overflow-hidden">
              <iframe
                src={MAP_EMBED_URL}
                title="Paradise Watersports location"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="policy">
          <Accordion.Header>
            <i className="bi bi-file-earmark-text" aria-hidden="true" /> Booking &amp; policies
          </Accordion.Header>
          <Accordion.Body>
            <dl className="policy-list">
              {BOOKING_POLICIES.map((policy) => (
                <div key={policy.title}>
                  <dt>{policy.title}</dt>
                  <dd>{policy.text}</dd>
                </div>
              ))}
            </dl>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="faq">
          <Accordion.Header>
            <i className="bi bi-question-circle" aria-hidden="true" /> FAQs
          </Accordion.Header>
          <Accordion.Body>
            <dl className="policy-list">
              {faqData.map((faq) => (
                <div key={faq.question}>
                  <dt>{faq.question}</dt>
                  <dd>{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </section>
  );
}
