import { Router } from "express";
import * as adController from "../controllers/adController.js";
import { requireAdmin } from "../middleware/auth.js";
import { uploadSingle } from "../middleware/upload.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = Router();

router
  .route("/")
  .get(adController.getAds)
  .post(requireAdmin, uploadSingle("image"), adController.createAd);

router.delete("/:id", validateObjectId(), requireAdmin, adController.deleteAd);

export default router;
