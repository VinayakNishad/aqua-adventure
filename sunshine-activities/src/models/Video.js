import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export default mongoose.model("Video", videoSchema);
