import { Redis } from "ioredis";
import env from "./env.js";
import { logger } from "./logger.js";

export const redisConnection = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,
  tls: env.redisUrl.startsWith("rediss://") ? {} : undefined,
});

redisConnection.on("connect", () => {
  logger.info("Redis connected.");
});

redisConnection.on("error", (error) => {
  logger.error(`Redis error: ${error.message}`);
});
