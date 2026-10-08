import apiClient from "./apiClient";

export const getVideos = () => apiClient.get("/videos").then((res) => res.data);
export const addVideo = (link) => apiClient.post("/videos", { link }).then((res) => res.data);
