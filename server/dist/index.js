"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
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
const chatbootRoutes_1 = __importDefault(require("./routes/chatbootRoutes"));
const app = (0, express_1.default)();
// Security headers
app.use((0, helmet_1.default)());
// Compress responses
app.use((0, compression_1.default)());
// Rate limiting
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per window
    standardHeaders: true, // return rate limit info in the RateLimit-* headers
    legacyHeaders: false, // disable the X-RateLimit-* headers
});
app.use("/api", apiLimiter);
// CORS
const allowedOrigins = process.env.CORS_ORIGINS?.split(",") || [];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        else {
            return callback(new Error("CORS not allowed"));
        }
    },
    credentials: true,
}));
// Body parsers
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running",
        env: process.env.NODE_ENV,
    });
});
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/projects", projectRoutes_1.default);
app.use("/api/blog", blogRoutes_1.default);
app.use("/api/bio", bioRoutes_1.default);
app.use("/api/banner", bannerRoutes_1.default);
app.use("/api/resume", resumeRoutes_1.default);
app.use("/api/contact", contactRoutes_1.default);
app.use("/api/media", mediaRoutes_1.default);
app.use("/api/chatboot", chatbootRoutes_1.default);
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
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV}`);
    });
};
start();
