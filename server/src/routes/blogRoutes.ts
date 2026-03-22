import { Router } from "express";
import {
  getAllBlogs,
  getBlogBySlug,
  getAllTags,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublish,
  getBlogById,
} from "../controllers/blogController";
import { protect } from "../middleware/auth";
import { uploadImage } from "../config/cloudinary";

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
router.get("/", optionalAuth, getAllBlogs);
router.get("/tags", getAllTags);
router.get("/:slug", getBlogBySlug);

// Protected
router.use(protect);
router.post("/", uploadImage.single("thumbnail"), createBlog);
router.patch("/:id", uploadImage.single("thumbnail"), updateBlog);
router.get("/blog-details/:id", getBlogById);
router.patch("/:id/publish", togglePublish);
router.delete("/:id", deleteBlog);

export default router;
