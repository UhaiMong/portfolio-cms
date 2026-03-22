"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateMe = exports.getMe = exports.login = exports.register = void 0;
const Admin_1 = __importDefault(require("../models/Admin"));
const jwt_1 = require("../utils/jwt");
const errorHandler_1 = require("../utils/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
// ── Register (only use once to create your admin account) ───
exports.register = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { name, email, password, role } = req.body;
    // Prevent creating more than one superadmin
    const existingAdmin = await Admin_1.default.findOne({ email });
    if (existingAdmin)
        throw new errorHandler_1.AppError("Email already registered.", 400);
    const admin = await Admin_1.default.create({ name, email, password, role });
    const token = (0, jwt_1.generateToken)(admin);
    (0, apiResponse_1.sendSuccess)(res, 201, "Admin registered successfully", {
        token,
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        },
    });
});
//  Login
exports.login = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        throw new errorHandler_1.AppError("Please provide email and password.", 400);
    const admin = await Admin_1.default.findOne({ email }).select("+password");
    if (!admin || !(await admin.comparePassword(password))) {
        throw new errorHandler_1.AppError("Invalid email or password.", 401);
    }
    if (!admin.isActive)
        throw new errorHandler_1.AppError("Your account has been deactivated.", 403);
    // Update last login
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });
    const token = (0, jwt_1.generateToken)(admin);
    (0, apiResponse_1.sendSuccess)(res, 200, "Logged in successfully", {
        token,
        admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            avatar: admin.avatar,
            lastLogin: admin.lastLogin,
        },
    });
});
// Get current admin (me)
exports.getMe = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const admin = await Admin_1.default.findById(req.admin?.id);
    if (!admin)
        throw new errorHandler_1.AppError("Admin not found.", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Admin profile fetched", {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
        lastLogin: admin.lastLogin,
        createdAt: admin.createdAt,
    });
});
// Update profile
exports.updateMe = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { name, avatar } = req.body;
    const admin = await Admin_1.default.findByIdAndUpdate(req.admin?.id, { name, avatar }, { new: true, runValidators: true });
    (0, apiResponse_1.sendSuccess)(res, 200, "Profile updated successfully", admin);
});
// Change password
exports.changePassword = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin_1.default.findById(req.admin?.id).select("+password");
    if (!admin)
        throw new errorHandler_1.AppError("Admin not found.", 404);
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch)
        throw new errorHandler_1.AppError("Current password is incorrect.", 400);
    admin.password = newPassword;
    await admin.save();
    const token = (0, jwt_1.generateToken)(admin);
    (0, apiResponse_1.sendSuccess)(res, 200, "Password changed successfully", { token });
});
