import app from "./app.js";
import env from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import logger from "./utils/logger.js";

const start = async () => {
  try {
    await connectDB();
  } catch (err) {
    logger.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }

  const server = app.listen(env.port, "0.0.0.0", () => {
    logger.info(`Server listening on port ${env.port} (${env.nodeEnv})`);
  });

  const shutdown = (signal) => {
    logger.info(`${signal} received, shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

process.on("unhandledRejection", (reason) => logger.error("Unhandled rejection:", reason));

start();
