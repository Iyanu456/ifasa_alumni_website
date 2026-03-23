import { body, query } from "express-validator";
import { paginationValidation } from "./common.validator.js";

export const publicAlumniQueryValidation = [
  ...paginationValidation,
  query("graduationYear").optional().isString().trim(),
];

export const adminAlumniQueryValidation = [
  ...paginationValidation,
  query("graduationYear").optional().isString().trim(),
  query("status").optional().isIn(["pending", "approved"]),
  query("isVerified").optional().isBoolean(),
  query("isProfileComplete").optional().isBoolean(),
];

export const updateAlumniValidation = [
  body("fullName").optional().trim().isLength({ min: 2, max: 120 }),
  body("phone").optional().trim().isLength({ min: 5, max: 30 }),
  body("graduationYear").optional().trim().notEmpty(),
  body("degree").optional().trim().notEmpty(),
  body("specialization").optional().trim().isLength({ max: 120 }),
  body("currentRole").optional().trim().isLength({ max: 120 }),
  body("company").optional().trim().isLength({ max: 120 }),
  body("location").optional().trim().isLength({ max: 120 }),
  body("bio").optional().trim().isLength({ max: 1000 }),
  body("avatarUrl").optional().isURL(),
  body("status").optional().isIn(["pending", "approved"]),
  body("associationRoleTitle").optional().trim().isLength({ max: 120 }),
  body("spotlightQuote").optional().trim().isLength({ max: 500 }),
  body("isMentorAvailable").optional().isBoolean(),
  body("isSpotlight").optional().isBoolean(),
];

export const updateOwnProfileValidation = [
  body("fullName").trim().isLength({ min: 2, max: 120 }),
  body("phone").trim().isLength({ min: 5, max: 30 }),
  body("graduationYear").trim().notEmpty(),
  body("degree").trim().notEmpty(),
  body("specialization").optional().trim().isLength({ max: 120 }),
  body("currentRole").optional().trim().isLength({ max: 120 }),
  body("company").optional().trim().isLength({ max: 120 }),
  body("location").optional().trim().isLength({ max: 120 }),
  body("bio").optional().trim().isLength({ max: 1000 }),
  body("avatarUrl").optional().isURL(),
  body("consent")
    .custom((value) => value === true || value === "true")
    .withMessage("Consent is required."),
];
