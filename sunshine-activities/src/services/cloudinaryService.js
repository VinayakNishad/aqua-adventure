import cloudinary from "../config/cloudinary.js";
import logger from "../utils/logger.js";

const UPLOAD_OPTIONS = {
  folder: "uploads",
  resource_type: "image",
  transformation: [
    {
      width: 1600,
      height: 1600,
      crop: "limit",
      dpr: "auto",
      flags: "progressive",
      quality: "auto:good",
      fetch_format: "auto",
    },
  ],
};

export const uploadImage = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(UPLOAD_OPTIONS, (error, result) => {
      if (error) return reject(error);
      resolve({ url: result.secure_url, publicId: result.public_id });
    });
    stream.end(buffer);
  });

/** Best-effort deletion; a Cloudinary failure must not fail the request. */
export const deleteImages = async (publicIds = []) => {
  const results = await Promise.allSettled(
    publicIds.filter(Boolean).map((id) => cloudinary.uploader.destroy(id)),
  );
  results
    .filter((r) => r.status === "rejected")
    .forEach((r) => logger.warn("Failed to delete Cloudinary image", r.reason));
};
