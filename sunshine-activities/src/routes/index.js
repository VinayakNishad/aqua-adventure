import { Router } from "express";
import activityRoutes from "./activityRoutes.js";
import adRoutes from "./adRoutes.js";
import enquiryRoutes from "./enquiryRoutes.js";
import googleRoutes from "./googleRoutes.js";
import packageRoutes from "./packageRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import videoRoutes from "./videoRoutes.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok" }));

router.use("/activities", activityRoutes);
router.use("/ads", adRoutes);
router.use("/enquiries", enquiryRoutes);
router.use("/google", googleRoutes);
router.use("/packages", packageRoutes);
router.use("/reviews", reviewRoutes);
router.use("/videos", videoRoutes);

export default router;
