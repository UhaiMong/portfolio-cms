import { Router } from "express";
import {
  getActiveResume,
  getAllResumes,
  uploadResume,
  activateResume,
  deleteResume,
  downloadResume,
} from "../controllers/resumeController";
import { protect } from "../middleware/auth";
import { uploadResume as uploadResumeMW } from "../config/cloudinary";

const router = Router();

// Public
router.get("/", getActiveResume);
router.get("/download", downloadResume);

// Protected
router.use(protect);
router.get("/all", getAllResumes);
router.post("/upload", uploadResumeMW.single("resume"), uploadResume);
router.patch("/:id/activate", activateResume);
router.delete("/:id", deleteResume);

export default router;
