"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const db_1 = __importDefault(require("./config/db"));
const errorHandler_1 = require("./utils/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const bioRoutes_1 = __importDefault(require("./routes/bioRoutes"));
const bannerRoutes_1 = __importDefault(require("./routes/bannerRoutes"));
const resumeRoutes_1 = __importDefault(require("./routes/resumeRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const mediaRoutes_1 = __importDefault(require("./routes/mediaRoutes"));
const app = (0, express_1.default)();
// Security header
app.use((0, helmet_1.default)());
// Compress response
app.use((0, compression_1.default)());
// Rate limiting
app.use("/api", (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
}));
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
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
//  Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        env: process.env.NODE_ENV,
    });
});
//  Routes (we'll add these in step 3+)
app.use("/api/auth", authRoutes_1.default);
app.use("/api/projects", projectRoutes_1.default);
app.use("/api/blog", blogRoutes_1.default);
app.use("/api/bio", bioRoutes_1.default);
app.use("/api/banner", bannerRoutes_1.default);
app.use("/api/resume", resumeRoutes_1.default);
app.use("/api/contact", contactRoutes_1.default);
app.use("/api/media", mediaRoutes_1.default);
// 404 handler
app.use("/{*path}", (req, res) => {
    res
        .status(404)
        .json({ success: false, message: `Route ${req.originalUrl} not found` });
});
// Global error handler
app.use(errorHandler_1.globalErrorHandler);
// Start server
const PORT = process.env.PORT || 5000;
const start = async () => {
    await (0, db_1.default)();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📦 Environment: ${process.env.NODE_ENV}`);
    });
};
start();
