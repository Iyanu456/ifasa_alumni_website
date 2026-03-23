import { Router } from "express";
import {
  approveAlumnusById,
  createAlumnusByAdmin,
  deleteAlumnusById,
  getExecutiveAlumniList,
  getAdminAlumniList,
  getAdminAlumnusById,
  getPublicAlumniList,
  getPublicAlumnusById,
  updateAlumnusById,
} from "../controllers/user.controller.js";
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { mongoIdParamValidation } from "../validators/common.validator.js";
import {
  adminAlumniQueryValidation,
  createAlumniValidation,
  publicAlumniQueryValidation,
  updateAlumniValidation,
} from "../validators/user.validator.js";

const router = Router();

router.get("/", publicAlumniQueryValidation, validateRequest, getPublicAlumniList);
router.get("/executives", getExecutiveAlumniList);
router.post(
  "/admin",
  protect,
  authorizeRoles("admin"),
  createAlumniValidation,
  validateRequest,
  createAlumnusByAdmin,
);
router.get("/admin", protect, authorizeRoles("admin"), adminAlumniQueryValidation, validateRequest, getAdminAlumniList);
router.get(
  "/admin/:id",
  protect,
  authorizeRoles("admin"),
  mongoIdParamValidation,
  validateRequest,
  getAdminAlumnusById,
);
router.patch(
  "/:id/approve",
  protect,
  authorizeRoles("admin"),
  mongoIdParamValidation,
  validateRequest,
  approveAlumnusById,
);
router.patch(
  "/:id",
  protect,
  authorizeRoles("admin"),
  mongoIdParamValidation,
  updateAlumniValidation,
  validateRequest,
  updateAlumnusById,
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  mongoIdParamValidation,
  validateRequest,
  deleteAlumnusById,
);
router.get("/:id", mongoIdParamValidation, validateRequest, getPublicAlumnusById);

export default router;
