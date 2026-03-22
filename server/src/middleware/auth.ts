import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { AppError } from "../utils/errorHandler";
import Admin from "../models/Admin";

// Extend Express Request to include admin user
declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload;
    }
  }
}

// Protect routes — must be logged in
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) throw new AppError("Not authorized. No token provided.", 401);

    const decoded = verifyToken(token);

    // Check admin still exists & is active
    const admin = await Admin.findById(decoded.id).select("+isActive");
    if (!admin || !admin.isActive) {
      throw new AppError("Admin account not found or deactivated.", 401);
    }

    req.admin = decoded;
    next();
  } catch (err) {
    next(err);
  }
};

// Restrict to specific roles
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403),
      );
    }
    next();
  };
};
