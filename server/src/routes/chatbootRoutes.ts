import { Router } from "express";
import { chat } from "../controllers/chatboot.controller";

// Optional auth — attaches req.admin if token present but doesn't block
const optionalAuth = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    try {
      const { verifyToken } = require("../utils/jwt");
      req.admin = verifyToken(token);
    } catch {}
  }
  next();
};

const router = Router();

// Public
router.post("/chat", chat);

// Protected

export default router;
