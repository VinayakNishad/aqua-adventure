import { PACKAGE_DISCOUNT_PERCENT } from "../../constants/packageInfo";
import { packageEnquiryMessage } from "../../constants/messages";
import { formatPrice, originalPriceFor } from "../../utils/format";
import { buildWhatsAppUrl } from "../../utils/whatsapp";
import "./BookingCard.css";

const PriceTag = ({ price }) => (
  <div className="price-tag">
    <span className="price-tag__now">{formatPrice(price)}</span>
    <del className="price-tag__was">
      {formatPrice(originalPriceFor(price, PACKAGE_DISCOUNT_PERCENT))}
    </del>
    <span className="price-tag__badge">{PACKAGE_DISCOUNT_PERCENT}% off</span>
  </div>
);

/** Sticky price + booking card (desktop) and fixed bottom bar (mobile). */
export default function BookingCard({ pkg, onBook }) {
  const whatsappUrl = buildWhatsAppUrl(packageEnquiryMessage(pkg));

  return (
    <>
      <aside className="booking-card d-none d-lg-block" aria-label="Book this package">
        <span className="booking-card__label">Price per person</span>
        <PriceTag price={pkg.price} />
        <button type="button" className="btn btn-cta btn-lg w-100 mt-3" onClick={onBook}>
          Book now
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-whatsapp w-100 mt-2"
        >
          <i className="bi bi-whatsapp" aria-hidden="true" /> Ask on WhatsApp
        </a>
        <ul className="booking-card__perks">
          <li>
            <i className="bi bi-check2" aria-hidden="true" /> Booking bill sent on WhatsApp
          </li>
          <li>
            <i className="bi bi-check2" aria-hidden="true" /> Certified, instructor-led trips
          </li>
        </ul>
      </aside>

      <div className="booking-bar d-lg-none">
        <div>
          <PriceTag price={pkg.price} />
          <small className="text-muted">per person</small>
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline-whatsapp booking-bar__wa"
          aria-label="Ask on WhatsApp"
        >
          <i className="bi bi-whatsapp" aria-hidden="true" />
        </a>
        <button type="button" className="btn btn-cta" onClick={onBook}>
          Book now
        </button>
      </div>
    </>
  );
}
