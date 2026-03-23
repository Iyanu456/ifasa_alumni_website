import { Router } from "express";
import {
  getOwnProfileController,
  upsertOwnProfileController,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { singleImageUpload } from "../middlewares/upload.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { updateOwnProfileValidation } from "../validators/user.validator.js";

const router = Router();

router.get("/profile", protect, getOwnProfileController);
router.post(
  "/profile",
  protect,
  singleImageUpload(["avatar", "image", "profilePicture"]),
  updateOwnProfileValidation,
  validateRequest,
  upsertOwnProfileController,
);

export default router;
