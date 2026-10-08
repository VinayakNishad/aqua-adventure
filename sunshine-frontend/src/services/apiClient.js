import axios from "axios";
import env from "../config/env";
import { auth } from "../config/firebase";

const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 30_000,
});

// Attach the signed-in user's Firebase ID token so the API can authorise admin requests.
apiClient.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/** Extracts a user-facing message from an API error. */
export const getErrorMessage = (error, fallback = "Something went wrong") =>
  error?.response?.data?.message ?? error?.message ?? fallback;

export default apiClient;
