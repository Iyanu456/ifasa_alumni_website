import { Router } from "express";
import {
  createOpportunityController,
  deleteOpportunityController,
  getAdminOpportunities,
  getOpportunity,
  getPublicOpportunities,
  updateOpportunityController,
} from "../controllers/opportunity.controller.js";
import { authorize, protect } from "../middlewares/auth.middleware.js";
import { singleImageUpload } from "../middlewares/upload.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { mongoIdParamValidation } from "../validators/common.validator.js";
import {
  createOpportunityValidation,
  opportunityQueryValidation,
  updateOpportunityValidation,
} from "../validators/content.validator.js";

const router = Router();

router.get("/", opportunityQueryValidation, validateRequest, getPublicOpportunities);
router.get(
  "/admin",
  protect,
  authorize("admin"),
  opportunityQueryValidation,
  validateRequest,
  getAdminOpportunities,
);
router.get("/:id", getOpportunity);
router.post(
  "/",
  protect,
  authorize("admin"),
  singleImageUpload(),
  createOpportunityValidation,
  validateRequest,
  createOpportunityController,
);
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  singleImageUpload(),
  mongoIdParamValidation,
  updateOpportunityValidation,
  validateRequest,
  updateOpportunityController,
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  mongoIdParamValidation,
  validateRequest,
  deleteOpportunityController,
);

export default router;
