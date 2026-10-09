import { Router } from "express";
import { getGooglePhotos, getGoogleReviews } from "../controllers/googleController.js";

const router = Router();

router.get("/reviews", getGoogleReviews);
router.get("/photos", getGooglePhotos);

export default router;
