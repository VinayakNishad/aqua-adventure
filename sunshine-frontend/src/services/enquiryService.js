import apiClient from "./apiClient";

export const getEnquiries = () => apiClient.get("/enquiries").then((res) => res.data);
export const createEnquiry = (payload) =>
  apiClient.post("/enquiries", payload).then((res) => res.data);
export const approveEnquiry = (id) =>
  apiClient.put(`/enquiries/${id}/approve`).then((res) => res.data);
export const deleteEnquiry = (id) => apiClient.delete(`/enquiries/${id}`).then((res) => res.data);
