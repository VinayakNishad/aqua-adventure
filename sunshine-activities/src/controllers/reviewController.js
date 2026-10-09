import mongoose from "mongoose";
import Review from "../models/Review.js";
import ApiError from "../utils/ApiError.js";

/** GET /reviews/:type/:id — only package reviews are linked to a parent. */
export const getReviews = async (req, res) => {
  const { type, id } = req.params;
  if (type === "package" && !mongoose.isValidObjectId(id)) {
    throw ApiError.badRequest("Invalid id");
  }
  const filter = type === "package" ? { package: id } : {};
  const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
  res.json(reviews);
};

export const createReview = async (req, res) => {
  const { packageId, userName, rating, comment } = req.body;
  if (packageId && !mongoose.isValidObjectId(packageId)) {
    throw ApiError.badRequest("Invalid packageId");
  }

  const review = await Review.create({
    package: packageId || null,
    userName,
    rating,
    comment,
    image: req.uploadedFile?.url ?? null,
  });
  res.status(201).json(review);
};
