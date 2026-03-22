"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projectController_1 = require("../controllers/projectController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Public
router.get("/", projectController_1.getAllProjects);
router.get("/:slug", projectController_1.getProjectBySlug);
// Protected
router.use(auth_1.protect);
router.post("/", projectController_1.createProject);
router.patch("/reorder", projectController_1.reorderProjects);
router.patch("/:id", projectController_1.updateProject);
router.patch("/:id/featured", projectController_1.toggleFeatured);
router.delete("/:id", projectController_1.deleteProject);
exports.default = router;
