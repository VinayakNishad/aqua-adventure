import React from "react";
import "./LocationSteps.css";
import { ExternalLinkIcon, FlagIcon, PinIcon } from "../icons";

// --- Self-Contained SVG Icon Components ---

const LocationTimeline = ({ locationData }) => {
  const defaultLocations = [
    { type: "Starting Point", name: "Sinquerim Beach", address: "Sinquerim, Candolim, Goa" },
    { type: "Pickup Point", name: "Candolim", address: "Candolim, Goa, India" },
    { type: "Pickup Point", name: "Calangute", address: "Calangute, Goa, India" },
    { type: "Pickup Point", name: "Baga", address: "Baga, Goa, India" },
  ];
  const locations = locationData || defaultLocations;

  return (
    <>
      <div className="location-timeline-section">
        <div className="location-timeline-card">
          <div className="location-timeline-header">
            <h2>Pickup & Drop Locations for Some Package</h2>
          </div>
          <ul className="location-list">
            {locations.map((location, index) => {
              const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + ", " + location.address)}`;
              return (
                <li key={index} className="location-item">
                  <div className="location-icon-container">
                    {location.type === "Starting Point" ? (
                      <FlagIcon className="icon" />
                    ) : (
                      <PinIcon className="icon" />
                    )}
                    <div className="vertical-line"></div>
                  </div>
                  <div className="location-details">
                    <h3>{location.type}</h3>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="location-link"
                    >
                      {location.name}
                      <ExternalLinkIcon />
                    </a>
                    <p className="location-address">{location.address}</p>
                  </div>
                  {location.time && <div className="location-time">{location.time}</div>}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default LocationTimeline;
