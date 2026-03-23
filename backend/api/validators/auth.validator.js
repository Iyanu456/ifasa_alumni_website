import { body, query } from "express-validator";

export const registerValidation = [
  /*body("fullName")
    .trim()
    .isLength({ min: 2, max: 120 })
    .withMessage("Full name must be between 2 and 120 characters."),*/
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  /*body("phone")
    .trim()
    .isLength({ min: 5, max: 30 })
    .withMessage("Phone number is required."),
  body("graduationYear")
    .trim()
    .notEmpty()
    .withMessage("Graduation year is required."),
  body("degree").trim().notEmpty().withMessage("Degree is required."),
  body("specialization").optional().trim().isLength({ max: 120 }),
  body("currentRole").optional().trim().isLength({ max: 120 }),
  body("company").optional().trim().isLength({ max: 120 }),
  body("location").optional().trim().isLength({ max: 120 }),
  body("bio").optional().trim().isLength({ max: 1000 }),
  body("consent")
    .custom((value) => value === true || value === "true")
    .withMessage("Consent is required."),*/
];

export const loginValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

export const googleInitiateValidation = [
  query("mode").optional().isIn(["redirect", "json"]),
  query("redirectUri").optional().isString().trim().isLength({ max: 500 }),
];

export const resendVerificationValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required."),
];

export const forgotPasswordValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required."),
];

export const resetPasswordValidation = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];
