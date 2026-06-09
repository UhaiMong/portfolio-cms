"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bioController_1 = require("../controllers/bioController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public
router.get("/", bioController_1.getBio);
// Protected
router.use(auth_1.protect);
router.post("/", bioController_1.createBio);
router.patch("/:id", bioController_1.updateBio);
router.patch("/:id/skills", bioController_1.updateSkills);
router.patch("/:id/experience", bioController_1.updateExperience);
router.patch("/:id/education", bioController_1.updateEducation);
exports.default = router;
