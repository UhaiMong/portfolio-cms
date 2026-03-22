import { Router } from "express";
import {
  getAllProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  toggleFeatured,
  reorderProjects,
} from "../controllers/projectController";
import { protect } from "../middleware/auth";

const router = Router();

// Public
router.get("/", getAllProjects);
router.get("/:slug", getProjectBySlug);

// Protected
router.use(protect);
router.post("/", createProject);
router.patch("/reorder", reorderProjects);
router.patch("/:id", updateProject);
router.patch("/:id/featured", toggleFeatured);
router.delete("/:id", deleteProject);

export default router;
