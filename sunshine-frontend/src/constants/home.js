export const SECTION_IDS = Object.freeze({
  HOME: "home",
  PACKAGES: "packages",
  ABOUT: "about",
  CHANNEL: "channel",
  REVIEWS: "reviews",
  FAQ: "faq",
  CONTACT: "contact",
});

export const HERO_HIGHLIGHTS = Object.freeze([
  { icon: "bi-water", label: "Scuba at Grand Island" },
  { icon: "bi-person-check", label: "No swimming skills needed" },
  { icon: "bi-shield-check", label: "Certified guides" },
  { icon: "bi-car-front", label: "Pickup, lunch & snacks" },
]);

/** Words typed out in the hero headline: "Dive into ___". */
export const HERO_ROTATING_WORDS = Object.freeze([
  "Paradise",
  "Grand Island",
  "Blue Waters",
  "Adventure",
]);

/** Main navigation entries; the last one renders as the highlighted call-to-action. */
export const NAV_LINKS = Object.freeze([
  { id: SECTION_IDS.HOME, label: "Home", icon: "bi-house" },
  { id: SECTION_IDS.PACKAGES, label: "Packages", icon: "bi-box-seam" },
  { id: SECTION_IDS.ABOUT, label: "About", icon: "bi-info-circle" },
  { id: SECTION_IDS.CHANNEL, label: "Channel", icon: "bi-play-btn" },
  { id: SECTION_IDS.FAQ, label: "FAQ", icon: "bi-question-circle" },
  { id: SECTION_IDS.CONTACT, label: "Contact", icon: "bi-chat-dots", cta: true },
]);

export const HERO_BOOKING_MESSAGE =
  "Hi! I'd like to book a scuba / water sports trip in Goa. Please share availability and prices.";
