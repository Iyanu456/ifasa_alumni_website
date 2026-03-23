import User from "../models/user.model.js";
import env from "../config/env.js";
import { logger } from "../config/logger.js";
import { ensureDefaultSettings } from "./settings.service.js";
import { logActivity } from "./activity.service.js";

export const bootstrapApplication = async () => {
  await ensureDefaultSettings();

  if (!env.adminEmail || !env.adminPassword) {
    logger.warn(
      "ADMIN_EMAIL and ADMIN_PASSWORD are not set. Admin bootstrap skipped.",
    );
    return;
  }

  const existingAdmin = await User.findOne({ email: env.adminEmail.toLowerCase() });

  if (existingAdmin) {
    return;
  }

  const admin = await User.create({
    fullName: env.adminFullName,
    email: env.adminEmail.toLowerCase(),
    password: env.adminPassword,
    phone: "N/A",
    graduationYear: "N/A",
    degree: "N/A",
    currentRole: env.adminRoleTitle,
    associationRoleTitle: env.adminRoleTitle,
    role: "admin",
    authProvider: "local",
    status: "approved",
    isVerified: true,
    isProfileComplete: true,
    consent: true,
  });

  await logActivity({
    actor: admin,
    action: "admin.bootstrap",
    entityType: "user",
    entityId: admin._id,
    targetName: admin.fullName,
    description: "Initial administrator account created.",
  });

  logger.info(`Bootstrapped admin account for ${admin.email}.`);
};
