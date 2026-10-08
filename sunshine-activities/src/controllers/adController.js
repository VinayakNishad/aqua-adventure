import Ad from "../models/Ad.js";
import ApiError from "../utils/ApiError.js";
import { deleteImages } from "../services/cloudinaryService.js";

export const getAds = async (_req, res) => {
  const ads = await Ad.find().sort({ createdAt: -1 }).lean();
  res.json(ads);
};

export const createAd = async (req, res) => {
  if (!req.uploadedFile) throw ApiError.badRequest("No file uploaded");

  const ad = await Ad.create({
    imageUrl: req.uploadedFile.url,
    publicId: req.uploadedFile.publicId,
  });
  res.status(201).json(ad);
};

export const deleteAd = async (req, res) => {
  const ad = await Ad.findByIdAndDelete(req.params.id);
  if (!ad) throw ApiError.notFound("Ad not found");

  await deleteImages([ad.publicId]);
  res.json({ message: "Ad deleted" });
};
