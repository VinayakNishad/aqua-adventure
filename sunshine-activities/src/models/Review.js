import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    package: { type: mongoose.Schema.Types.ObjectId, ref: "Package", index: true },
    userName: { type: String, required: true, trim: true, maxlength: 100 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 2000 },
    image: String,
  },
  { timestamps: true },
);

export default mongoose.model("Review", reviewSchema);
