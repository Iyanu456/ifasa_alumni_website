import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../utils/async-handler.js";
import env from "../config/env.js";
import ApiError from "../utils/api-error.js";
import { parseBoolean } from "../utils/parsers.js";
import {
  getPublicSettings,
  getSettings,
  updateSettings,
} from "../services/settings.service.js";

export const getPublicSettingsController = asyncHandler(async (_req, res) => {
  const settings = await getPublicSettings();

  return sendSuccess(res, {
    message: "Public settings fetched successfully.",
    data: {
      settings,
    },
  });
});

export const getSettingsController = asyncHandler(async (_req, res) => {
  const settings = await getSettings();

  return sendSuccess(res, {
    message: "Settings fetched successfully.",
    data: {
      settings,
    },
  });
});

export const updateSettingsController = asyncHandler(async (req, res) => {
  /**
   * 🔒 Restrict to ENV admin only
   */
  if (req.user.email !== env.adminEmail) {
    throw new ApiError(
      403,
      "Only the system administrator can modify settings.",
      "SUPER_ADMIN_REQUIRED"
    );
  }
  const settings = await updateSettings(
    {
      ...req.body,
      allowRegistrations: parseBoolean(req.body.allowRegistrations),
      enableDonations: parseBoolean(req.body.enableDonations),
    },
    req.user,
  );

  return sendSuccess(res, {
    message: "Settings updated successfully.",
    data: {
      settings,
    },
  });
});
