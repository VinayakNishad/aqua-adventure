// config/multerCloudinary.js
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "uploads", // all uploads go in this folder
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [
      {
        width: 1600,
        height: 1600,
        crop: "limit",
        quality: "auto:good",
        fetch_format: "auto",
      },
    ],
  },
});

const upload = multer({ storage });

export default upload;
