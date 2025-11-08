import express from "express";
import Ad from "../models/Ad.js";
import upload from "../config/multerCloudinary.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Get all ads
router.get("/", async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 }); // latest first
    res.json(ads);
  } catch (err) {
    console.error("Failed to fetch ads:", err);
    res.status(500).json({ error: "Failed to fetch ads" });
  }
});
// Upload new ad (Cloudinary)
router.post("/", upload.single("image"), async (req, res) => {
  console.log("req.file:", req.file); // Check if multer processed the file
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const ad = new Ad({
      imageUrl: req.file.path,    // Cloudinary URL
      publicId: req.file.filename // Cloudinary public ID
    });

    await ad.save();
    res.status(201).json(ad);
  } catch (err) {
    console.error("Error uploading ad:", err);           // log full error
    console.error("Error details:", err.message, err.stack); // log stack trace
    res.status(500).json({ error: err.message || "Failed to upload ad" });
  }
});

// Delete ad
router.delete("/:id", async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ error: "Ad not found" });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(ad.publicId);

    // Delete from DB
    await ad.deleteOne();
    res.json({ message: "Ad deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete ad" });
  }
});

export default router;
