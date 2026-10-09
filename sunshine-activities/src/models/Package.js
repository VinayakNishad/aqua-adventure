import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    pickupTime: { type: String, required: true },
    dropTime: { type: String, required: true },
    duration: { type: String, trim: true },
    category: { type: String, trim: true },
    images: [String],
    points: [String],
    activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

packageSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "package",
});

export default mongoose.model("Package", packageSchema);
