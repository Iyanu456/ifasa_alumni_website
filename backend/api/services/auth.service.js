import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import env from "../config/env.js";
import ApiError from "../utils/api-error.js";
import { generateRandomToken, hashToken } from "../utils/crypto.js";
import { USER_ROLES } from "../utils/roles.js";
import { sendPasswordResetEmail, sendVerificationEmail } from "./email.service.js";
import { logActivity } from "./activity.service.js";
import { getSettings } from "./settings.service.js";
import { emailQueue } from "../queues/email.queue.js";

const googleOAuthClient =
  env.googleClientId && env.googleClientSecret && env.googleRedirectUri
    ? new OAuth2Client(
        env.googleClientId,
        env.googleClientSecret,
        env.googleRedirectUri,
      )
    : null;

const GOOGLE_RESPONSE_MODE = Object.freeze({
  REDIRECT: "redirect",
  JSON: "json",
});

const signToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
      isProfileComplete: user.isProfileComplete,
    },
    env.jwtSecret,
    {
      expiresIn: env.jwtExpiresIn,
    },
  );

const ensureGoogleOauthConfigured = () => {
  if (!env.googleClientId || !env.googleClientSecret || !googleOAuthClient) {
    throw new ApiError(
      500,
      "Google authentication is not configured.",
      "GOOGLE_AUTH_NOT_CONFIGURED",
    );
  }

  return googleOAuthClient;
};

const buildVerificationState = () => {
  const rawToken = generateRandomToken(32);

  return {
    rawToken,
    hashedToken: hashToken(rawToken),
    expiresAt: new Date(
      Date.now() + env.verificationTokenTtlMinutes * 60 * 1000,
    ),
  };
};

const buildVerificationUrl = (token) =>
  `${env.clientUrl}/verify-email/${token}`;

const buildPasswordResetState = () => {
  const rawToken = generateRandomToken(32);

  return {
    rawToken,
    hashedToken: hashToken(rawToken),
    expiresAt: new Date(
      Date.now() + env.passwordResetTokenTtlMinutes * 60 * 1000,
    ),
  };
};

const buildPasswordResetUrl = (token) => `${env.clientUrl}/reset-password/${token}`;

const normalizeRedirectUri = (redirectUri) => {
  const fallback = env.googleAuthSuccessRedirect || env.clientUrl;

  if (!redirectUri) {
    return fallback;
  }

  let candidateUrl;
  let allowedUrl;

  try {
    allowedUrl = new URL(env.clientUrl);
    candidateUrl = redirectUri.startsWith("/")
      ? new URL(redirectUri, env.clientUrl)
      : new URL(redirectUri);
  } catch {
    throw new ApiError(400, "Invalid redirect URI.", "INVALID_REDIRECT_URI");
  }

  if (candidateUrl.origin !== allowedUrl.origin) {
    throw new ApiError(
      400,
      "Redirect URI must use the configured client origin.",
      "INVALID_REDIRECT_URI",
    );
  }

  return candidateUrl.toString();
};

const buildGoogleOauthState = ({ redirectUri, responseMode }) =>
  jwt.sign(
    {
      redirectUri,
      responseMode,
      provider: "google",
    },
    env.jwtSecret,
    {
      expiresIn: `${env.googleOauthStateTtlMinutes}m`,
    },
  );

const parseGoogleOauthState = (stateToken) => {
  if (!stateToken) {
    throw new ApiError(400, "Missing Google OAuth state.", "INVALID_GOOGLE_STATE");
  }

  try {
    const decoded = jwt.verify(stateToken, env.jwtSecret);

    return {
      redirectUri: normalizeRedirectUri(decoded.redirectUri),
      responseMode:
        decoded.responseMode === GOOGLE_RESPONSE_MODE.JSON
          ? GOOGLE_RESPONSE_MODE.JSON
          : GOOGLE_RESPONSE_MODE.REDIRECT,
    };
  } catch {
    throw new ApiError(400, "Invalid or expired Google OAuth state.", "INVALID_GOOGLE_STATE");
  }
};

