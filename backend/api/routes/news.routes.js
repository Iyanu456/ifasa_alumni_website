import { Router } from "express";
import {
  createNewsController,
  deleteNewsController,
  getAdminNewsController,
  getNewsController,
  getPublicNewsController,
  updateNewsController,
} from "../controllers/news.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { singleImageUpload } from "../middlewares/upload.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { mongoIdParamValidation } from "../validators/common.validator.js";
import {
  createNewsValidation,
  newsQueryValidation,
  updateNewsValidation,
} from "../validators/content.validator.js";

const router = Router();

router.get("/", newsQueryValidation, validateRequest, getPublicNewsController);
router.get("/admin", protect, authorize("admin"), newsQueryValidation, validateRequest, getAdminNewsController);
router.get("/:id", getNewsController);
router.post(
  "/",
  protect,
  authorize("admin"),
  singleImageUpload(),
  createNewsValidation,
  validateRequest,
  createNewsController,
);
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  singleImageUpload(),
  mongoIdParamValidation,
  updateNewsValidation,
  validateRequest,
  updateNewsController,
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  mongoIdParamValidation,
  validateRequest,
  deleteNewsController,
);

export default router;
