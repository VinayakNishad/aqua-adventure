import { ROUTES } from "../routes/paths";

/** Admin sidebar navigation. */
export const ADMIN_NAV = Object.freeze([
  { to: ROUTES.BOOKINGS, label: "Bookings", icon: "bi-calendar-check" },
  { to: ROUTES.ADMIN_PACKAGES, label: "Packages", icon: "bi-box-seam" },
  { to: ROUTES.ACTIVITIES, label: "Activities", icon: "bi-water" },
  { to: ROUTES.VIDEOS, label: "Videos", icon: "bi-play-btn" },
]);

export const ENQUIRY_STATUS = Object.freeze({ PENDING: 0, APPROVED: 1 });

/** localStorage key remembering which bookings were already sent a review request. */
export const REVIEW_REQUESTS_STORAGE_KEY = "admin.reviewRequestsSent";

/** Max photos a single package can hold (existing + new). */
export const MAX_PACKAGE_IMAGES = 10;

/** Maximum number of photos an activity can have. */
export const MAX_ACTIVITY_IMAGES = 5;
