import { Router } from "express";
import * as reviewController from "../controllers/reviewController.js";
import { publicWriteLimiter } from "../middleware/rateLimiter.js";
import { uploadSingle } from "../middleware/upload.js";

const router = Router();

router.get("/:type/:id", reviewController.getReviews);
router.post("/", publicWriteLimiter, uploadSingle("image"), reviewController.createReview);

export default router;
