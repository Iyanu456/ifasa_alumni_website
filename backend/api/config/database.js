import mongoose from "mongoose";
import env from "./env.js";
import { logger } from "./logger.js";

mongoose.set("strictQuery", true);

export const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(env.mongoUri, {
      autoIndex: !env.isProduction,
      serverSelectionTimeoutMS: 10000,
    });

    const {
      host,
      name,
      port,
      readyState,
    } = connection.connection;
    const target = host
      ? `${host}${port ? `:${port}` : ""}${name ? `/${name}` : ""}`
      : name || "connected";

    logger.info(`MongoDB connected (${readyState}): ${target}`);
    return connection;
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected.");
};

export const getDatabaseHealth = () => {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  return states[mongoose.connection.readyState] || "unknown";
};
