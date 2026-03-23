import env from "../config/env.js";
import ApiError from "../utils/api-error.js";
import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  buildGoogleOauthErrorResponse,
  completeGoogleOauth,
  getCurrentUserProfile,
  getGoogleAuthInitiation,
  loginUser,
  registerUser,
  resendVerificationEmail,
  verifyUserEmail,
} from "../services/auth.service.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  return sendSuccess(res, {
    statusCode: 201,
    message:
      "Registration successful. Please check your email to verify your account.",
    data: result,
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await verifyUserEmail(req.params.token);

  return sendSuccess(res, {
    message: "Email verified successfully.",
    data: {
      user,
    },
  });
});

export const resendVerification = asyncHandler(async (req, res) => {
  const result = await resendVerificationEmail(req.body.email);

  return sendSuccess(res, {
    message: "Verification email sent successfully.",
    data: result,
  });
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  return sendSuccess(res, {
    message: "Login successful.",
    data: result,
  });
});

export const initiateGoogleAuth = asyncHandler(async (req, res) => {
  const result = getGoogleAuthInitiation({
    redirectUri: req.query.redirectUri,
    mode: req.query.mode,
  });

  return sendSuccess(res, {
    message: "Google OAuth URL generated successfully.",
    data: result,
  });
});

export const googleCallback = async (req, res, next) => {
  try {
    if (req.query.error) {
      throw new ApiError(
        400,
        "Google authentication was cancelled or denied.",
        "GOOGLE_OAUTH_DENIED",
        {
          providerError: req.query.error,
        },
      );
    }

    const result = await completeGoogleOauth({
      code: req.query.code,
      state: req.query.state,
    });

    // ✅ ALWAYS return JSON
    return sendSuccess(res, {
      message: "Google authentication successful.",
      data: {
        token: result.token,
        user: result.user,
        isProfileComplete: result.isProfileComplete,
        requiresProfileCompletion: result.requiresProfileCompletion,
        redirectUrl: result.redirectUrl || null, // optional
      },
    });
  } catch (error) {
    const failureResult = buildGoogleOauthErrorResponse(req.query.state, error);

    // ✅ ALWAYS return JSON (NO redirects)
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Google authentication failed.",
      data: null,
      error: {
        code: error.code || "GOOGLE_AUTH_ERROR",
        details: failureResult || null,
      },
    });
  }
};

export const getMe = asyncHandler(async (req, res) => {
  const user = await getCurrentUserProfile(req.user._id);

  return sendSuccess(res, {
    message: "Current user fetched successfully.",
    data: {
      user,
    },
  });
});
