import cors from "cors";
import express from "express";
import requestId from "express-request-id";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import env from "./config/env.js";
import { morganStream } from "./config/logger.js";
import swaggerSpec from "./docs/swagger.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import { generalLimiter } from "./middlewares/rate-limit.middleware.js";
import { sanitizeInputs } from "./middlewares/sanitize.middleware.js";
import apiRoutes from "./routes/index.js";
import healthRoutes from "./routes/health.routes.js";
import ApiError from "./utils/api-error.js";
import { buildFileUrl, uploadsDirectory } from "./utils/file.js";
import { sendSuccess } from "./utils/response.js";

const resolveCorsOrigin = (origin, callback) => {
  if (!origin || env.corsOrigins.includes("*") || env.corsOrigins.includes(origin)) {
    callback(null, true);
    return;
  }

  callback(new ApiError(403, "CORS origin not allowed.", "CORS_NOT_ALLOWED"));
};

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(requestId());
  app.use(
    helmet({
      crossOriginResourcePolicy: {
        policy: "cross-origin",
      },
    }),
  );
  app.use(
    cors({
      origin: resolveCorsOrigin,
      credentials: true,
    }),
  );
  app.use(generalLimiter);
  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));
  app.use(hpp());
  app.use(sanitizeInputs);
  app.use(
    morgan(env.isProduction ? "combined" : "dev", {
      stream: morganStream,
    }),
  );

  app.use("/uploads", express.static(uploadsDirectory));

  app.get("/", (req, res) =>
    sendSuccess(res, {
      message: "IFASA Alumni API is running.",
      data: {
        docs: `${req.protocol}://${req.get("host")}/api/docs`,
        health: `${req.protocol}://${req.get("host")}/health`,
        uploadsBaseUrl: buildFileUrl(req, { filename: "" }).replace(/\/$/, ""),
      },
    }),
  );

  app.use("/health", healthRoutes);
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    }),
  );
  app.use("/api", apiRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;
