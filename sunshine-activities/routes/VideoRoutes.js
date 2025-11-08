import express from "express";
import { addVideo, getVideos } from "../controllers/VideoController.js";

const router = express.Router();

// POST /api/videos  → add video
router.post("/", addVideo);

// GET /api/videos  → fetch all
router.get("/", getVideos);

export default router;
