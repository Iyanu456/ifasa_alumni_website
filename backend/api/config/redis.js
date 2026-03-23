// config/redis.js
import { Redis } from "ioredis";
import env from "./env.js";

export const redisConnection = new Redis(env.redisUrl, {
  maxRetriesPerRequest: null,
  tls: env.redisUrl.startsWith("rediss://") ? {} : undefined,
});

redisConnection.on("connect", () => {
  console.log("✅ Redis connected");
});

redisConnection.on("error", (err) => {
  console.error("❌ Redis error:", err);
});