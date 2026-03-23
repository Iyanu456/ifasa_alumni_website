import { Router } from "express";
import adminRoutes from "./admin.routes.js";
import alumniRoutes from "./alumni.routes.js";
import authRoutes from "./auth.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import donationRoutes from "./donation.routes.js";
import executiveRoutes from "./executive.routes.js";
import eventRoutes from "./event.routes.js";
import galleryRoutes from "./gallery.routes.js";
import healthRoutes from "./health.routes.js";
import inquiryRoutes from "./inquiry.routes.js";
import newsRoutes from "./news.routes.js";
import opportunityRoutes from "./opportunity.routes.js";
import settingsRoutes from "./settings.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/alumni", alumniRoutes);
router.use("/events", eventRoutes);
router.use("/opportunities", opportunityRoutes);
router.use("/news", newsRoutes);
router.use("/gallery", galleryRoutes);
router.use("/donations", donationRoutes);
router.use("/executives", executiveRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/settings", settingsRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/users", userRoutes);

export default router;
