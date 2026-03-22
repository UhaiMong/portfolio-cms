import jwt from "jsonwebtoken";
import { IAdmin } from "../models/Admin";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export const generateToken = (admin: IAdmin): string => {
  return jwt.sign(
    { id: admin._id, email: admin.email, role: admin.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES } as jwt.SignOptions,
  );
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
