import nodemailer from "nodemailer";
import env from "../config/env.js";
import { logger } from "../config/logger.js";


let transporterCache = null;

const getTransporter = () => {
  if (transporterCache) {
    return transporterCache;
  }

  const hasSmtpConfig = env.smtpHost && env.smtpUser && env.smtpPass;
  const useGmailService = env.smtpHost === "smtp.gmail.com" && env.smtpUser && env.smtpPass;

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
    return transporterCache;
  }

  if (useGmailService) {
    transporterCache = nodemailer.createTransport({
      service: "gmail", // or another provider like SendGrid, SES, etc.
    auth: {
      user: "iydsolutions.team@gmail.com",
      pass: "nptwjrdzdahgxhtl",
    },
    });

    //transporterCache.__transportType = "smtp";
    return transporterCache;
  }

  transporterCache = nodemailer.createTransport({
    jsonTransport: true,
  });
  transporterCache.__transportType = "json";

  return transporterCache;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: env.emailFrom,
    to,
    subject,
    html,
    text,
  });

  if (transporter.__transportType === "json") {
    logger.warn(`Email transport fallback in use. Email payload logged for ${to}.`);
  }

  return {
    info,
    usedFallback: transporter.__transportType === "json",
  };
};

export const sendVerificationEmail = async ({
  email,
  fullName,
  verificationLink,
}) => {
  const subject = "Verify your Ife Architecture Alumni Association account";
  const text = `Hello ${fullName}, verify your email by visiting this link: ${verificationLink}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
      <h2>Welcome to Ife Architecture Alumni Association</h2>
      <p>Hello ${fullName},</p>
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
    transport: result.usedFallback ? "json" : "smtp",
    previewUrl: result.usedFallback ? verificationLink : null,
  };
};
