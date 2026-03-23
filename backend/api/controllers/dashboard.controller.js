import { sendSuccess } from "../utils/response.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  getAdminDashboard,
  getPublicHomeDashboard,
} from "../services/dashboard.service.js";

export const getAdminDashboardController = asyncHandler(async (_req, res) => {
  const dashboard = await getAdminDashboard();

  return sendSuccess(res, {
    message: "Admin dashboard fetched successfully.",
    data: dashboard,
  });
});

export const getPublicHomeDashboardController = asyncHandler(async (_req, res) => {
  const dashboard = await getPublicHomeDashboard();

  return sendSuccess(res, {
    message: "Public homepage data fetched successfully.",
    data: dashboard,
  });
});
