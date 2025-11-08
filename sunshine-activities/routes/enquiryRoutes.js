// routes/enquiry.js
import express from "express";
import Enquiry from "../models/Enquiry.js";

const router = express.Router();

// --- Create a new enquiry ---
router.post("/", async (req, res) => {
  try {
    const { packageId, name, countryCode, phone } = req.body;

    if (!name || !countryCode || !phone) {
      return res.status(400).json({ message: "Name, countryCode, and phone are required" });
    }

    if (!packageId) {
      return res.status(400).json({ message: "A packageId is required" });
    }

    // The 'status' field will automatically default to 0 (Pending)
    const enquiry = await Enquiry.create({
      packageId: packageId || undefined,
      name,
      countryCode,
      phone,
    });

    res.status(201).json(enquiry);
  } catch (err) {
    console.error("Error saving enquiry:", err);
    res.status(500).json({ message: "Error saving enquiry", error: err.message });
  }
});

// --- Get all enquiries ---
router.get("/", async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("packageId") 
      .sort({ createdAt: -1 }); // Latest first
    res.json(enquiries);
  } catch (err) {
    console.error("Error fetching enquiries:", err);
    res.status(500).json({ message: "Error fetching enquiries", error: err.message });
  }
});

// --- NEW: Approve an enquiry ---
router.put("/:id/approve", async (req, res) => {
    try {
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { status: 1 }, // Set status to 1 (Approved)
            { new: true }    // Return the updated document
        );

        if (!updatedEnquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        res.json({ message: "Enquiry approved successfully", enquiry: updatedEnquiry });
    } catch (err) {
        console.error("Error approving enquiry:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// --- NEW: Reject (Delete) an enquiry ---
router.delete("/:id", async (req, res) => {
    try {
        const deletedEnquiry = await Enquiry.findByIdAndDelete(req.params.id);

        if (!deletedEnquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        res.json({ message: "Enquiry rejected and deleted successfully" });
    } catch (err) {
        console.error("Error deleting enquiry:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});


export default router;