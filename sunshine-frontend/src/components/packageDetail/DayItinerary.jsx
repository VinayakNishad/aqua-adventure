import { DAY_ITINERARY, TRIP_FACTS } from "../../constants/packageInfo";
import "./DayItinerary.css";

/** "Your day at a glance": a vertical timeline of the trip plus quick facts. */
export default function DayItinerary() {
  return (
    <section className="detail-section" aria-labelledby="itinerary-title">
      <h2 id="itinerary-title" className="detail-section__title">
        Your day at a glance
      </h2>
      <ol className="day-itinerary">
        {DAY_ITINERARY.map((step) => (
          <li key={step.title} className="day-itinerary__step">
            <span className="day-itinerary__icon">
              <i className={`bi ${step.icon}`} aria-hidden="true" />
            </span>
            <div>
              <span className="day-itinerary__time">{step.time}</span>
              <h3 className="day-itinerary__title">{step.title}</h3>
              <p className="day-itinerary__text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <ul className="trip-facts">
        {TRIP_FACTS.map((fact) => (
          <li key={fact.text}>
            <i className={`bi ${fact.icon}`} aria-hidden="true" /> {fact.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
