import { Router } from "express";
import {
  getBanner,
  getAllBanners,
  createBanner,
  updateBanner,
  activateBanner,
  deleteBanner,
} from "../controllers/bannerController";
import { protect } from "../middleware/auth";
import { uploadImage } from "../config/cloudinary";

const router = Router();

// Public
router.get("/", getBanner);

// Protected
router.use(protect);
router.get("/all", getAllBanners);
router.post("/", createBanner);
router.patch("/:id", updateBanner);
router.patch("/:id/activate", activateBanner);
router.delete("/:id", deleteBanner);

export default router;
