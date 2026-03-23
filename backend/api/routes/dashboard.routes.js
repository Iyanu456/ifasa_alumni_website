import { Router } from "express";
import {
  getAdminDashboardController,
  getPublicHomeDashboardController,
} from "../controllers/dashboard.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/home", getPublicHomeDashboardController);
router.get("/admin", protect, authorize("admin"), getAdminDashboardController);

export default router;
