import { Router } from "express";
import {
  getPublicSettingsController,
  getSettingsController,
  updateSettingsController,
} from "../controllers/settings.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { updateSettingsValidation } from "../validators/settings.validator.js";

const router = Router();

router.get("/public", getPublicSettingsController);
router.get("/", protect, authorize("admin"), getSettingsController);
router.patch(
  "/",
  protect,
  authorize("admin"),
  updateSettingsValidation,
  validateRequest,
  updateSettingsController,
);

export default router;
