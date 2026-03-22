"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bioController_1 = require("../controllers/bioController");
const auth_1 = require("../middleware/auth");
const cloudinary_1 = require("../config/cloudinary");
const apiResponse_1 = require("../utils/apiResponse");
const errorHandler_1 = require("../utils/errorHandler");
const router = (0, express_1.Router)();
// Public
router.get("/", bioController_1.getBio);
// Protected
router.use(auth_1.protect);
router.post("/avatar", cloudinary_1.uploadImage.single("avatar"), (req, res) => {
    if (!req.file)
        throw new errorHandler_1.AppError("No file uploaded", 400);
    (0, apiResponse_1.sendSuccess)(res, 200, "Avatar uploaded", { url: req.file.path });
});
router.post("/", bioController_1.createBio);
router.patch("/:id", bioController_1.updateBio);
router.patch("/:id/skills", bioController_1.updateSkills);
router.patch("/:id/experience", bioController_1.updateExperience);
router.patch("/:id/education", bioController_1.updateEducation);
exports.default = router;
