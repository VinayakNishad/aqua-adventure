import Activity from "../models/Activity.js";
import ApiError from "../utils/ApiError.js";
import { deleteImages } from "../services/cloudinaryService.js";

const EDITABLE_FIELDS = ["title", "shortDescription", "description", "duration", "category"];

const pick = (source, keys) =>
  Object.fromEntries(
    keys.filter((key) => source[key] !== undefined).map((key) => [key, source[key]]),
  );

const toImageDocs = (files = []) => files.map((f) => ({ url: f.url, public_id: f.publicId }));

export const getActivities = async (_req, res) => {
  const activities = await Activity.find().lean();
  res.json(activities);
};

export const getActivityById = async (req, res) => {
  const activity = await Activity.findById(req.params.id).lean();
  if (!activity) throw ApiError.notFound("Activity not found");
  res.json(activity);
};

export const createActivity = async (req, res) => {
  const activity = await Activity.create({
    ...pick(req.body, EDITABLE_FIELDS),
    images: toImageDocs(req.uploadedFiles),
  });
  res.status(201).json(activity);
};

export const updateActivity = async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) throw ApiError.notFound("Activity not found");

  activity.set(pick(req.body, EDITABLE_FIELDS));

  // New uploads replace the existing image set.
  if (req.uploadedFiles?.length > 0) {
    const oldPublicIds = activity.images.map((img) => img.public_id);
    activity.images = toImageDocs(req.uploadedFiles);
    await activity.save();
    await deleteImages(oldPublicIds);
  } else {
    await activity.save();
  }

  res.json(activity);
};

export const deleteActivity = async (req, res) => {
  const activity = await Activity.findByIdAndDelete(req.params.id);
  if (!activity) throw ApiError.notFound("Activity not found");

  await deleteImages(activity.images.map((img) => img.public_id));
  res.json({ message: "Activity and related images deleted successfully" });
};
