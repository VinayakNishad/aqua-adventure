// controllers/reviewController.js
import Review from "../models/Review.js";
import Package from "../models/Package.js";

// Fetch reviews for activity OR package
export const getReviews = async (req, res) => {
  try {
    const { type, id } = req.params; // type = activity | package
    const filter = type === "package" ? { package: id } : {};
    const reviews = await Review.find(filter);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

// Create review
export const createReview = async (req, res) => {
  try {
    const { packageId, userName, rating, comment } = req.body;
    const image = req.file ? req.file.path : null;
    
    

    const review = new Review({
      package: packageId || null,
      userName,
      rating,
      comment,
      image,
      
    });

    const savedReview = await review.save();

    if (packageId) {
      await Package.findByIdAndUpdate(packageId, {
        $push: { reviews: savedReview._id },
      });
    }

    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json({ message: "Error creating review" });
  }
};
