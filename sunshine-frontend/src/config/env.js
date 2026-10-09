const parseList = (value = "") =>
  value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

const env = Object.freeze({
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  adminEmails: parseList(import.meta.env.VITE_ADMIN_EMAILS),
  gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  isProduction: import.meta.env.PROD,
});

export default env;
