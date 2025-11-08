// models/Enquiry.js
import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" }, // It's good practice to keep this if you might use it later
    name: { type: String, required: true },
    countryCode: { type: String, required: true },
    phone: { type: String, required: true },
    status: { type: Number, default: 0 }, // 0 for Pending, 1 for Approved
  },
  { timestamps: true }
);

export default mongoose.model("Enquiry", enquirySchema);