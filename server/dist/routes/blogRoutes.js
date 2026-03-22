"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogController_1 = require("../controllers/blogController");
const auth_1 = require("../middleware/auth");
const cloudinary_1 = require("../config/cloudinary");
// Optional auth — attaches req.admin if token present but doesn't block
const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
        try {
            const { verifyToken } = require("../utils/jwt");
            req.admin = verifyToken(token);
        }
        catch { }
    }
    next();
};
const router = (0, express_1.Router)();
// Public
router.get("/", optionalAuth, blogController_1.getAllBlogs);
router.get("/tags", blogController_1.getAllTags);
router.get("/:slug", blogController_1.getBlogBySlug);
// Protected
router.use(auth_1.protect);
router.post("/", cloudinary_1.uploadImage.single("thumbnail"), blogController_1.createBlog);
router.patch("/:id", cloudinary_1.uploadImage.single("thumbnail"), blogController_1.updateBlog);
router.get("/blog-details/:id", blogController_1.getBlogById);
router.patch("/:id/publish", blogController_1.togglePublish);
router.delete("/:id", blogController_1.deleteBlog);
exports.default = router;
