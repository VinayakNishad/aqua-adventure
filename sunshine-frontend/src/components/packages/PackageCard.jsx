import { Link } from "react-router-dom";
import { PACKAGE_DISCOUNT_PERCENT } from "../../constants/packageInfo";
import { packageEnquiryMessage } from "../../constants/messages";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import { formatPrice, formatTime, originalPriceFor } from "../../utils/format";
import { buildWhatsAppUrl } from "../../utils/whatsapp";
import "./PackageCard.css";

const MAX_ACTIVITY_CHIPS = 3;

/** Package summary card: cover photo, key facts, price and booking actions. */
export default function PackageCard({ pkg, priority = false, onBook, adminActions = null }) {
  const detailUrl = `/package/${pkg._id}`;
  const cover = pkg.images?.[0];
  const activities = pkg.activities ?? [];
  const extraActivities = activities.length - MAX_ACTIVITY_CHIPS;
  const times =
    pkg.pickupTime && pkg.dropTime
      ? `${formatTime(pkg.pickupTime)} – ${formatTime(pkg.dropTime)}`
      : null;

  return (
    <article className="pkg-card" data-tilt>
      <Link to={detailUrl} className="pkg-card__media" aria-label={`View ${pkg.name}`}>
        {cover ? (
          <img
            src={getOptimizedCloudinaryUrl(cover, { width: 800, height: 600, crop: "fill" })}
            alt=""
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />
        ) : (
          <span className="pkg-card__placeholder">
            <i className="bi bi-image" aria-hidden="true" />
          </span>
        )}
        {pkg.reviewCount > 0 && (
          <span className="pkg-card__badge pkg-card__badge--rating">
            <i className="bi bi-star-fill" aria-hidden="true" /> {pkg.avgRating.toFixed(1)}
            <small>({pkg.reviewCount})</small>
          </span>
        )}
        <span className="pkg-card__badge pkg-card__badge--deal">
          {PACKAGE_DISCOUNT_PERCENT}% off
        </span>
        {pkg.images?.length > 1 && (
          <span className="pkg-card__photos">
            <i className="bi bi-images" aria-hidden="true" /> {pkg.images.length}
          </span>
        )}
      </Link>

      {adminActions}

      <div className="pkg-card__body">
        <h3 className="pkg-card__title">
          <Link to={detailUrl}>{pkg.name}</Link>
        </h3>

        {times && (
          <p className="pkg-card__meta">
            <i className="bi bi-clock" aria-hidden="true" /> {times}
          </p>
        )}

        {pkg.description && <p className="pkg-card__desc">{pkg.description}</p>}

        {activities.length > 0 && (
          <ul className="pkg-card__chips" aria-label="Included activities">
            {activities.slice(0, MAX_ACTIVITY_CHIPS).map((activity) => (
              <li key={activity._id}>{activity.title}</li>
            ))}
            {extraActivities > 0 && <li className="is-more">+{extraActivities} more</li>}
          </ul>
        )}

        <footer className="pkg-card__footer">
          <div className="pkg-card__price">
            <span className="pkg-card__price-now">{formatPrice(pkg.price)}</span>
            <del>{formatPrice(originalPriceFor(pkg.price, PACKAGE_DISCOUNT_PERCENT))}</del>
            <small>per person</small>
          </div>
          <div className="pkg-card__actions">
            <a
              href={buildWhatsAppUrl(packageEnquiryMessage(pkg))}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-whatsapp pkg-card__wa"
              aria-label={`Ask about ${pkg.name} on WhatsApp`}
            >
              <i className="bi bi-whatsapp" aria-hidden="true" />
            </a>
            <button type="button" className="btn btn-cta" onClick={() => onBook(pkg)}>
              Book now
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
}
