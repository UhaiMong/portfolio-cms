import { Router } from "express";
import {
  uploadMedia,
  getAllMedia,
  deleteMedia,
} from "../controllers/mediaController";
import { protect } from "../middleware/auth";
import { uploadImage } from "../config/cloudinary";

const router = Router();

router.use(protect); // all media routes are protected

router.get("/", getAllMedia);
router.post("/upload", uploadImage.single("file"), uploadMedia);
router.delete("/:id", deleteMedia);

export default router;
