import mongoose from "mongoose";

export const ENQUIRY_STATUS = Object.freeze({ PENDING: 0, APPROVED: 1 });

const enquirySchema = new mongoose.Schema(
  {
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    countryCode: { type: String, required: true, trim: true, maxlength: 6 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    status: {
      type: Number,
      enum: Object.values(ENQUIRY_STATUS),
      default: ENQUIRY_STATUS.PENDING,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Enquiry", enquirySchema);
