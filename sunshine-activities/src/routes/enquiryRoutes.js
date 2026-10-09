import { Router } from "express";
import * as enquiryController from "../controllers/enquiryController.js";
import { requireAdmin } from "../middleware/auth.js";
import { publicWriteLimiter } from "../middleware/rateLimiter.js";
import validateObjectId from "../middleware/validateObjectId.js";

const router = Router();

router
  .route("/")
  .get(requireAdmin, enquiryController.getEnquiries)
  .post(publicWriteLimiter, enquiryController.createEnquiry);

router.put("/:id/approve", validateObjectId(), requireAdmin, enquiryController.approveEnquiry);
router.delete("/:id", validateObjectId(), requireAdmin, enquiryController.deleteEnquiry);

export default router;
