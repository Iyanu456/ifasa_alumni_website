import jwt from "jsonwebtoken";
import env from "../config/env.js";
import User from "../models/user.model.js";
import ApiError from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const extractBearerToken = (authorizationHeader = "") => {
  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice(7).trim() || null;
};

const getJwtPayload = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Authentication token expired.", "TOKEN_EXPIRED");
    }

    throw new ApiError(401, "Invalid authentication token.", "INVALID_TOKEN");
  }
};

export const protect = asyncHandler(async (req, _res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    throw new ApiError(401, "Authentication token is required.", "AUTH_REQUIRED");
  }

  const payload = getJwtPayload(token);
  const userId = payload.sub || payload.id;

  if (!userId) {
    throw new ApiError(401, "Invalid authentication token.", "INVALID_TOKEN");
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new ApiError(401, "User account could not be found.", "USER_NOT_FOUND");
  }

  req.user = user;
  req.auth = payload;
  next();
});

export const authorizeRoles = (...roles) => {
  const normalizedRoles = roles.flat().filter(Boolean);

  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(401, "Authentication token is required.", "AUTH_REQUIRED"));
    }

    if (!normalizedRoles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          "You do not have permission to access this resource.",
          "FORBIDDEN",
          {
            allowedRoles: normalizedRoles,
            currentRole: req.user.role,
          },
        ),
      );
    }

    return next();
  };
};

export const authorize = (...roles) => authorizeRoles(...roles);

export const adminOnly = authorizeRoles("admin");

export const requireCompleteProfile = (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Authentication token is required.", "AUTH_REQUIRED"));
  }

  if (!req.user.isProfileComplete) {
    return next(
      new ApiError(
        403,
        "Profile completion is required to access this resource.",
        "PROFILE_INCOMPLETE",
        {
          isProfileComplete: false,
        },
      ),
    );
  }

  return next();
};
