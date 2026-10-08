/**
 * Grants the `admin` custom claim to a Firebase user.
 * Usage: npm run set-admin -- <firebase-uid>
 */
import { getFirebaseAuth } from "../src/config/firebase.js";
import logger from "../src/utils/logger.js";

const uid = process.argv[2];
if (!uid) {
  logger.error("Usage: npm run set-admin -- <firebase-uid>");
  process.exit(1);
}

const auth = getFirebaseAuth();
if (!auth) {
  logger.error("FIREBASE_SERVICE_ACCOUNT is not set.");
  process.exit(1);
}

try {
  await auth.setCustomUserClaims(uid, { admin: true });
  logger.info(`Admin role assigned to UID: ${uid}`);
} catch (err) {
  logger.error("Error assigning admin role:", err);
  process.exitCode = 1;
}
