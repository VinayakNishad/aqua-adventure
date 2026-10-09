import Video from "../models/Video.js";
import ApiError from "../utils/ApiError.js";

export const getVideos = async (_req, res) => {
  const videos = await Video.find().lean();
  res.json(videos);
};

export const addVideo = async (req, res) => {
  const link = req.body?.link?.trim();
  if (!link) throw ApiError.badRequest("Link is required");

  if (await Video.exists({ url: link })) throw ApiError.conflict("Video already exists");

  const video = await Video.create({ url: link });
  res.status(201).json({ message: "Video added successfully!", video });
};
