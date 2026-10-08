import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import env from "./env.js";

let auth;

/**
 * Lazily initialises Firebase Admin so the API can boot without credentials
 * (e.g. local development of public endpoints). Admin-only routes will fail
 * with 503 until FIREBASE_SERVICE_ACCOUNT is configured.
 */
export const getFirebaseAuth = () => {
  if (auth) return auth;
  if (!env.firebaseServiceAccount) return null;

  if (getApps().length === 0) {
    initializeApp({ credential: cert(JSON.parse(env.firebaseServiceAccount)) });
  }
  auth = getAuth();
  return auth;
};
