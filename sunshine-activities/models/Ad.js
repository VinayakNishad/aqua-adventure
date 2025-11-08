import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },  // Cloudinary URL
    publicId: { type: String, required: true },  // for deleting from Cloudinary
  },
  { timestamps: true }
);

const Ad = mongoose.model("Ad", adSchema);
export default Ad;
