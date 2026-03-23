import createApp from "./app.js";
import env from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { logger } from "./config/logger.js";
import { bootstrapApplication } from "./services/bootstrap.service.js";
import { pathToFileURL } from "url";

const app = createApp();
let registeredSignalHandlers = false;

const shutdown = (server, signal) => {
  logger.info(`${signal} received. Shutting down gracefully.`);

  server.close(async () => {
    try {
      await disconnectDatabase();
    } finally {
      process.exit(0);
    }
  });

  setTimeout(() => process.exit(1), 10000).unref();
};

export const startServer = async () => {
  await connectDatabase();
  await bootstrapApplication();

  const server = app.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port} in ${env.nodeEnv} mode.`);
  });

  if (!registeredSignalHandlers) {
    process.on("SIGINT", () => shutdown(server, "SIGINT"));
    process.on("SIGTERM", () => shutdown(server, "SIGTERM"));
    registeredSignalHandlers = true;
  }

  return server;
};

const isExecutedDirectly =
  Boolean(process.argv[1]) &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (process.env.NODE_ENV !== "test" && isExecutedDirectly) {
  startServer().catch((error) => {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  });
}

export default app;
