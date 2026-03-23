import { Router } from "express";
import {
  createGalleryItemController,
  deleteGalleryItemController,
  getAdminGalleryController,
  getGalleryItemController,
  getPublicGalleryController,
  updateGalleryItemController,
} from "../controllers/gallery.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { singleImageUpload } from "../middlewares/upload.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { mongoIdParamValidation } from "../validators/common.validator.js";
import {
  createGalleryValidation,
  galleryQueryValidation,
  updateGalleryValidation,
} from "../validators/content.validator.js";

const router = Router();

router.get("/", galleryQueryValidation, validateRequest, getPublicGalleryController);
router.get(
  "/admin",
  protect,
  authorize("admin"),
  galleryQueryValidation,
  validateRequest,
  getAdminGalleryController,
);
router.get("/:id", mongoIdParamValidation, validateRequest, getGalleryItemController);
router.post(
  "/",
  protect,
  authorize("admin"),
  singleImageUpload(),
  createGalleryValidation,
  validateRequest,
  createGalleryItemController,
);
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  singleImageUpload(),
  mongoIdParamValidation,
  updateGalleryValidation,
  validateRequest,
  updateGalleryItemController,
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  mongoIdParamValidation,
  validateRequest,
  deleteGalleryItemController,
);

export default router;
