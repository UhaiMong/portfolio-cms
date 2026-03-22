"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const statsController_1 = require("../controllers/statsController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public routes
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
// Protected routes
router.use(auth_1.protect);
router.get("/me", authController_1.getMe);
router.patch("/update-me", authController_1.updateMe);
router.patch("/change-password", authController_1.changePassword);
router.get("/stats", statsController_1.getStats);
exports.default = router;
