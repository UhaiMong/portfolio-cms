"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bannerController_1 = require("../controllers/bannerController");
const auth_1 = require("../middleware/auth");
const cloudinary_1 = require("../config/cloudinary");
const router = (0, express_1.Router)();
// Public
router.get("/", bannerController_1.getBanner);
// Protected
router.use(auth_1.protect);
router.get("/all", bannerController_1.getAllBanners);
router.post("/", cloudinary_1.uploadImage.single("image"), bannerController_1.createBanner);
router.patch("/:id", cloudinary_1.uploadImage.single("image"), bannerController_1.updateBanner);
router.patch("/:id/activate", bannerController_1.activateBanner);
router.delete("/:id", bannerController_1.deleteBanner);
exports.default = router;
