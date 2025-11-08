import React from 'react';

// --- Self-Contained SVG Icon Components ---
const FlagIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
        <line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
);
const PinIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);
const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style={{ marginLeft: '4px', verticalAlign: 'middle', opacity: 0.7 }}>
        <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
        <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
    </svg>
);

const LocationTimeline = ({ locationData }) => {
    const defaultLocations = [
        { type: 'Starting Point', name: 'Sinquerim Beach', address: 'Sinquerim, Candolim, Goa'},
        { type: 'Pickup Point', name: 'Candolim', address: 'Candolim, Goa, India' },
        { type: 'Pickup Point', name: 'Calangute', address: 'Calangute, Goa, India' },
        { type: 'Pickup Point', name: 'Baga', address: 'Baga, Goa, India' }

    ];
    const locations = locationData || defaultLocations;

    return (
        <>
            <style>{`
                .location-timeline-section {
                    font-family: 'Poppins', sans-serif;
                    background-color: #ffffffff;
                    padding: 3rem 0rem;
                }
                .location-timeline-card {
                    width: 100%;
                    max-width: 700px; /* ✅ FIX: Max-width constraint */
                    background: #ffffff;
                    border-radius: 16px;
                    padding: 2rem;
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
                    margin: 0 auto; /* Center the card */
                }
                .location-timeline-header h2 {
                    font-size: 1.75rem;
                    font-weight: 700;
                    color: #0056b3;
                    margin: 0;
                    text-align: center;
                    margin-bottom: 2rem;
                }
                .location-list { list-style: none; padding: 0; margin: 0; }
                .location-item {
                    display: flex;
                    position: relative;
                    padding-bottom: 2rem;
                }
                .location-item:last-child { padding-bottom: 0; }
                .location-icon-container {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-right: 1.5rem;
                }
                .location-icon-container .icon {
                    color: #007bff;
                    background-color: #e6f0ff;
                    border-radius: 50%;
                    padding: 8px;
                    z-index: 1;
                }
                .vertical-line {
                    position: absolute;
                    top: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 2px;
                    height: calc(100% - 20px);
                    background-color: #e0e7ff;
                }
                .location-item:last-child .vertical-line { display: none; }
                
                .location-details { flex-grow: 1; }
                .location-details h3 {
                    font-size: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #6c757d;
                    margin: 0 0 4px 0;
                }
                .location-link {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #343a40;
                    text-decoration: none;
                }
                .location-link:hover { color: #0056b3; }
                .location-address {
                    font-size: 0.9rem;
                    color: #adb5bd;
                    margin-top: 4px;
                }
                .location-time {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: #495057;
                    white-space: nowrap;
                    margin-left: auto; /* Pushes time to the right */
                    padding-left: 1rem;
                }
            `}</style>
            <div className="location-timeline-section">
                <div className="location-timeline-card">
                    <div className="location-timeline-header">
                        <h2>Pickup & Drop Locations for Some Package</h2>
                    </div>
                    <ul className="location-list">
                        {locations.map((location, index) => {
                            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.name + ', ' + location.address)}`;
                            return (
                                <li key={index} className="location-item">
                                    <div className="location-icon-container">
                                        {location.type === 'Starting Point' ? <FlagIcon className="icon" /> : <PinIcon className="icon" />}
                                        <div className="vertical-line"></div>
                                    </div>
                                    <div className="location-details">
                                        <h3>{location.type}</h3>
                                        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="location-link">
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
