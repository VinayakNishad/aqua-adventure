import apiClient from "./apiClient";

export const getPackages = () => apiClient.get("/packages").then((res) => res.data);
export const getPackage = (id) => apiClient.get(`/packages/${id}`).then((res) => res.data);
export const createPackage = (formData) =>
  apiClient.post("/packages", formData).then((res) => res.data);
export const updatePackage = (id, formData) =>
  apiClient.put(`/packages/${id}`, formData).then((res) => res.data);
export const deletePackage = (id) => apiClient.delete(`/packages/${id}`).then((res) => res.data);
