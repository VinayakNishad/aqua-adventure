import admin from "./firebaseAdmin.js";

// Replace with your Firebase User UID from Authentication > Users
const uid = "CS7Lyq7KXcT5ukUAbpB6YGNqIwS2";

async function setAdminRole() {
  try {
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    console.log(`Admin role assigned to UID: ${uid}`);
    process.exit(0);
  } catch (err) {
    console.error("Error assigning admin role:", err);
    process.exit(1);
  }
}

setAdminRole();
