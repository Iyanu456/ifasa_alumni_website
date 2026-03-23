// workers/email.worker.js
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.js";
import { sendVerificationEmail } from "../services/email.service.js";
import { logger } from "../config/logger.js";

export const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    logger.info(`📥 Job received: ${job.name} (${job.id})`);

    try {
      if (job.name === "sendVerificationEmail") {
        const { email, fullName, verificationLink } = job.data;

        logger.info(`✉️ Sending verification email to: ${email}`);

        const result = await sendVerificationEmail({
          email,
          fullName,
          verificationLink,
        });

        logger.info(
          `✅ Email sent successfully to ${email} | Job ID: ${job.id}`
        );

        return result; // helps BullMQ track success
      }

      logger.warn(`⚠️ Unknown job type: ${job.name}`);
    } catch (error) {
      logger.error(
        `❌ Error processing job ${job.id} (${job.name}):`,
        error
      );

      // VERY IMPORTANT: rethrow so BullMQ marks job as failed
      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);

/**
 * 🔁 Worker lifecycle logs
 */
emailWorker.on("ready", () => {
  logger.info("🚀 Email worker is ready and waiting for jobs...");
});

emailWorker.on("active", (job) => {
  logger.info(`⚙️ Processing job: ${job.name} (${job.id})`);
});

emailWorker.on("completed", (job) => {
  logger.info(`🎉 Job completed: ${job.name} (${job.id})`);
});

emailWorker.on("failed", (job, err) => {
  logger.error(
    `💥 Job failed: ${job?.name} (${job?.id})`,
    err
  );
});

emailWorker.on("error", (err) => {
  logger.error("🚨 Worker error:", err);
});