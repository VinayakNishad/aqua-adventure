import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";

const DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";
const PHOTO_URL = "https://maps.googleapis.com/maps/api/place/photo";

const fetchPlaceDetails = async (fields) => {
  const { placesApiKey, placeId } = env.google;
  if (!placesApiKey || !placeId) {
    throw ApiError.serviceUnavailable("Google Places is not configured");
  }

  const url = new URL(DETAILS_URL);
  url.search = new URLSearchParams({ place_id: placeId, fields, key: placesApiKey });

  const response = await fetch(url);
  const data = await response.json();
  if (data.status !== "OK") {
    throw new Error(data.error_message || `Google Places error: ${data.status}`);
  }
  return data.result;
};

export const getReviews = async () => {
  const result = await fetchPlaceDetails(
    "reviews(author_name,profile_photo_url,rating,relative_time_description,text)",
  );
  return (result.reviews ?? []).map((review) => ({
    authorName: review.author_name,
    profilePhotoUrl: review.profile_photo_url,
    rating: review.rating,
    relativeTimeDescription: review.relative_time_description,
    text: review.text,
  }));
};

export const getPhotos = async () => {
  const result = await fetchPlaceDetails("photos");
  return (result.photos ?? []).map((photo) => {
    const url = new URL(PHOTO_URL);
    url.search = new URLSearchParams({
      maxwidth: "800",
      photo_reference: photo.photo_reference,
      key: env.google.placesApiKey,
    });
    return { photoUrl: url.toString() };
  });
};
