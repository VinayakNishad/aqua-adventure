import { Router } from "express";
import * as activityController from "../controllers/activityController.js";
import { requireAdmin } from "../middleware/auth.js";
import { uploadMany } from "../middleware/upload.js";
import validateObjectId from "../middleware/validateObjectId.js";

const MAX_IMAGES = 5;
const router = Router();

router
  .route("/")
  .get(activityController.getActivities)
  .post(requireAdmin, uploadMany("images", MAX_IMAGES), activityController.createActivity);

router
  .route("/:id")
  .all(validateObjectId())
  .get(activityController.getActivityById)
  .put(requireAdmin, uploadMany("images", MAX_IMAGES), activityController.updateActivity)
  .delete(requireAdmin, activityController.deleteActivity);

export default router;
