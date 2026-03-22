import { Router } from "express";
import {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
} from "../controllers/authController";
import { getStats } from "../controllers/statsController";
import { protect } from "../middleware/auth";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.use(protect);
router.get("/me", getMe);
router.patch("/update-me", updateMe);
router.patch("/change-password", changePassword);
router.get("/stats", getStats);

export default router;
