import mongoose from "mongoose";
import Package from "../models/Package.js";
import Review from "../models/Review.js";
import ApiError from "../utils/ApiError.js";
import parseJsonArray from "../utils/parseJsonField.js";

const buildPackageFields = (body) => {
  const fields = {};
  for (const key of [
    "name",
    "description",
    "price",
    "duration",
    "category",
    "pickupTime",
    "dropTime",
  ]) {
    if (body[key] !== undefined) fields[key] = body[key];
  }
  if (body.points !== undefined) fields.points = parseJsonArray(body.points, "points");
  if (body.activities !== undefined) {
    fields.activities = parseJsonArray(body.activities, "activities");
  }
  return fields;
};

const getRatingStats = async (packageIds) => {
  const stats = await Review.aggregate([
    { $match: { package: { $in: packageIds } } },
    { $group: { _id: "$package", avgRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } },
  ]);
  return new Map(stats.map((s) => [String(s._id), s]));
};

export const getPackages = async (_req, res) => {
  const packages = await Package.find().populate("activities").lean();
  const stats = await getRatingStats(packages.map((pkg) => pkg._id));

  res.json(
    packages.map((pkg) => {
      const { avgRating = 0, reviewCount = 0 } = stats.get(String(pkg._id)) ?? {};
      return { ...pkg, avgRating, reviewCount };
    }),
  );
};

export const getPackageById = async (req, res) => {
  const { id } = req.params;
  const pkg = await Package.findById(id).populate("activities").lean();
  if (!pkg) throw ApiError.notFound("Package not found");

  const [reviews, stats] = await Promise.all([
    Review.find({ package: id }).sort({ createdAt: -1 }).lean(),
    getRatingStats([new mongoose.Types.ObjectId(id)]),
  ]);
  const { avgRating = 0, reviewCount = 0 } = stats.get(id) ?? {};

  res.json({ ...pkg, reviews, avgRating, reviewCount });
};

export const createPackage = async (req, res) => {
  const newPackage = await Package.create({
    ...buildPackageFields(req.body),
    images: req.uploadedFiles.map((f) => f.url),
  });
  res.status(201).json(newPackage);
};

export const updatePackage = async (req, res) => {
  const existingImages = parseJsonArray(req.body.existingImages, "existingImages");
  const images = [...existingImages, ...req.uploadedFiles.map((f) => f.url)];

  const updated = await Package.findByIdAndUpdate(
    req.params.id,
    { ...buildPackageFields(req.body), images },
    { returnDocument: "after", runValidators: true },
  );
  if (!updated) throw ApiError.notFound("Package not found");

  res.json(updated);
};

export const deletePackage = async (req, res) => {
  const deleted = await Package.findByIdAndDelete(req.params.id);
  if (!deleted) throw ApiError.notFound("Package not found");

  res.json({ message: "Package deleted successfully" });
};
