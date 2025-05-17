import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import colors from "colors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Connect to database..
connectDB();

// // Route files
import { notFound, errorHandler } from "./middlewares/error.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRiutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
const app = express();

// Body parser....
app.use(express.json());

// Dev logging middleware...
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Make uploads folder static
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRiutes);
app.use("/api/analytics", analyticsRoutes);

// Error handling...
app.use(notFound);
app.use(errorHandler);

// start the server ....
const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(
    `✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  server.close(() => process.exit(1));
});
