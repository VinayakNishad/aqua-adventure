import apiClient from "./apiClient";

export const getActivities = () => apiClient.get("/activities").then((res) => res.data);
export const getActivity = (id) => apiClient.get(`/activities/${id}`).then((res) => res.data);
export const createActivity = (formData) =>
  apiClient.post("/activities", formData).then((res) => res.data);
export const updateActivity = (id, formData) =>
  apiClient.put(`/activities/${id}`, formData).then((res) => res.data);
export const deleteActivity = (id) => apiClient.delete(`/activities/${id}`).then((res) => res.data);
