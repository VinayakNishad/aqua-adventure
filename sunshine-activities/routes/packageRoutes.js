import express from "express";
import {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";
import upload from "../config/multerCloudinary.js";

const router = express.Router();

// Routes (Unchanged)
router.post("/", upload.array("images", 10), createPackage); // Create package
router.put("/:id", upload.array("images", 10), updatePackage); // Update package
router.get("/", getPackages); // Get all packages
router.get("/:id", getPackageById); // Get single package
router.delete("/:id", deletePackage); // Delete package

export default router;