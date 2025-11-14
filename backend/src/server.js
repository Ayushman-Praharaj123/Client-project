import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.route.js";
import contactRoutes from "./routes/contact.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

import { connectDB } from "./lib/db.js";
import { initCronJobs } from "./services/cronJobs.js";

const app = express();
const PORT = process.env.PORT || 5001;

const __dirname = path.resolve();

// ⭐ Add ALL frontend URLs here
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",

  // Your main frontend deployment
  "https://odishainterstatelabourunion-lemon.vercel.app",

  // Vercel preview deployment (git-main)
  "https://client-project-git-main-ayushman-praharaj123s-projects.vercel.app",

  // Final Vercel production link (if exists)
  "https://client-project-56fc.vercel.app",
].filter(Boolean);

// ⭐ Proper CORS config for cookies
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow Postman etc.
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ⭐ Required for cookies and JSON handling
app.use(express.json());
app.use(cookieParser());

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/analytics", analyticsRoutes);

// Health route
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// ⭐ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Start Server
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  await connectDB();
  initCronJobs();
});
