import { body, query } from "express-validator";
import { paginationValidation } from "./common.validator.js";

export const createContactValidation = [
  body("name").trim().isLength({ min: 2, max: 120 }),
  body("email").isEmail().normalizeEmail(),
  body("message").trim().isLength({ min: 10, max: 3000 }),
];

export const contactQueryValidation = [
  ...paginationValidation,
  query("status").optional().isIn(["new", "read", "resolved"]),
];

export const updateContactStatusValidation = [
  body("status")
    .isIn(["new", "read", "resolved"])
    .withMessage("Valid contact status is required."),
];

export const createSponsorshipValidation = [
  body("name").trim().isLength({ min: 2, max: 120 }),
  body("email").isEmail().normalizeEmail(),
  body("organization").optional().trim().isLength({ max: 160 }),
  body("message").trim().isLength({ min: 10, max: 3000 }),
];

export const sponsorshipQueryValidation = [
  ...paginationValidation,
  query("status").optional().isIn(["new", "contacted", "closed"]),
];

export const updateSponsorshipStatusValidation = [
  body("status")
    .isIn(["new", "contacted", "closed"])
    .withMessage("Valid sponsorship status is required."),
];
