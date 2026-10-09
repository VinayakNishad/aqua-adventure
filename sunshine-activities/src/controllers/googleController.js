import * as googlePlaces from "../services/googlePlacesService.js";

export const getGoogleReviews = async (_req, res) => {
  res.json(await googlePlaces.getReviews());
};

export const getGooglePhotos = async (_req, res) => {
  res.json(await googlePlaces.getPhotos());
};
