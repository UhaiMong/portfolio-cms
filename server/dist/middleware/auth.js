"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("../utils/errorHandler");
const Admin_1 = __importDefault(require("../models/Admin"));
// Protect routes — must be logged in
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token)
            throw new errorHandler_1.AppError("Not authorized. No token provided.", 401);
        const decoded = (0, jwt_1.verifyToken)(token);
        // Check admin still exists & is active
        const admin = await Admin_1.default.findById(decoded.id).select("+isActive");
        if (!admin || !admin.isActive) {
            throw new errorHandler_1.AppError("Admin account not found or deactivated.", 401);
        }
        req.admin = decoded;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.protect = protect;
// Restrict to specific roles
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.admin || !roles.includes(req.admin.role)) {
            return next(new errorHandler_1.AppError("You do not have permission to perform this action.", 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
