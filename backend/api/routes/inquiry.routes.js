import { Router } from "express";
import {
  createContactMessageController,
  createSponsorshipController,
  listContactMessagesController,
  listSponsorshipsController,
  updateContactStatusController,
  updateSponsorshipStatusController,
} from "../controllers/inquiry.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { mongoIdParamValidation } from "../validators/common.validator.js";
import {
  contactQueryValidation,
  createContactValidation,
  createSponsorshipValidation,
  sponsorshipQueryValidation,
  updateContactStatusValidation,
  updateSponsorshipStatusValidation,
} from "../validators/inquiry.validator.js";

const router = Router();

router.post("/contact", createContactValidation, validateRequest, createContactMessageController);
router.post(
  "/sponsorships",
  createSponsorshipValidation,
  validateRequest,
  createSponsorshipController,
);
router.get(
  "/contact",
  protect,
  authorize("admin"),
  contactQueryValidation,
  validateRequest,
  listContactMessagesController,
);
router.patch(
  "/contact/:id/status",
  protect,
  authorize("admin"),
  mongoIdParamValidation,
  updateContactStatusValidation,
  validateRequest,
  updateContactStatusController,
);
router.get(
  "/sponsorships",
  protect,
  authorize("admin"),
  sponsorshipQueryValidation,
  validateRequest,
  listSponsorshipsController,
);
router.patch(
  "/sponsorships/:id/status",
  protect,
  authorize("admin"),
  mongoIdParamValidation,
  updateSponsorshipStatusValidation,
  validateRequest,
  updateSponsorshipStatusController,
);

export default router;
