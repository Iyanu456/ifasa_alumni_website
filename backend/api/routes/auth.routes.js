import { Router } from "express";
import {
  getMe,
  googleCallback,
  initiateGoogleAuth,
  login,
  register,
  resendVerification,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { protect, requireCompleteProfile } from "../middlewares/auth.middleware.js";
import { authLimiter } from "../middlewares/rate-limit.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import {
  googleInitiateValidation,
  loginValidation,
  registerValidation,
  resendVerificationValidation,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", authLimiter, registerValidation, validateRequest, register);
router.post("/login", authLimiter, loginValidation, validateRequest, login);
router.get(
  "/google/initiate",
  authLimiter,
  googleInitiateValidation,
  validateRequest,
  initiateGoogleAuth,
);
router.get("/google/callback", googleCallback);
router.post(
  "/resend-verification",
  authLimiter,
  resendVerificationValidation,
  validateRequest,
  resendVerification,
);
router.get("/verify-email/:token", verifyEmail);
router.get("/me", protect, requireCompleteProfile, getMe);

export default router;
