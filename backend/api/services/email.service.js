import nodemailer from "nodemailer";
import { Resend } from "resend";
import env from "../config/env.js";
import { logger } from "../config/logger.js";

let transporterCache = null;

const getTransporter = () => {
  if (transporterCache) {
    return transporterCache;
  }

  const useResend = !!env.resendApiKey;
  const hasSmtpConfig = env.smtpHost && env.smtpUser && env.smtpPass;
  const useGmailService =
    env.smtpHost === "smtp.gmail.com" &&
    env.smtpUser &&
    env.smtpPass;

  /**
   * 🔥 1. RESEND (PRIMARY FOR RENDER / TESTING)
   */
  if (useResend) {
    const resend = new Resend(env.resendApiKey);

    transporterCache = {
      __transportType: "resend",
      sendMail: async ({ from, to, subject, html, text }) => {
        const response = await resend.emails.send({
          from: `${env.resendSenderName} ${env.resendSenderEmail}`,
          to,
          subject,
          html,
          text,
        });

        return response;
      },
    };

    logger.info("📧 Using Resend email transport");
    return transporterCache;
  }

  /**
   * 🔥 2. SMTP (PRODUCTION / VPS)
   */
  if (hasSmtpConfig) {
    transporterCache = nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });

    transporterCache.__transportType = "smtp";

    logger.info("📧 Using SMTP email transport");
    return transporterCache;
  }

  /**
   * 🔥 3. GMAIL (OPTIONAL FALLBACK)
   */
  if (useGmailService) {
    transporterCache = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    });

    transporterCache.__transportType = "gmail";

    logger.info("📧 Using Gmail email transport");
    return transporterCache;
  }

  /**
   * 🔥 4. JSON FALLBACK (DEV ONLY)
   */
  transporterCache = nodemailer.createTransport({
    jsonTransport: true,
  });

  transporterCache.__transportType = "json";

  logger.warn("⚠️ Using JSON email transport (no real emails sent)");

  return transporterCache;
};

/**
 * 🔥 CORE EMAIL SENDER
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();

  try {
    const info = await transporter.sendMail({
      from: env.resendSenderEmail,
      to,
      subject,
      html,
      text,
    });

    return {
      info,
      transport: transporter.__transportType,
      usedFallback:
        transporter.__transportType === "json",
    };
  } catch (error) {
    logger.error("❌ Email sending failed:", error);
    throw error;
  }
};

/**
 * 🔥 VERIFICATION EMAIL
 */
export const sendVerificationEmail = async ({
  email,
  fullName,
  verificationLink,
}) => {
  const subject = "Verify your Ife Architecture Alumni Association account";

  const text = `Hello ${fullName??""}, verify your email by visiting this link: ${verificationLink}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
      <h2>Welcome to Ife Architecture Alumni Association</h2>
      <p>Hello ${fullName??""},</p>
      <p>Thanks for registering. Please verify your email address to activate your account.</p>
      <p>
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 20px; background: #991b1b; color: #ffffff; text-decoration: none; border-radius: 8px;">
          Verify Email
        </a>
      </p>
      <p>If the button does not work, copy and paste this link into your browser:</p>
      <p>${verificationLink}</p>
      <p>This link expires in ${env.verificationTokenTtlMinutes} minutes.</p>
    </div>
  `;

  const result = await sendEmail({
    to: email,
    subject,
    html,
    text,
  });

  return {
    sent: true,
    transport: result.transport,
    previewUrl:
      result.transport === "json" ? verificationLink : null,
  };
};

/**
 * 🔥 PASSWORD RESET EMAIL
 */
export const sendPasswordResetEmail = async ({
  email,
  fullName,
  resetLink,
}) => {
  const subject = "Reset your Ife Architecture Alumni Association password";

  const text = `Hello ${fullName}, reset your password with this link: ${resetLink}`;

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
      <h2>Password Reset Request</h2>
      <p>Hello ${fullName},</p>
      <p>We received a request to reset your password.</p>
      <p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; background: #991b1b; color: #ffffff; text-decoration: none; border-radius: 8px;">
          Reset Password
        </a>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p>This link expires in ${env.passwordResetTokenTtlMinutes} minutes.</p>
    </div>
  `;

  const result = await sendEmail({
    to: email,
    subject,
    html,
    text,
  });

  return {
    sent: true,
    transport: result.transport,
    previewUrl:
      result.transport === "json" ? resetLink : null,
  };
};