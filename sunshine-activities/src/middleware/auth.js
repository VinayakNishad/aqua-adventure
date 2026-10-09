import { getFirebaseAuth } from "../config/firebase.js";
import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";

/**
 * Verifies the Firebase ID token in the Authorization header and requires the
 * user to be an admin, either via the `admin` custom claim or ADMIN_EMAILS.
 */
export const requireAdmin = async (req, _res, next) => {
  const auth = getFirebaseAuth();
  if (!auth) throw ApiError.serviceUnavailable("Admin authentication is not configured");

  const [scheme, token] = req.headers.authorization?.split(" ") ?? [];
  if (scheme !== "Bearer" || !token) throw ApiError.unauthorized();

  let decoded;
  try {
    decoded = await auth.verifyIdToken(token);
  } catch {
    throw ApiError.unauthorized("Invalid or expired token");
  }

  const isAdmin =
    decoded.admin === true ||
    (decoded.email && env.adminEmails.includes(decoded.email.toLowerCase()));
  if (!isAdmin) throw ApiError.forbidden();

  req.user = decoded;
  next();
};
