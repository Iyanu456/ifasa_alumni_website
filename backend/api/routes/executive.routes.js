import { Router } from "express";
import {
  createExecutiveController,
  deleteExecutiveController,
  getAdminExecutivesController,
  getExecutiveController,
  getPublicExecutivesController,
  updateExecutiveController,
} from "../controllers/executive.controller.js";
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";
import { singleImageUpload } from "../middlewares/upload.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { mongoIdParamValidation } from "../validators/common.validator.js";
import {
  createExecutiveValidation,
  executiveQueryValidation,
  updateExecutiveValidation,
} from "../validators/executive.validator.js";

const router = Router();

router.get("/", getPublicExecutivesController);
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  executiveQueryValidation,
  validateRequest,
  getAdminExecutivesController,
);
router.get("/:id", mongoIdParamValidation, validateRequest, getExecutiveController);
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  singleImageUpload(["image", "profilePicture"]),
  createExecutiveValidation,
  validateRequest,
  createExecutiveController,
);
router.patch(
  "/:id",
  protect,
  authorizeRoles("admin"),
  singleImageUpload(["image", "profilePicture"]),
  mongoIdParamValidation,
  updateExecutiveValidation,
  validateRequest,
  updateExecutiveController,
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  mongoIdParamValidation,
  validateRequest,
  deleteExecutiveController,
);

export default router;
