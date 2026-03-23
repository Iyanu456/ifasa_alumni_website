import { query } from "express-validator";
import { paginationValidation } from "./common.validator.js";

export const adminUsersQueryValidation = [
  ...paginationValidation,
  query("role").optional().isIn(["user", "admin", "alumnus"]),
  query("status").optional().isIn(["pending", "approved"]),
  query("authProvider").optional().isIn(["local", "google"]),
  query("isVerified").optional().isBoolean(),
  query("isProfileComplete").optional().isBoolean(),
];
