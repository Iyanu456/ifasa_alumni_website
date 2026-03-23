import ActivityLog from "../models/activity-log.model.js";
import { logger } from "../config/logger.js";

export const logActivity = async ({
  actor = null,
  action,
  entityType,
  entityId = null,
  targetName = "",
  description = "",
  metadata = {},
}) => {
  try {
    await ActivityLog.create({
      actor: actor?._id || actor || undefined,
      actorName: actor?.fullName || actor?.email || "System",
      action,
      entityType,
      entityId,
      targetName,
      description,
      metadata,
    });
  } catch (error) {
    logger.error(`Activity logging failed: ${error.message}`);
  }
};

export const getRecentActivities = async (limit = 10) =>
  ActivityLog.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
