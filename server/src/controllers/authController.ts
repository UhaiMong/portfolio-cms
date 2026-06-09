import type { Request, Response, NextFunction } from "express";
import Admin from "../models/Admin";
import { generateToken } from "../utils/jwt";
import { catchAsync, AppError } from "../utils/errorHandler";
import { sendSuccess } from "../utils/apiResponse";

// ── Register (only use once to create your admin account) ───
export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Prevent creating more than one superadmin
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) throw new AppError("Email already registered.", 400);

  const admin = await Admin.create({ name, email, password, role });
  const token = generateToken(admin);

  sendSuccess(res, 201, "Admin registered successfully", {
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
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new AppError("Please provide email and password.", 400);

  const admin = await Admin.findOne({ email }).select("+password");
  if (!admin || !(await admin.comparePassword(password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (!admin.isActive)
    throw new AppError("Your account has been deactivated.", 403);

  // Update last login
  admin.lastLogin = new Date();
  await admin.save({ validateBeforeSave: false });

  const token = generateToken(admin);

  sendSuccess(res, 200, "Logged in successfully", {
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
export const getMe = catchAsync(async (req: Request, res: Response) => {
  const admin = await Admin.findById(req.admin?.id);
  if (!admin) throw new AppError("Admin not found.", 404);

  sendSuccess(res, 200, "Admin profile fetched", {
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
export const updateMe = catchAsync(async (req: Request, res: Response) => {
  const { name, avatar } = req.body;

  const admin = await Admin.findByIdAndUpdate(
    req.admin?.id,
    { name, avatar },
    { new: true, runValidators: true },
  );

  sendSuccess(res, 200, "Profile updated successfully", admin);
});

// Change password
export const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin?.id).select("+password");
    if (!admin) throw new AppError("Admin not found.", 404);

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) throw new AppError("Current password is incorrect.", 400);

    admin.password = newPassword;
    await admin.save();

    const token = generateToken(admin);
    sendSuccess(res, 200, "Password changed successfully", { token });
  },
);
