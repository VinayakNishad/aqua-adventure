/** Static content shown on every package detail page. */

/** Shown as a struck-through "original" price; packages are advertised at this discount. */
export const PACKAGE_DISCOUNT_PERCENT = 10;

export const WHY_CHOOSE_US = Object.freeze([
  { icon: "bi-award", title: "10+ years", text: "of water sports experience" },
  { icon: "bi-star-fill", title: "4.8 / 5", text: "average guest rating" },
  { icon: "bi-person-badge", title: "Instructor-led", text: "safety-first trips" },
  { icon: "bi-headset", title: "24/7 support", text: "before and after your trip" },
]);

export const WHAT_TO_BRING = Object.freeze([
  "Valid government ID",
  "Swimwear and a change of clothes",
  "Sunscreen, sunglasses and a hat",
  "Waterproof bag for your phone",
  "Towel",
]);

export const SAFETY_TIPS = Object.freeze([
  "Listen to the instructor's safety briefing",
  "Avoid heavy meals or alcohol before activities",
  "Tell our staff about any medical conditions (asthma, heart problems, etc.)",
  "Do not wear loose jewellery or accessories",
  "Please do not litter the beach or sea",
]);

export const BOOKING_POLICIES = Object.freeze([
  {
    title: "Booking confirmation",
    text: "Once confirmed, a booking bill is sent to you on WhatsApp as proof.",
  },
  {
    title: "Personal belongings",
    text: "We are not responsible for loss or damage of jewellery or valuables. Please leave expensive items behind.",
  },
  {
    title: "Weather and safety",
    text: "Safety instructions must be followed at all times. Activities may be changed or rescheduled because of weather.",
  },
]);

export const PICKUP_LOCATIONS = Object.freeze([
  { type: "Starting point", name: "Sinquerim Beach", address: "Sinquerim, Candolim, Goa" },
  { type: "Pickup point", name: "Candolim", address: "Candolim, Goa, India" },
  { type: "Pickup point", name: "Calangute", address: "Calangute, Goa, India" },
  { type: "Pickup point", name: "Baga", address: "Baga, Goa, India" },
]);

export const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3844.730208216731!2d73.77773757512401!3d15.498937485101022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfc17d3db27edd%3A0xa46115cf9765581b!2sParadise%20Watersports!5e0!3m2!1sen!2sin!4v1759642658765!5m2!1sen!2sin";

export const googleMapsSearchUrl = ({ name, address }) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name}, ${address}`)}`;

export const REVIEWS_PREVIEW_COUNT = 4;

export const HIGHLIGHTS_PREVIEW_COUNT = 5;

/** A typical day, shown as a timeline so guests can picture the trip. */
export const DAY_ITINERARY = Object.freeze([
  {
    time: "Morning",
    icon: "bi-car-front",
    title: "Hotel pickup",
    text: "Our team collects you from Candolim, Calangute or Baga (selected packages) and drives you to the jetty.",
  },
  {
    time: "At the jetty",
    icon: "bi-life-preserver",
    title: "Safety briefing & gear-up",
    text: "Certified instructors fit your life jacket and walk you through every activity before you head out.",
  },
  {
    time: "On the water",
    icon: "bi-water",
    title: "Adventure time",
    text: "Cruise past Sinquerim and Aguada Fort, spot dolphins in the Arabian Sea and enjoy each activity in your package.",
  },
  {
    time: "Along the way",
    icon: "bi-camera",
    title: "Photos & memories",
    text: "Plenty of stops for photos with the Goan coastline as your backdrop. Bring a waterproof pouch for your phone.",
  },
  {
    time: "Afternoon",
    icon: "bi-house-heart",
    title: "Drop back",
    text: "Relax on the ride back. You are home in time for a sunset on the beach.",
  },
]);

/** Short selling points shown as chips under the itinerary. */
export const TRIP_FACTS = Object.freeze([
  { icon: "bi-calendar-check", text: "Best season: October to May" },
  { icon: "bi-people", text: "Great for families, couples & groups" },
  { icon: "bi-emoji-smile", text: "No experience needed" },
  { icon: "bi-shield-check", text: "Life jackets & insured boats" },
]);
