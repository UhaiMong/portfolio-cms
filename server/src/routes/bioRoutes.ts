import { Router } from "express";
import {
  getBio,
  createBio,
  updateBio,
  updateSkills,
  updateExperience,
  updateEducation,
} from "../controllers/bioController";
import { protect } from "../middleware/auth";
import { uploadImage } from "../config/cloudinary";
import { sendSuccess } from "../utils/apiResponse";
import { AppError } from "../utils/errorHandler";

const router = Router();

// Public
router.get("/", getBio);

// Protected
router.use(protect);
router.post("/avatar", uploadImage.single("avatar"), (req, res) => {
  if (!req.file) throw new AppError("No file uploaded", 400);
  sendSuccess(res, 200, "Avatar uploaded", { url: req.file.path });
});
router.post("/", createBio);
router.patch("/:id", updateBio);
router.patch("/:id/skills", updateSkills);
router.patch("/:id/experience", updateExperience);
router.patch("/:id/education", updateEducation);

export default router;
