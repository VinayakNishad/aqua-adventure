import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import adRoutes from "./routes/adRoutes.js";
import activityRoutes from "./routes/activities.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import reviewsRoutes from "./routes/reviews.js";
import videoRoutes from "./routes/VideoRoutes.js";
import packageRoutes from "./routes/packageRoutes.js"; // ✅ better name
import googleApiRoutes from "./routes/googleApiRoutes.js";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);
//  API KEY
app.use(
  cors({
    origin: "*",   // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false, // must be false if origin is "*"
  })
);

app.use(morgan("dev"));

// Uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/google", googleApiRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/activities", activityRoutes);

// React frontend build (only in production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../sunshine-frontend/build")));
  app.get("/", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../sunshine-frontend/build/index.html")
    );
  });
}

// **Connect to MongoDB and start server only after connection**
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // waits for DB connection
    console.log("MongoDB connected, starting server...");
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`Server running on http://0.0.0.0:${PORT}`)
    );

  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // stop server if DB connection fails
  }
};



startServer();
