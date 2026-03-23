import { param, query } from "express-validator";

export const paginationValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be at least 1."),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100."),
  query("sort").optional().isString().trim(),
  query("order").optional().isIn(["asc", "desc"]),
  query("search").optional().isString().trim().isLength({ max: 120 }),
];

export const mongoIdParamValidation = [
  param("id").notEmpty().withMessage("Resource identifier is required."),
];
