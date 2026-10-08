import { rateLimit } from "express-rate-limit";

/** Throttles anonymous write endpoints (bookings, reviews) to deter spam. */
export const publicWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});
