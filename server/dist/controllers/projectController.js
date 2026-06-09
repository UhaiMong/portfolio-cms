"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reorderProjects = exports.toggleFeatured = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectBySlug = exports.getProjectDetails = exports.getAllProjects = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../utils/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const cloudinary_1 = require("../config/cloudinary");
//  Public
// GET /api/projects
exports.getAllProjects = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { status, featured, category, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    if (featured)
        filter.featured = featured === "true";
    if (category)
        filter.category = category;
    const skip = (Number(page) - 1) * Number(limit);
    const [projects, total] = await Promise.all([
        models_1.Project.find(filter)
            .sort({ order: 1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit)),
        models_1.Project.countDocuments(filter),
    ]);
    (0, apiResponse_1.sendSuccess)(res, 200, "Projects fetched", {
        projects,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
        },
    });
});
// GET /archives/:slug
const getProjectDetails = async (req, res) => {
    const { slug } = req.params;
    const project = await models_1.Project.findOne({ slug });
    if (!project)
        return (0, apiResponse_1.sendError)(res, 404, "Project not found");
    const [prev, next] = await Promise.all([
        models_1.Project.findOne({ order: { $lt: project.order } })
            .sort({ order: -1 })
            .select("title slug thumbnail"),
        models_1.Project.findOne({ order: { $gt: project.order } })
            .sort({ order: 1 })
            .select("title slug thumbnail"),
    ]);
    (0, apiResponse_1.sendSuccess)(res, 200, "Project fetched", {
        project,
        prev,
        next,
    });
};
exports.getProjectDetails = getProjectDetails;
// GET /api/projects/:slug
exports.getProjectBySlug = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const project = await models_1.Project.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { returnDocument: "after" });
    if (!project)
        throw new errorHandler_1.AppError("Project not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Project fetched", project);
});
//  Protected (Admin)
// POST /api/projects
exports.createProject = (0, errorHandler_1.catchAsync)(async (req, res) => {
    let { "images[]": images, "techStack[]": techStack, ...rest } = req.body;
    // Express may give a string if only one item was sent — normalize to array
    if (typeof images === "string")
        images = [images];
    if (typeof techStack === "string")
        techStack = [techStack];
    const project = await models_1.Project.create({
        ...rest,
        images: images ?? [],
        techStack: techStack ?? [],
    });
    (0, apiResponse_1.sendSuccess)(res, 201, "Project created", project);
});
// PUT /api/projects/:id
exports.updateProject = (0, errorHandler_1.catchAsync)(async (req, res) => {
    let { "images[]": images, "techStack[]": techStack, ...rest } = req.body;
    // Normalize to array only if the field was actually sent
    if (images !== undefined) {
        if (typeof images === "string")
            images = [images];
    }
    if (techStack !== undefined) {
        if (typeof techStack === "string")
            techStack = [techStack];
    }
    const updatePayload = { ...rest };
    // Only include in update if explicitly sent — prevents wiping existing data
    if (images !== undefined)
        updatePayload.images = images;
    if (techStack !== undefined)
        updatePayload.techStack = techStack;
    const project = await models_1.Project.findByIdAndUpdate(req.params.id, updatePayload, { new: true, runValidators: true });
    if (!project)
        return (0, apiResponse_1.sendError)(res, 404, "Project not found");
    (0, apiResponse_1.sendSuccess)(res, 200, "Project updated", project);
});
// DELETE /api/projects/:id
exports.deleteProject = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const project = await models_1.Project.findById(req.params.id);
    if (!project)
        throw new errorHandler_1.AppError("Project not found", 404);
    // Delete images from Cloudinary
    const allImages = [project.thumbnail, ...project.images].filter(Boolean);
    await Promise.all(allImages.map((url) => {
        const publicId = url.split("/").slice(-2).join("/").split(".")[0];
        return cloudinary_1.cloudinary.uploader.destroy(publicId);
    }));
    await project.deleteOne();
    (0, apiResponse_1.sendSuccess)(res, 200, "Project deleted", null);
});
// PATCH /api/projects/:id/toggle-featured
exports.toggleFeatured = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const project = await models_1.Project.findById(req.params.id);
    if (!project)
        throw new errorHandler_1.AppError("Project not found", 404);
    project.featured = !project.featured;
    await project.save();
    (0, apiResponse_1.sendSuccess)(res, 200, `Project ${project.featured ? "featured" : "unfeatured"}`, project);
});
// PATCH /api/projects/reorder
exports.reorderProjects = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { orders } = req.body; // [{ id, order }]
    await Promise.all(orders.map(({ id, order }) => models_1.Project.findByIdAndUpdate(id, { order })));
    (0, apiResponse_1.sendSuccess)(res, 200, "Projects reordered", null);
});
