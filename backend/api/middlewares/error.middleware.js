import mongoose from "mongoose";
import env from "../config/env.js";
import { logger } from "../config/logger.js";
import ApiError from "../utils/api-error.js";

export const notFoundHandler = (req, _res, next) => {
  next(
    new ApiError(
      404,
      `Route not found: ${req.method} ${req.originalUrl}`,
      "ROUTE_NOT_FOUND",
    ),
  );
};

export const errorHandler = (error, req, res, _next) => {
  let normalizedError = error;

  if (normalizedError instanceof mongoose.Error.ValidationError) {
    normalizedError = new ApiError(
      400,
      "Validation failed.",
      "VALIDATION_ERROR",
      Object.values(normalizedError.errors).map((item) => ({
        field: item.path,
        message: item.message,
      })),
    );
  }

  if (normalizedError?.code === 11000) {
    const duplicatedField = Object.keys(normalizedError.keyPattern || {})[0] || "field";

    normalizedError = new ApiError(
      409,
      `${duplicatedField} already exists.`,
      "DUPLICATE_RESOURCE",
      normalizedError.keyValue || null,
    );
  }

  if (normalizedError instanceof mongoose.Error.CastError) {
    normalizedError = new ApiError(
      400,
      `Invalid ${normalizedError.path}.`,
      "INVALID_IDENTIFIER",
    );
  }

  if (normalizedError.name === "JsonWebTokenError") {
    normalizedError = new ApiError(401, "Invalid authentication token.", "INVALID_TOKEN");
  }

  if (normalizedError.name === "TokenExpiredError") {
    normalizedError = new ApiError(401, "Authentication token expired.", "TOKEN_EXPIRED");
  }

  if (normalizedError.name === "MulterError") {
    normalizedError = new ApiError(400, normalizedError.message, "UPLOAD_ERROR");
  }

  if (!(normalizedError instanceof ApiError)) {
    normalizedError = new ApiError(
      500,
      normalizedError.message || "An unexpected error occurred.",
      "INTERNAL_SERVER_ERROR",
    );
  }

  logger.error({
    message: normalizedError.message,
    code: normalizedError.code,
    requestId: req.id,
    method: req.method,
    path: req.originalUrl,
    stack: error.stack,
    details: normalizedError.details,
  });

  return res.status(normalizedError.statusCode).json({
    success: false,
    message: normalizedError.message,
    data: null,
    error: {
      code: normalizedError.code,
      details: normalizedError.details,
      ...(env.isProduction ? {} : { stack: error.stack }),
      requestId: req.id,
    },
  });
};
