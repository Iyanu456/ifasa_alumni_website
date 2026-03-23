import { Router } from "express";
import {
  getOwnProfileController,
  upsertOwnProfileController,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { updateOwnProfileValidation } from "../validators/user.validator.js";

const router = Router();

router.get("/profile", protect, getOwnProfileController);
router.post(
  "/profile",
  protect,
  updateOwnProfileValidation,
  validateRequest,
  upsertOwnProfileController,
);

export default router;
