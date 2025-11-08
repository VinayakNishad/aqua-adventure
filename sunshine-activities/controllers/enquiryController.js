import Enquiry from "../models/Enquiry.js";

export const createEnquiry = async (req, res) => {
  try {
    const { name, phone, countryCode, packageId } = req.body;

    if (!name || !phone || !countryCode) {
      return res.status(400).json({ message: "Name, phone, and countryCode are required" });
    }

    // Ensure at least one of activityId or packageId is provided
    if (!packageId) {
      return res.status(400).json({ message: "Either activityId or packageId is required" });
    }

    const enquiry = new Enquiry({
      name,
      phone,
      countryCode,
      packageId: packageId || undefined,
    });

    await enquiry.save();

    res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    res.status(500).json({ message: "Server error" });
  }
};
