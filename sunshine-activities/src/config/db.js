import dns from "node:dns";
import mongoose from "mongoose";
import env from "./env.js";
import logger from "../utils/logger.js";

const FALLBACK_DNS_SERVERS = ["1.1.1.1", "8.8.8.8"];

/**
 * Some Windows machines (VPNs, security agents) hand Node a loopback DNS
 * server that refuses the SRV lookup a mongodb+srv:// URI needs. Outside
 * production, swap it for public resolvers.
 */
const useReachableDnsServers = () => {
  if (env.isProduction) return;
  const servers = dns.getServers();
  if (servers.length > 0 && servers.every((s) => s === "127.0.0.1" || s === "::1")) {
    dns.setServers(FALLBACK_DNS_SERVERS);
    logger.info(`Loopback DNS detected, using ${FALLBACK_DNS_SERVERS.join(", ")}`);
  }
};

export const connectDB = async () => {
  useReachableDnsServers();
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  logger.info(`MongoDB connected: ${mongoose.connection.host}`);
};

export const disconnectDB = () => mongoose.disconnect();
