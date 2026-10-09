import { Router } from "express";
import * as videoController from "../controllers/videoController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();

router.route("/").get(videoController.getVideos).post(requireAdmin, videoController.addVideo);

export default router;
