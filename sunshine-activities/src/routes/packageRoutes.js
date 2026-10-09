import { Router } from "express";
import * as packageController from "../controllers/packageController.js";
import { requireAdmin } from "../middleware/auth.js";
import { uploadMany } from "../middleware/upload.js";
import validateObjectId from "../middleware/validateObjectId.js";

const MAX_IMAGES = 10;
const router = Router();

router
  .route("/")
  .get(packageController.getPackages)
  .post(requireAdmin, uploadMany("images", MAX_IMAGES), packageController.createPackage);

router
  .route("/:id")
  .all(validateObjectId())
  .get(packageController.getPackageById)
  .put(requireAdmin, uploadMany("images", MAX_IMAGES), packageController.updatePackage)
  .delete(requireAdmin, packageController.deletePackage);

export default router;
