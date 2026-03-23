import { body, query } from "express-validator";
import { paginationValidation } from "./common.validator.js";

export const createDonationValidation = [
  body("amount").isFloat({ min: 1 }).withMessage("Donation amount must be at least 1."),
  body("donorName").optional().trim().isLength({ max: 120 }),
  body("email").optional().isEmail().normalizeEmail(),
  body("note").optional().trim().isLength({ max: 500 }),
];

export const donationQueryValidation = [
  ...paginationValidation,
  query("status").optional().isIn(["pending", "completed", "failed"]),
];

export const updateDonationStatusValidation = [
  body("status")
    .isIn(["pending", "completed", "failed"])
    .withMessage("Valid donation status is required."),
];
