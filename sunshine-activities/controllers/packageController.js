import Package from "../models/Package.js";
import Review from "../models/Review.js";
import mongoose from "mongoose";

// Get all packages with average ratings and populated activities
export const getPackages = async (req, res) => {
  try {
    // --- Populated 'activities' to include their full details ---
    const packages = await Package.find().populate('activities');

    const withRatings = await Promise.all(
      packages.map(async (pkg) => {
        // This part remains inefficient; the aggregation method in getPackageById is better.
        // However, keeping it as is to only address the 'activities' update.
        const reviews = await Review.find({ package: pkg._id });
        const reviewCount = reviews.length;
        const avgRating = reviewCount
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
          : 0;

        return {
          ...pkg.toObject(),
          avgRating,
          reviewCount,
        };
      })
    );

    res.json(withRatings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching packages", error: err.message });
  }
};

// Get single package by ID with populated activities, reviews, and stats
export const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    // --- Populated 'activities' to include their full details ---
    const pkg = await Package.findById(id)
      .populate('activities') // Fetches the full activity documents
      .lean();

    if (!pkg) return res.status(404).json({ message: "Package not found" });

    const reviews = await Review.find({ package: id }).lean();

    const stats = await Review.aggregate([
      { $match: { package: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: "$package", avgRating: { $avg: "$rating" }, reviewCount: { $sum: 1 } } },
    ]);

    const { avgRating = 0, reviewCount = 0 } = stats[0] || {};

    res.json({ ...pkg, reviews, avgRating, reviewCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching package", error: err.message });
  }
};

// Create new package - UPDATED
export const createPackage = async (req, res) => {
  try {
    const { name, description, price, duration, category, pickupTime, dropTime } = req.body;
    
    // --- Parse points and new activities field from request body ---
    const points = JSON.parse(req.body.points || "[]");
    const activities = JSON.parse(req.body.activities || "[]"); // Parse activities
    // --- End of parsing ---

    const images = req.files?.map(f => f.path) || [];

    const newPackage = new Package({
      name,
      description,
      price,
      duration,
      category,
      pickupTime,
      dropTime,
      images,
      points,
      activities, // Add activities to the new package
    });

    const saved = await newPackage.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating package", error: err.message });
  }
};

// Update package - UPDATED
export const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, description, price, duration, category, existingImages, points, pickupTime, dropTime, activities } = req.body;

    // --- Safely parse points, images, and new activities field ---
    const parsedPoints = points ? JSON.parse(points) : [];
    const parsedActivities = activities ? JSON.parse(activities) : []; // Parse activities
    
    let parsedExistingImages = [];
    if (existingImages) {
        parsedExistingImages = Array.isArray(existingImages)
        ? existingImages
        : JSON.parse(existingImages);
    }
    // --- End of parsing ---
    
    const newImages = req.files?.map(f => f.path) || [];
    const images = [...parsedExistingImages, ...newImages];

    const updated = await Package.findByIdAndUpdate(
      id,
      { 
        name, 
        description, 
        price, 
        duration, 
        category, 
        images, 
        points: parsedPoints,
        pickupTime,
        dropTime,
        activities: parsedActivities, // Add activities to the update object
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Package not found" });

    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Error updating package", error: err.message });
  }
};

// Delete package (unchanged)
export const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Package.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Package not found" });

    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting package", error: err.message });
  }
};