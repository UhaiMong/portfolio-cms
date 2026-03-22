import "dotenv/config";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db";
import { globalErrorHandler } from "./utils/errorHandler";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import blogRoutes from "./routes/blogRoutes";
import bioRoutes from "./routes/bioRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import resumeRoutes from "./routes/resumeRoutes";
import contactRoutes from "./routes/contactRoutes";
import mediaRoutes from "./routes/mediaRoutes";

const app: Application = express();

// Security header
app.use(helmet());
// Compress response
app.use(compression());

// Rate limiting
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
  }),
);

// Middleware
// app.use(
//   cors({
//     origin:[
//      "https://www.frontend.com",
//      "https://www.dashboard.com",
//      ]
//     credentials: true,
//   }),
// );
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//  Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is running",
    env: process.env.NODE_ENV,
  });
});

//  Routes (we'll add these in step 3+)
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/bio", bioRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/media", mediaRoutes);

// 404 handler
app.use("/{*path}", (req: Request, res: Response) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(globalErrorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV}`);
  });
};

start();
