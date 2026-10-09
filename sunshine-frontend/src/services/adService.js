import apiClient from "./apiClient";

export const getAds = () => apiClient.get("/ads").then((res) => res.data);
export const createAd = (formData) => apiClient.post("/ads", formData).then((res) => res.data);
export const deleteAd = (id) => apiClient.delete(`/ads/${id}`).then((res) => res.data);
