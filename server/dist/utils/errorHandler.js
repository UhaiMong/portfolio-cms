"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = exports.catchAsync = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
// Async wrapper — eliminates try/catch in every controller
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.catchAsync = catchAsync;
// Global error middleware
const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        err.statusCode = 400;
        err.message = `Duplicate value for field: ${field}`;
    }
    // Mongoose validation error
    if (err.name === "ValidationError") {
        err.statusCode = 400;
        err.message = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
    }
    // JWT errors
    if (err.name === "JsonWebTokenError") {
        err.statusCode = 401;
        err.message = "Invalid token. Please log in again.";
    }
    if (err.name === "TokenExpiredError") {
        err.statusCode = 401;
        err.message = "Token expired. Please log in again.";
    }
    res.status(err.statusCode).json({
        success: false,
        status: "error",
        message: err.isOperational ? err.message : "Something went wrong",
        ...(process.env.NODE_ENV === "production" && { stack: err.stack }),
    });
};
exports.globalErrorHandler = globalErrorHandler;
