import { Router } from "express";
import {
  createDonationController,
  getAdminDonationsController,
  getDonationSummaryController,
  updateDonationStatusController,
} from "../controllers/donation.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { mongoIdParamValidation } from "../validators/common.validator.js";
import {
  createDonationValidation,
  donationQueryValidation,
  updateDonationStatusValidation,
} from "../validators/donation.validator.js";

const router = Router();

router.get("/summary", getDonationSummaryController);
router.post("/", createDonationValidation, validateRequest, createDonationController);
router.get(
  "/admin",
  protect,
  authorize("admin"),
  donationQueryValidation,
  validateRequest,
  getAdminDonationsController,
);
router.patch(
  "/:id/status",
  protect,
  authorize("admin"),
  mongoIdParamValidation,
  updateDonationStatusValidation,
  validateRequest,
  updateDonationStatusController,
);

export default router;
