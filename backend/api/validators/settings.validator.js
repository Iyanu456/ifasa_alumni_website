import { body } from "express-validator";

export const updateSettingsValidation = [
  body("siteName").optional().trim().isLength({ min: 2, max: 160 }),
  body("siteDescription").optional().trim().isLength({ max: 500 }),
  body("contactEmail").optional().isEmail().normalizeEmail(),
  body("contactPhone").optional().trim().isLength({ max: 30 }),
  body("contactAddress").optional().trim().isLength({ max: 200 }),
  body("donationLink").optional().isURL(),
  body("instagram").optional().isURL(),
  body("linkedin").optional().isURL(),
  body("twitter").optional().isURL(),
  body("socialLinks.instagram").optional().isURL(),
  body("socialLinks.linkedin").optional().isURL(),
  body("socialLinks.twitter").optional().isURL(),
  body("allowRegistrations").optional().isBoolean(),
  body("enableDonations").optional().isBoolean(),
];
