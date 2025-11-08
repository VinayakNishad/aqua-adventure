import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  
  pickupTime: { type: String, required: true },
  dropTime: { type: String, required: true },

  duration: String, 
  category: String, 
  images: [String],
  points: [{ type: String }],

  // --- New field for Activities ---
  // This will store an array of IDs linking to documents in the 'Activity' collection.
  activities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity' // Assumes your Activity model is named 'Activity'
  }],
  // --- End of new field ---
});

// Virtual relation with Review (unchanged)
packageSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "package",
});

packageSchema.set("toObject", { virtuals: true });
packageSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Package", packageSchema);