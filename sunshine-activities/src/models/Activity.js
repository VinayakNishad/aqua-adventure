import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
});

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, trim: true },
    description: { type: String, trim: true },
    duration: { type: String, trim: true },
    category: { type: String, trim: true },
    images: [imageSchema],
  },
  { timestamps: true },
);

export default mongoose.model("Activity", activitySchema);
