import { body, query } from "express-validator";
import { paginationValidation } from "./common.validator.js";

export const executiveQueryValidation = [
  ...paginationValidation,
  query("isPublished").optional().isBoolean(),
];

export const createExecutiveValidation = [
  body("name").trim().isLength({ min: 2, max: 120 }),
  body("email").isEmail().normalizeEmail(),
  body("role").trim().isLength({ min: 2, max: 120 }),
  body("position").trim().isLength({ min: 2, max: 120 }),
  body("title").trim().isLength({ min: 2, max: 160 }),
  body("sortOrder").optional().isInt({ min: 0 }),
  body("isPublished").optional().isBoolean(),
];

export const updateExecutiveValidation = [
  body("name").optional().trim().isLength({ min: 2, max: 120 }),
  body("email").optional().isEmail().normalizeEmail(),
  body("role").optional().trim().isLength({ min: 2, max: 120 }),
  body("position").optional().trim().isLength({ min: 2, max: 120 }),
  body("title").optional().trim().isLength({ min: 2, max: 160 }),
  body("sortOrder").optional().isInt({ min: 0 }),
  body("isPublished").optional().isBoolean(),
];
