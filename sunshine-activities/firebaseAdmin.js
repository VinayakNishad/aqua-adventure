// firebaseAdmin.js
import admin from "firebase-admin";
const admin = require("firebase-admin");

// 1. Get the string from the environment variable
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountString) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT env var is not set.");
}

// 2. Parse the string as JSON
const serviceAccount = JSON.parse(serviceAccountString);

// 3. Initialize the app
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
export default admin;
