import { Carousel } from "react-bootstrap";
import StarRating from "../common/StarRating";
import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import { formatTime } from "../../utils/format";
import "./PackageHero.css";

/** Photo gallery with the package name, rating and quick facts laid over it. */
export default function PackageHero({ pkg, onImageClick }) {
  const facts = [
    pkg.duration && { icon: "bi-hourglass-split", label: pkg.duration },
    pkg.pickupTime && { icon: "bi-sunrise", label: `Pickup ${formatTime(pkg.pickupTime)}` },
    pkg.dropTime && { icon: "bi-sunset", label: `Drop ${formatTime(pkg.dropTime)}` },
    pkg.category && { icon: "bi-tag", label: pkg.category },
  ].filter(Boolean);

  return (
    <header className="package-hero">
      {pkg.images?.length > 0 ? (
        <Carousel fade indicators={pkg.images.length > 1} controls={pkg.images.length > 1}>
          {pkg.images.map((image, index) => (
            <Carousel.Item key={image} interval={5000}>
              <img
                className="package-hero__img"
                src={getOptimizedCloudinaryUrl(image, { width: 1600, height: 900, crop: "fill" })}
                alt={`${pkg.name} – photo ${index + 1}`}
                onClick={() => onImageClick(image)}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <div className="package-hero__placeholder" />
      )}

      <div className="package-hero__overlay">
        <h1 className="package-hero__title">{pkg.name}</h1>
        {pkg.reviewCount > 0 && (
          <a href="#package-reviews" className="package-hero__rating">
            <StarRating value={pkg.avgRating} />
            <span>
              {pkg.avgRating.toFixed(1)} · {pkg.reviewCount} reviews
            </span>
          </a>
        )}
        {facts.length > 0 && (
          <ul className="package-hero__facts">
            {facts.map((fact) => (
              <li key={fact.label}>
                <i className={`bi ${fact.icon}`} aria-hidden="true" />
                {fact.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
