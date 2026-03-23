import { Router } from "express";
import {
  createEventController,
  deleteEventController,
  getAdminEvents,
  getEvent,
  getPublicEvents,
  updateEventController,
} from "../controllers/event.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { singleImageUpload } from "../middlewares/upload.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { mongoIdParamValidation } from "../validators/common.validator.js";
import {
  createEventValidation,
  eventQueryValidation,
  updateEventValidation,
} from "../validators/content.validator.js";

const router = Router();

router.get("/", eventQueryValidation, validateRequest, getPublicEvents);
router.get("/admin", protect, authorize("admin"), eventQueryValidation, validateRequest, getAdminEvents);
router.get("/:id", getEvent);
router.post(
  "/",
  protect,
  authorize("admin"),
  singleImageUpload(),
  createEventValidation,
  validateRequest,
  createEventController,
);
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  singleImageUpload(),
  mongoIdParamValidation,
  updateEventValidation,
  validateRequest,
  updateEventController,
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  mongoIdParamValidation,
  validateRequest,
  deleteEventController,
);

export default router;
