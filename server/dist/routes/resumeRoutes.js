"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resumeController_1 = require("../controllers/resumeController");
const auth_1 = require("../middleware/auth");
const cloudinary_1 = require("../config/cloudinary");
const router = (0, express_1.Router)();
// Public
router.get("/", resumeController_1.getActiveResume);
router.get("/download", resumeController_1.downloadResume);
// Protected
router.use(auth_1.protect);
router.get("/all", resumeController_1.getAllResumes);
router.post("/upload", cloudinary_1.uploadResume.single("resume"), resumeController_1.uploadResume);
router.patch("/:id/activate", resumeController_1.activateResume);
router.delete("/:id", resumeController_1.deleteResume);
exports.default = router;
