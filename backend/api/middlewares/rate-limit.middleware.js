import rateLimit from "express-rate-limit";
import env from "../config/env.js";

const buildLimiter = (max, message) =>
  rateLimit({
    windowMs: env.rateLimitWindowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
      res.status(429).json({
        success: false,
        message,
        data: null,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
        },
      });
    },
  });

export const generalLimiter = buildLimiter(
  env.rateLimitMax,
  "Too many requests. Please try again later.",
);

export const authLimiter = buildLimiter(
  env.authRateLimitMax,
  "Too many authentication attempts. Please wait and try again.",
);
