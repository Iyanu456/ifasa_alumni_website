import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import winston from "winston";
import env from "./env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDirectory = path.resolve(__dirname, "../../logs");

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, { recursive: true });
}

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || message}`;
  }),
);

const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

export const logger = winston.createLogger({
  level: env.logLevel,
  defaultMeta: { service: "ifasa-alumni-api" },
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.File({
      filename: path.join(logsDirectory, "combined.log"),
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: path.join(logsDirectory, "error.log"),
      level: "error",
      format: fileFormat,
    }),
  ],
});

export const morganStream = {
  write: (message) => {
    logger.http(message.trim());
  },
};
