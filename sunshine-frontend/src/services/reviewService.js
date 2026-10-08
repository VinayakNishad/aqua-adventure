import apiClient from "./apiClient";

export const createReview = (formData) =>
  apiClient.post("/reviews", formData).then((res) => res.data);
export const getGoogleReviews = () => apiClient.get("/google/reviews").then((res) => res.data);