const withHashParams = (baseUrl, params = {}) => {
  const url = new URL(baseUrl);
  const hashParams = new URLSearchParams(
    url.hash.startsWith("#") ? url.hash.slice(1) : url.hash,
  );

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      hashParams.set(key, String(value));
    }
  });

  url.hash = hashParams.toString();
  return url.toString();
};

const verifyGoogleIdToken = async (idToken) => {
  const client = ensureGoogleOauthConfigured();

  let payload;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.googleClientId,
    });
    payload = ticket.getPayload();
  } catch {
    throw new ApiError(401, "Invalid Google token.", "INVALID_GOOGLE_TOKEN");
  }

  if (!payload?.sub || !payload.email) {
    throw new ApiError(
      400,
      "Invalid Google token payload.",
      "INVALID_GOOGLE_TOKEN",
    );
  }

  if (!payload.email_verified) {
    throw new ApiError(
      400,
      "Google account email is not verified.",
      "GOOGLE_EMAIL_NOT_VERIFIED",
    );
  }

  return payload;
};

const buildAuthResult = (user) => ({
  token: signToken(user),
  user,
  isProfileComplete: user.isProfileComplete,
  requiresProfileCompletion: !user.isProfileComplete,
});

const syncVerifiedGoogleUser = async (googlePayload) => {
  const email = googlePayload.email.toLowerCase().trim();
  let user = await User.findOne({
    $or: [{ email }, { googleId: googlePayload.sub }],
  }).select("+password +verificationTokenHash +verificationTokenExpiresAt");

  if (!user) {
    user = await User.create({
      fullName: googlePayload.name || email.split("@")[0],
      email,
      googleId: googlePayload.sub,
      authProvider: "google",
      isVerified: true,
      isProfileComplete: false,
      role: USER_ROLES.USER,
      status: "pending",
      avatarUrl: googlePayload.picture || undefined,
    });

    await logActivity({
      actor: user,
      action: "auth.google-register",
      entityType: "user",
      entityId: user._id,
      targetName: user.fullName,
      description: "New Google-authenticated user account created.",
    });
  } else {
    user.googleId = googlePayload.sub;
    user.isVerified = true;
    user.verificationTokenHash = undefined;
    user.verificationTokenExpiresAt = undefined;
    user.avatarUrl = user.avatarUrl || googlePayload.picture || undefined;
    user.fullName = user.fullName || googlePayload.name || user.fullName;

    if (!user.password || user.authProvider === "google") {
      user.authProvider = "google";
    }
  }

  user.lastLoginAt = new Date();
  await user.save();

  await logActivity({
    actor: user,
    action: "auth.google-login",
    entityType: "user",
    entityId: user._id,
    targetName: user.fullName,
    description: "User authenticated with Google.",
  });

  return buildAuthResult(user);
};

