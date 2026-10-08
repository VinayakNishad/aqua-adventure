import { MAP_EMBED_URL } from "../../constants/packageInfo";
import { LOCATION_LABEL } from "../../constants/contact";
import "./LocationMap.css";

/** Embedded Google Map of the jetty. */
export default function LocationMap({ className = "" }) {
  return (
    <div className={`location-map ${className}`.trim()}>
      <h3 className="location-map__title">
        <i className="bi bi-geo-alt-fill" aria-hidden="true" /> {LOCATION_LABEL}
      </h3>
      <div className="ratio ratio-4x3">
        <iframe
          src={MAP_EMBED_URL}
          title="Paradise Watersports location"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  );
}
