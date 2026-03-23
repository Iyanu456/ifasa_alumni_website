import fs from "fs/promises";
import { validationResult } from "express-validator";
import ApiError from "../utils/api-error.js";

const cleanupUploadedFiles = async (req) => {
  const filePaths = [];

  if (req.file?.path) {
    filePaths.push(req.file.path);
  }

  if (req.files) {
    Object.values(req.files)
      .flat()
      .forEach((file) => {
        if (file?.path) {
          filePaths.push(file.path);
        }
      });
  }

  await Promise.all(
    filePaths.map((filePath) =>
      fs.unlink(filePath).catch(() => {
        return null;
      }),
    ),
  );
};

export const validateRequest = async (req, _res, next) => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  await cleanupUploadedFiles(req);

  return next(
    new ApiError(422, "Request validation failed.", "VALIDATION_ERROR", result.array()),
  );
};
