import { Router } from "express";
import {
  getAllProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  toggleFeatured,
  reorderProjects,
  getProjectDetails,
} from "../controllers/projectController";
import { protect } from "../middleware/auth";
import { getProjectStats } from "../controllers/projectStats.controller";

const router = Router();

// Public
router.get("/", getAllProjects);
router.get("/stats", getProjectStats);
router.get("/:slug", getProjectBySlug);
router.get("/archive/:slug", getProjectDetails);

// Protected
router.use(protect);
router.post("/", createProject);
router.patch("/reorder", reorderProjects);
router.patch("/:id", updateProject);
router.patch("/:id/featured", toggleFeatured);
router.delete("/:id", deleteProject);

export default router;
