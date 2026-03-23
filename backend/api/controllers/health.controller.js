import { getDatabaseHealth } from "../config/database.js";
import { sendSuccess } from "../utils/response.js";

export const healthCheck = (_req, res) =>
  sendSuccess(res, {
    message: "Service is healthy.",
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: getDatabaseHealth(),
    },
  });
