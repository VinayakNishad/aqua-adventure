import axios from 'axios';

export const getGoogleReviews = async (req, res) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;
    
    // The Google Places API URL for fetching place details
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews(author_name,profile_photo_url,rating,relative_time_description,text)&key=${apiKey}`;

    try {
        const response = await axios.get(url);

        if (response.data.status !== 'OK') {
            throw new Error(response.data.error_message || 'Failed to fetch reviews from Google.');
        }

        const reviews = response.data.result.reviews || [];

        // Format the reviews to be more frontend-friendly
        const formattedReviews = reviews.map(review => ({
            authorName: review.author_name,
            profilePhotoUrl: review.profile_photo_url,
            rating: review.rating,
            relativeTimeDescription: review.relative_time_description,
            text: review.text,
        }));
        
        res.status(200).json(formattedReviews);

    } catch (error) {
        console.error("Error fetching Google reviews:", error);
        res.status(500).json({ message: "Server error while fetching Google reviews." });
    }
};


export const getGooglePhotos = async (req, res) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    
    const photos = response.data.result.photos || [];

    // Map to usable photo URLs
    const formattedPhotos = photos.map(photo => ({
      photoUrl: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${apiKey}`
    }));

    res.status(200).json(formattedPhotos);
  } catch (err) {
    console.error("Error fetching photos:", err);
    res.status(500).json({ message: "Failed to fetch photos" });
  }
};
