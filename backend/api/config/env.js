import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../..");

dotenv.config({
  path: path.join(backendRoot, ".env"),
});

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBoolean = (value, fallback = false) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "on"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "off"].includes(normalized)) {
      return false;
    }
  }

  return fallback;
};

const toArray = (value, fallback = []) => {
  if (!value) {
    return fallback;
  }

  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
};

const port = toNumber(process.env.PORT, 5000);
const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";

const env = Object.freeze({
  nodeEnv,
  isProduction,
  port,
  mongoUri:
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ifasa_alumni",
  jwtSecret:
    process.env.JWT_SECRET || "development-jwt-secret-change-me-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  serverUrl: process.env.SERVER_URL || `http://localhost:${port}`,
  corsOrigins: toArray(
    process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:3000",
    ["http://localhost:3000"],
  ),
  logLevel: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  bcryptSaltRounds: toNumber(process.env.BCRYPT_SALT_ROUNDS, 12),
  verificationTokenTtlMinutes: toNumber(
    process.env.VERIFICATION_TOKEN_TTL_MINUTES,
    24 * 60,
  ),
  passwordResetTokenTtlMinutes: toNumber(
    process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES,
    60,
  ),
  maxFileSizeBytes: toNumber(process.env.MAX_FILE_SIZE_MB, 5) * 1024 * 1024,
  rateLimitWindowMs: toNumber(process.env.RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  rateLimitMax: toNumber(process.env.RATE_LIMIT_MAX, 200),
  authRateLimitMax: toNumber(process.env.AUTH_RATE_LIMIT_MAX, 10),
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: toNumber(process.env.SMTP_PORT, 587),
  smtpSecure: toBoolean(process.env.SMTP_SECURE, false),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  googleRedirectUri:
    process.env.GOOGLE_REDIRECT_URI ||
    `${process.env.SERVER_URL || `http://localhost:${port}`}/api/auth/google/callback`,
  googleOauthStateTtlMinutes: toNumber(
    process.env.GOOGLE_OAUTH_STATE_TTL_MINUTES,
    10,
  ),
  googleAuthSuccessRedirect:
    process.env.GOOGLE_AUTH_SUCCESS_REDIRECT ||
    `${process.env.CLIENT_URL || "http://localhost:3000"}/login`,
  googleAuthFailureRedirect:
    process.env.GOOGLE_AUTH_FAILURE_REDIRECT ||
    `${process.env.CLIENT_URL || "http://localhost:3000"}/login`,
  emailFrom:
    process.env.EMAIL_FROM || "IFE Alumni <no-reply@ife-alumni.local>",
  adminEmail: process.env.ADMIN_EMAIL || "",
  adminPassword: process.env.ADMIN_PASSWORD || "",
  adminFullName: process.env.ADMIN_FULL_NAME || "IFASA Administrator",
  adminRoleTitle: process.env.ADMIN_ROLE_TITLE || "Administrator",
  redisUrl: process.env.REDIS_URL || "redis://localhost:6379",
  resendApiKey: process.env.RESEND_API_KEY || "",
  resendSenderEmail: process.env.RESEND_SENDER_EMAIL || "",
  resendSenderName: process.env.RESEND_SENDER_NAME || "",
  resendEmailFrom: process.env.RESEND_EMAIL_FROM || "",
});

if (env.isProduction && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET must be provided in production.");
}

export default env;
