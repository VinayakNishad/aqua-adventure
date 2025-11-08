import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    package: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Package" 
    },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    image: String,
  },
  { timestamps: true }
);


export default mongoose.model("Review", reviewSchema);
