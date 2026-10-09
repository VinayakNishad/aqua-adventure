import { PICKUP_LOCATIONS, googleMapsSearchUrl } from "../../constants/packageInfo";
import LocationMap from "./LocationMap";
import "./PickupLocations.css";

/** Starting point and pickup stops as a route timeline, always visible. */
export default function PickupLocations() {
  return (
    <section className="detail-section" aria-labelledby="pickup-title">
      <h2 id="pickup-title" className="detail-section__title">
        Pickup &amp; drop locations
      </h2>
      <div className="pickup-route">
        <p className="pickup-route__note">
          <i className="bi bi-info-circle" aria-hidden="true" /> Hotel pickup and drop are available
          for selected packages. Tap a stop to open it in Google Maps.
        </p>
        <ol className="pickup-route__list">
          {PICKUP_LOCATIONS.map((location, index) => (
            <li key={location.name} className="pickup-route__stop">
              <span className="pickup-route__icon">
                <i
                  className={`bi ${index === 0 ? "bi-flag-fill" : "bi-geo-alt-fill"}`}
                  aria-hidden="true"
                />
              </span>
              <div>
                <span className="pickup-route__type">{location.type}</span>
                <a
                  href={googleMapsSearchUrl(location)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pickup-route__name"
                >
                  {location.name} <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
                </a>
                <span className="pickup-route__address">{location.address}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <LocationMap className="mt-3 d-lg-none" />
    </section>
  );
}
