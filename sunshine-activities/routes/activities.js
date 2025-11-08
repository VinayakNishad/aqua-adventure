import express from "express";
import upload from "../config/multerCloudinary.js"; // Import your Cloudinary upload middleware
import {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/activityController.js";

const router = express.Router();

// Get all activities
router.get("/", getActivities);

// Get single activity by id
router.get("/:id", getActivityById);

// Create a new activity, allowing up to 5 images
router.post("/", upload.array("images", 5), createActivity);

// Update an activity, allowing up to 5 new images to replace old ones
router.put("/:id", upload.array("images", 5), updateActivity);

// Delete an activity
router.delete("/:id", deleteActivity);

export default router;