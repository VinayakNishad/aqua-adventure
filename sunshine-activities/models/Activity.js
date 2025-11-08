import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
});

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: String,
  description: String,
  duration: String,
  category: String,
  images: [imageSchema], // Use the new image sub-schema
});

export default mongoose.model("Activity", activitySchema);