import "dotenv/config";

const required = ["MONGO_URI"];
const missing = required.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
}

const parseList = (value = "") =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI,
  corsOrigins: parseList(
    process.env.CORS_ORIGINS ?? "https://aqua-adventure.vercel.app,http://localhost:3000",
  ),
  adminEmails: parseList(process.env.ADMIN_EMAILS).map((email) => email.toLowerCase()),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  google: {
    placesApiKey: process.env.GOOGLE_PLACES_API_KEY,
    placeId: process.env.GOOGLE_PLACE_ID,
  },
  firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,
});

export default env;
