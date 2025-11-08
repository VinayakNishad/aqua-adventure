import Video from "../models/Video.js";

// Add new video
// Add new video
export const addVideo = async (req, res) => {
  try {
    const { link } = req.body;

    if (!link) {
      return res.status(400).json({ message: "Link is required" });
    }

    const existingVideo = await Video.findOne({ url: link });
    if (existingVideo) {
      return res.status(400).json({ message: "Video already exists" });
    }

    const newVideo = await Video.create({ url: link });

    // Send both message and video
    res.status(201).json({ message: "Video added successfully!", video: newVideo });
  } catch (error) {
    console.error("Error adding video:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Get all videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Server error" });
  }
};