//register, verify email, resend verification, login, get current profile, google oauth initiation and completion
export const registerUser = async (payload) => {
  const settings = await getSettings();

  if (!settings.allowRegistrations) {
    throw new ApiError(
      403,
      "Registrations are currently disabled.",
      "REGISTRATION_DISABLED"
    );
  }

  const email = payload.email.toLowerCase().trim();

  const existingUser = await User.findOne({ email }).select(
    "+password +verificationTokenHash +verificationTokenExpiresAt"
  );

  /**
   * 🔥 HANDLE EXISTING USER
   */
  if (existingUser) {
    const passwordMatches = await existingUser.comparePassword(
      payload.password
    );

    if (!passwordMatches) {
      throw new ApiError(
        401,
        "Invalid credentials. Please check your email and password",
        "INVALID_CREDENTIALS"
      );
    }

    /**
     * ✅ CASE: VERIFIED → LOG THEM IN
     */
    if (existingUser.isVerified) {
      existingUser.lastLoginAt = new Date();
      await existingUser.save();

      await logActivity({
        actor: existingUser,
        action: "auth.login",
        entityType: "user",
        entityId: existingUser._id,
        targetName: existingUser.fullName,
        description: "User logged in via register route.",
      });

      return {
        success: true,
        message: "Account already exists. Logged you in.",
        ...buildAuthResult(existingUser),
      };
    }

    /**
     * 🚧 CASE: NOT VERIFIED → RESEND EMAIL
     */
    const verificationState = buildVerificationState();

    existingUser.verificationTokenHash = verificationState.hashedToken;
    existingUser.verificationTokenExpiresAt = verificationState.expiresAt;

    await existingUser.save();

    const verificationLink = buildVerificationUrl(
      verificationState.rawToken
    );

    await emailQueue.add(
      "sendVerificationEmail",
      {
        email: existingUser.email,
        fullName: existingUser.fullName,
        verificationLink,
      },
      {
        attempts: 5,
        backoff: { type: "exponential", delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    return {
      success: false,
      code: "EMAIL_NOT_VERIFIED",
      message:
        "Account exists but email is not verified. A new verification email has been sent.",
      
        isVerified: false,
        email: existingUser.email,
        user: {
          email: existingUser.email
        }
      
    };
  }

  /**
   * ✅ NEW USER FLOW
   */
  const verificationState = buildVerificationState();

  const user = await User.create({
    ...payload,
    email,
    role: USER_ROLES.USER,
    authProvider: "local",
    verificationTokenHash: verificationState.hashedToken,
    verificationTokenExpiresAt: verificationState.expiresAt,
    isVerified: false,
    isProfileComplete: false,
    status: "approved",
  });

  const verificationLink = buildVerificationUrl(
    verificationState.rawToken
  );

  await emailQueue.add(
    "sendVerificationEmail",
    {
      email: user.email,
      fullName: user.fullName,
      verificationLink,
    },
    {
      attempts: 5,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  await logActivity({
    actor: user,
    action: "auth.register",
    entityType: "user",
    entityId: user._id,
    targetName: user.fullName,
    description: "New user registration created.",
  });

  return {
    success: true,
    message: "Registration successful. Verification email sent.",
    
      user,
      isVerified: false,
      verification: {
        sent: true,
        expiresAt: verificationState.expiresAt,
      
    },
  };
};

export const verifyUserEmail = async (token) => {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    verificationTokenHash: hashedToken,
    verificationTokenExpiresAt: { $gt: new Date() },
  }).select("+verificationTokenHash +verificationTokenExpiresAt");

  if (!user) {
    throw new ApiError(
      400,
      "Verification token is invalid or has expired.",
      "INVALID_VERIFICATION_TOKEN",
    );
  }

  user.isVerified = true;
  user.verificationTokenHash = undefined;
  user.verificationTokenExpiresAt = undefined;
  user.lastLoginAt = new Date();

  await user.save();

  await logActivity({
    actor: user,
    action: "auth.verify-email",
    entityType: "user",
    entityId: user._id,
    targetName: user.fullName,
    description: "Email address verified.",
  });

  // 🔥 return full auth payload
  return buildAuthResult(user);
};

export const resendVerificationEmail = async (emailAddress) => {
  const email = emailAddress.toLowerCase().trim();

  const user = await User.findOne({ email }).select(
    "+verificationTokenHash +verificationTokenExpiresAt"
  );

  if (!user) {
    throw new ApiError(404, "No account found with this email.", "USER_NOT_FOUND");
  }

  /**
   * 🔥 NEW BEHAVIOR: already verified → no error
   */
  if (user.isVerified) {
    return {
      success: true,
      code: "ALREADY_VERIFIED",
      message: "Email is already verified.",
    
        isVerified: true,
        email: user.email,
      
    };
  }

  /**
   * ✅ NOT VERIFIED → resend email
   */
  const verificationState = buildVerificationState();

  user.verificationTokenHash = verificationState.hashedToken;
  user.verificationTokenExpiresAt = verificationState.expiresAt;

  await user.save();

  const verificationLink = buildVerificationUrl(verificationState.rawToken);

  await emailQueue.add(
    "sendVerificationEmail",
    {
      email: user.email,
      fullName: user.fullName,
      verificationLink,
    },
    {
      attempts: 5,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  await logActivity({
    actor: user,
    action: "auth.resend-verification",
    entityType: "user",
    entityId: user._id,
    targetName: user.fullName,
    description: "Verification email resent.",
  });

  return {
    success: true,
    message: "Verification email sent.",
    data: {
      isVerified: false,
      email: user.email,
      verification: {
        sent: true,
        expiresAt: verificationState.expiresAt,
      },
    },
  };
};

export const requestPasswordReset = async (emailAddress) => {
  const email = emailAddress.toLowerCase().trim();
  const user = await User.findOne({ email }).select(
    "+passwordResetTokenHash +passwordResetTokenExpiresAt",
  );

  if (!user) {
    return { sent: true };
  }

  if (user.authProvider === "google" && !user.password) {
    return { sent: true };
  }

  const resetState = buildPasswordResetState();
  user.passwordResetTokenHash = resetState.hashedToken;
  user.passwordResetTokenExpiresAt = resetState.expiresAt;
  await user.save();

  const emailResult = await sendPasswordResetEmail({
    email: user.email,
    fullName: user.fullName || user.email,
    resetLink: buildPasswordResetUrl(resetState.rawToken),
  });

  await logActivity({
    actor: user,
    action: "auth.request-password-reset",
    entityType: "user",
    entityId: user._id,
    targetName: user.fullName,
    description: "Password reset requested.",
  });

  return {
    sent: true,
    expiresAt: resetState.expiresAt,
    previewUrl: emailResult.previewUrl,
  };
};

export const resetPassword = async (token, password) => {
  const hashedToken = hashToken(token);

  const user = await User.findOne({
    passwordResetTokenHash: hashedToken,
    passwordResetTokenExpiresAt: { $gt: new Date() },
  }).select("+password +passwordResetTokenHash +passwordResetTokenExpiresAt");

  if (!user) {
    throw new ApiError(
      400,
      "Password reset token is invalid or has expired.",
      "INVALID_PASSWORD_RESET_TOKEN",
    );
  }

  user.password = password;
  user.passwordResetTokenHash = undefined;
  user.passwordResetTokenExpiresAt = undefined;
  user.authProvider = "local";
  user.lastLoginAt = new Date();
  await user.save();

  await logActivity({
    actor: user,
    action: "auth.reset-password",
    entityType: "user",
    entityId: user._id,
    targetName: user.fullName,
    description: "Password reset completed.",
  });

  return buildAuthResult(user);
};

export const loginUser = async ({ email: emailAddress, password }) => {
  const email = emailAddress.toLowerCase().trim();
  const user = await User.findOne({ email }).select(
    "+password +verificationTokenHash +verificationTokenExpiresAt"
  );

  if (!user) {
    throw new ApiError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
  }

  if (user.authProvider === "google" && !user.password) {
    throw new ApiError(
      400,
      "This account uses Google sign-in. Please continue with Google.",
      "GOOGLE_AUTH_REQUIRED",
    );
  }

  const passwordMatches = await user.comparePassword(password);

  if (!passwordMatches) {
    throw new ApiError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
  }

  /**
   * 🔥 NEW LOGIC STARTS HERE
   */
  if (!user.isVerified) {
    // regenerate verification token
    const verificationState = buildVerificationState();

    user.verificationTokenHash = verificationState.hashedToken;
    user.verificationTokenExpiresAt = verificationState.expiresAt;

    await user.save();

    const verificationLink = buildVerificationUrl(verificationState.rawToken);

    // send email (queue or direct)
    await emailQueue.add(
      "sendVerificationEmail",
      {
        email: user.email,
        fullName: user.fullName,
        verificationLink,
      },
      {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      }
    );

    return {
      success: false,
      code: "EMAIL_NOT_VERIFIED",
      message: "Email not verified. A new verification email has been sent.",
      
        isVerified: false,
        user: { 
          email: user.email,
          id: user.id
        },
    
    };
  }

  /**
   * 🔥 NORMAL LOGIN FLOW CONTINUES
   */

  user.passwordResetTokenHash = undefined;
  user.passwordResetTokenExpiresAt = undefined;

  user.lastLoginAt = new Date();
  await user.save();

  await logActivity({
    actor: user,
    action: "auth.login",
    entityType: "user",
    entityId: user._id,
    targetName: user.fullName,
    description: "User logged in.",
  });

  return {
    success: true,
    ...buildAuthResult(user),
  };
};

export const getCurrentUserProfile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found.", "USER_NOT_FOUND");
  }

  return user;
};

export const getGoogleAuthInitiation = ({
  redirectUri,
  mode = GOOGLE_RESPONSE_MODE.REDIRECT,
} = {}) => {
  const client = ensureGoogleOauthConfigured();
  const responseMode =
    mode === GOOGLE_RESPONSE_MODE.JSON
      ? GOOGLE_RESPONSE_MODE.JSON
      : GOOGLE_RESPONSE_MODE.REDIRECT;
  const normalizedRedirectUri = normalizeRedirectUri(redirectUri);
  const state = buildGoogleOauthState({
    redirectUri: normalizedRedirectUri,
    responseMode,
  });

  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile"],
    include_granted_scopes: true,
    prompt: "select_account",
    state,
  });

  return {
    url,
    redirectUri: normalizedRedirectUri,
    responseMode,
  };
};

export const completeGoogleOauth = async ({ code, state }) => {
  if (!code) {
    throw new ApiError(400, "Missing Google authorization code.", "MISSING_GOOGLE_CODE");
  }

  const oauthState = parseGoogleOauthState(state);
  const client = ensureGoogleOauthConfigured();

  let tokens;

  try {
    const tokenResponse = await client.getToken(code);
    tokens = tokenResponse.tokens;
  } catch {
    throw new ApiError(
      401,
      "Google authorization code exchange failed.",
      "GOOGLE_CODE_EXCHANGE_FAILED",
    );
  }

  if (!tokens?.id_token) {
    throw new ApiError(
      401,
      "Google did not return a valid ID token.",
      "INVALID_GOOGLE_TOKEN",
    );
  }

  const googlePayload = await verifyGoogleIdToken(tokens.id_token);
  const authResult = await syncVerifiedGoogleUser(googlePayload);

  return {
    ...authResult,
    responseMode: oauthState.responseMode,
    redirectUrl:
      oauthState.responseMode === GOOGLE_RESPONSE_MODE.REDIRECT
        ? withHashParams(oauthState.redirectUri, {
            token: authResult.token,
            provider: "google",
            isProfileComplete: authResult.isProfileComplete,
            requiresProfileCompletion: authResult.requiresProfileCompletion,
          })
        : null,
  };
};

export const buildGoogleOauthErrorResponse = (stateToken, error) => {
  let responseMode = GOOGLE_RESPONSE_MODE.REDIRECT;
  let redirectUri = env.googleAuthFailureRedirect;

  if (stateToken) {
    try {
      const parsedState = parseGoogleOauthState(stateToken);
      responseMode = parsedState.responseMode;
      redirectUri = parsedState.redirectUri;
    } catch {
      redirectUri = env.googleAuthFailureRedirect;
    }
  }

  if (responseMode === GOOGLE_RESPONSE_MODE.JSON) {
    return {
      responseMode,
      redirectUrl: null,
    };
  }

  return {
    responseMode,
    redirectUrl: withHashParams(redirectUri, {
      error: error.code || "GOOGLE_AUTH_FAILED",
      message: error.message || "Google authentication failed.",
      provider: "google",
    }),
  };
};
