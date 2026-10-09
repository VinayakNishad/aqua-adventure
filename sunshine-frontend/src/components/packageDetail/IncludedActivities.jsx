import { getOptimizedCloudinaryUrl } from "../../utils/cloudinary";
import "./IncludedActivities.css";

/** Swipeable photo cards for the activities bundled in a package. */
export default function IncludedActivities({ activities, onImageClick }) {
  if (!activities?.length) return null;

  return (
    <section className="detail-section" aria-labelledby="included-title">
      <h2 id="included-title" className="detail-section__title">
        What&rsquo;s included
      </h2>
      <ul className="included-activities">
        {activities.map((activity) => {
          const cover = activity.images?.[0]?.url;
          return (
            <li key={activity._id} className="included-activity" data-tilt>
              {cover ? (
                <img
                  src={getOptimizedCloudinaryUrl(cover, { width: 600, height: 420, crop: "fill" })}
                  alt={activity.title}
                  loading="lazy"
                  decoding="async"
                  onClick={() => onImageClick(cover)}
                />
              ) : (
                <div className="included-activity__placeholder">
                  <i className="bi bi-water" aria-hidden="true" />
                </div>
              )}
              <div className="included-activity__body">
                <h3>{activity.title}</h3>
                {activity.category && <span>{activity.category}</span>}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
