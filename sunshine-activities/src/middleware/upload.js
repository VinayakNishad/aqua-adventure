import multer from "multer";
import ApiError from "../utils/ApiError.js";
import { uploadImage } from "../services/cloudinaryService.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const parser = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) return cb(null, true);
    cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`));
  },
});

/**
 * Uploads parsed files to Cloudinary and exposes them as `{ url, publicId }`
 * on `req.uploadedFiles` (array) and `req.uploadedFile` (single).
 */
const toCloudinary = async (req, _res, next) => {
  const files = req.files ?? (req.file ? [req.file] : []);
  req.uploadedFiles = await Promise.all(files.map((file) => uploadImage(file.buffer)));
  req.uploadedFile = req.uploadedFiles[0];
  next();
};

export const uploadSingle = (field) => [parser.single(field), toCloudinary];
export const uploadMany = (field, maxCount) => [parser.array(field, maxCount), toCloudinary];
