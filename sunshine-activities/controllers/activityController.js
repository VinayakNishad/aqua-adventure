import Activity from "../models/Activity.js";
import cloudinary from "../config/cloudinary.js";

// Helper: Delete images from Cloudinary
const deleteImagesFromCloudinary = async (publicIds = []) => {
  try {
    const promises = publicIds.map((id) => cloudinary.uploader.destroy(id));
    await Promise.all(promises);
    console.log("Successfully deleted images from Cloudinary");
  } catch (err) {
    console.error("Failed to delete images from Cloudinary", err);
  }
};

// Get all activities
export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Error fetching activities" });
  }
};

// Get activity by id
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.json(activity);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create activity
export const createActivity = async (req, res) => {
  try {
    const { title, shortDescription, description, price, duration, category } = req.body;

    // Map uploaded files to the new image schema format
    const images = req.files ? req.files.map((f) => ({ url: f.path, public_id: f.filename })) : [];

    const activity = new Activity({
      title,
      shortDescription,
      description,
      duration,
      category,
      images,
    });

    const saved = await activity.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in createActivity:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update activity
export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    let updatedData = { ...req.body };

    // If new images are uploaded, delete the old ones from Cloudinary
    if (req.files && req.files.length > 0) {
      const oldImagePublicIds = activity.images.map((img) => img.public_id);
      if (oldImagePublicIds.length > 0) {
        await deleteImagesFromCloudinary(oldImagePublicIds);
      }
      // Set the new images
      updatedData.images = req.files.map((f) => ({ url: f.path, public_id: f.filename }));
    }

    const updated = await Activity.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (err) {
    console.error("Error in updateActivity:", err);
    res.status(500).json({ message: err.message });
  }
};

// Delete activity
export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;
    const activity = await Activity.findById(id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Delete associated images from Cloudinary
    const imagePublicIds = activity.images.map((img) => img.public_id);
    if (imagePublicIds.length > 0) {
      await deleteImagesFromCloudinary(imagePublicIds);
    }

    await Activity.findByIdAndDelete(id);

    res.json({ message: "Activity and related images deleted successfully" });
  } catch (err) {
    console.error("Error in deleteActivity:", err);
    res.status(500).json({ message: err.message });
  }
};