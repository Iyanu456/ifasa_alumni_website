import { Router } from "express";
import {
  getAdminUserController,
  listAdminUsersController,
  makeAdminController,
  removeAdminController,
} from "../controllers/admin.controller.js";
import { authorizeRoles, protect } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { mongoIdParamValidation } from "../validators/common.validator.js";
import { adminUsersQueryValidation } from "../validators/admin.validator.js";

const router = Router();

router.use(protect, authorizeRoles("admin"));

router.get("/users", adminUsersQueryValidation, validateRequest, listAdminUsersController);
router.get(
  "/users/:id",
  mongoIdParamValidation,
  validateRequest,
  getAdminUserController,
);
router.patch(
  "/users/:id/make-admin",
  mongoIdParamValidation,
  validateRequest,
  makeAdminController,
);
router.patch(
  "/users/:id/remove-admin",
  mongoIdParamValidation,
  validateRequest,
  removeAdminController,
);

export default router;
