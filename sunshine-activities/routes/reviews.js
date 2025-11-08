// routes/reviewRoutes.js
import express from "express";
import upload from "../config/multerCloudinary.js";
import { createReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:type/:id", getReviews); 

// Create review
router.post("/", upload.single("image"), createReview);

export default router;
