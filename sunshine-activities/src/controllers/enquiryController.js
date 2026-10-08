import mongoose from "mongoose";
import Enquiry, { ENQUIRY_STATUS } from "../models/Enquiry.js";
import ApiError from "../utils/ApiError.js";

export const createEnquiry = async (req, res) => {
  const { packageId, name, countryCode, phone } = req.body ?? {};

  if (!name || !countryCode || !phone) {
    throw ApiError.badRequest("Name, countryCode, and phone are required");
  }
  if (!packageId || !mongoose.isValidObjectId(packageId)) {
    throw ApiError.badRequest("A valid packageId is required");
  }

  const enquiry = await Enquiry.create({ packageId, name, countryCode, phone });
  res.status(201).json(enquiry);
};

export const getEnquiries = async (_req, res) => {
  const enquiries = await Enquiry.find().populate("packageId").sort({ createdAt: -1 }).lean();
  res.json(enquiries);
};

export const approveEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { status: ENQUIRY_STATUS.APPROVED },
    { returnDocument: "after" },
  );
  if (!enquiry) throw ApiError.notFound("Enquiry not found");

  res.json({ message: "Enquiry approved successfully", enquiry });
};

export const deleteEnquiry = async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
  if (!enquiry) throw ApiError.notFound("Enquiry not found");

  res.json({ message: "Enquiry rejected and deleted successfully" });
};
