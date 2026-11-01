import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";

// Places API (New). The legacy Places API cannot be enabled on new Google Cloud projects.
const PLACES_URL = "https://places.googleapis.com/v1/places";
const MEDIA_URL = "https://places.googleapis.com/v1";

const fetchPlaceDetails = async (fieldMask) => {
  const { placesApiKey, placeId } = env.google;
  if (!placesApiKey || !placeId) {
    throw ApiError.serviceUnavailable("Google Places is not configured");
  }

  const response = await fetch(`${PLACES_URL}/${encodeURIComponent(placeId)}`, {
    headers: { "X-Goog-Api-Key": placesApiKey, "X-Goog-FieldMask": fieldMask },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || `Google Places error: HTTP ${response.status}`);
  }
  return data;
};

export const getReviews = async () => {
  const place = await fetchPlaceDetails("reviews");
  return (place.reviews ?? []).map((review) => ({
    authorName: review.authorAttribution?.displayName,
    profilePhotoUrl: review.authorAttribution?.photoUri,
    rating: review.rating,
    relativeTimeDescription: review.relativePublishTimeDescription,
    text: review.text?.text ?? review.originalText?.text ?? "",
  }));
};

export const getPhotos = async () => {
  const place = await fetchPlaceDetails("photos");
  return (place.photos ?? []).map((photo) => {
    const url = new URL(`${MEDIA_URL}/${photo.name}/media`);
    url.search = new URLSearchParams({ maxWidthPx: "800", key: env.google.placesApiKey });
    return { photoUrl: url.toString() };
  });
};
