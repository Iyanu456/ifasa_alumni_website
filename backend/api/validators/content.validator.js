import { body, query } from "express-validator";
import { paginationValidation } from "./common.validator.js";

const isFutureDate = (value) => {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error("Valid date is required.");
  }

  if (parsed.getTime() <= Date.now()) {
    throw new Error("Date must be in the future.");
  }

  return true;
};

export const eventQueryValidation = [
  ...paginationValidation,
  query("category").optional().isString().trim(),
  query("timeframe").optional().isIn(["upcoming", "past", "all"]),
  query("isPublished").optional().isBoolean(),
  query("isFeatured").optional().isBoolean(),
];

export const createEventValidation = [
  body("title").trim().isLength({ min: 3, max: 160 }),
  body("category")
    .trim()
    .isIn([
      "Networking",
      "Workshop",
      "Conference",
      "Meetup",
      "Seminar",
      "Talk",
      "Reunion",
      "Other",
    ]),
  body("date")
    .isISO8601()
    .withMessage("Valid event date is required.")
    .bail()
    .custom(isFutureDate),
  body("location").trim().isLength({ min: 2, max: 160 }),
  body("description").trim().isLength({ min: 10, max: 4000 }),
  body("registrationLink").optional().isURL(),
  body("rsvp").optional().isURL(),
  body("isPublished").optional().isBoolean(),
  body("isFeatured").optional().isBoolean(),
];

export const updateEventValidation = [
  body("title").optional().trim().isLength({ min: 3, max: 160 }),
  body("category")
    .optional()
    .trim()
    .isIn([
      "Networking",
      "Workshop",
      "Conference",
      "Meetup",
      "Seminar",
      "Talk",
      "Reunion",
      "Other",
    ]),
  body("date").optional().isISO8601().bail().custom(isFutureDate),
  body("location").optional().trim().isLength({ min: 2, max: 160 }),
  body("description").optional().trim().isLength({ min: 10, max: 4000 }),
  body("registrationLink").optional().isURL(),
  body("rsvp").optional().isURL(),
  body("isPublished").optional().isBoolean(),
  body("isFeatured").optional().isBoolean(),
];

export const opportunityQueryValidation = [
  ...paginationValidation,
  query("category").optional().isString().trim(),
  query("status").optional().isIn(["open", "closed"]),
  query("isFeatured").optional().isBoolean(),
];

export const createOpportunityValidation = [
  body("title").trim().isLength({ min: 3, max: 160 }),
  body("organization").trim().isLength({ min: 2, max: 160 }),
  body("category")
    .trim()
    .isIn([
      "Job",
      "Internship",
      "Scholarship",
      "Grant",
      "Fellowship",
      "Competition",
      "Other",
    ]),
  body("description").trim().isLength({ min: 10, max: 4000 }),
  body("location").optional().trim().isLength({ max: 160 }),
  body("deadline").optional().isISO8601().bail().custom(isFutureDate),
  body("applicationLink").optional().isURL(),
  body("link").optional().isURL(),
  body("status").optional().isIn(["open", "closed"]),
  body("isFeatured").optional().isBoolean(),
];

export const updateOpportunityValidation = [
  body("title").optional().trim().isLength({ min: 3, max: 160 }),
  body("organization").optional().trim().isLength({ min: 2, max: 160 }),
  body("category")
    .optional()
    .trim()
    .isIn([
      "Job",
      "Internship",
      "Scholarship",
      "Grant",
      "Fellowship",
      "Competition",
      "Other",
    ]),
  body("description").optional().trim().isLength({ min: 10, max: 4000 }),
  body("location").optional().trim().isLength({ max: 160 }),
  body("deadline").optional().isISO8601().bail().custom(isFutureDate),
  body("applicationLink").optional().isURL(),
  body("link").optional().isURL(),
  body("status").optional().isIn(["open", "closed"]),
  body("isFeatured").optional().isBoolean(),
];

export const newsQueryValidation = [
  ...paginationValidation,
  query("status").optional().isIn(["draft", "published"]),
];

export const createNewsValidation = [
  body("title").trim().isLength({ min: 3, max: 180 }),
  body("excerpt").optional().trim().isLength({ max: 500 }),
  body("content").trim().isLength({ min: 20, max: 10000 }),
  body("status").optional().isIn(["draft", "published"]),
  body("isFeatured").optional().isBoolean(),
];

export const updateNewsValidation = [
  body("title").optional().trim().isLength({ min: 3, max: 180 }),
  body("excerpt").optional().trim().isLength({ max: 500 }),
  body("content").optional().trim().isLength({ min: 20, max: 10000 }),
  body("status").optional().isIn(["draft", "published"]),
  body("isFeatured").optional().isBoolean(),
];

export const galleryQueryValidation = [
  ...paginationValidation,
  query("category").optional().isString().trim(),
];

export const createGalleryValidation = [
  body("title").trim().isLength({ min: 2, max: 160 }),
  body("altText").optional().trim().isLength({ max: 200 }),
  body("category")
    .optional()
    .isIn(["Events", "Reunions", "Campus", "Workshops", "Other"]),
  body("capturedAt").optional().isISO8601(),
  body("isPublished").optional().isBoolean(),
];

export const updateGalleryValidation = [
  body("title").optional().trim().isLength({ min: 2, max: 160 }),
  body("altText").optional().trim().isLength({ max: 200 }),
  body("category")
    .optional()
    .isIn(["Events", "Reunions", "Campus", "Workshops", "Other"]),
  body("capturedAt").optional().isISO8601(),
  body("isPublished").optional().isBoolean(),
];
