"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.togglePublish = exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getAllTags = exports.getBlogById = exports.getBlogBySlug = exports.getAllBlogs = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../utils/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const cloudinary_1 = require("../config/cloudinary");
// Helper: parse FormData quirks
const parseBody = (body) => ({
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    category: body.category,
    status: body.status,
    featured: body.featured === "true" || body.featured === true,
    tags: (() => {
        try {
            const parsed = JSON.parse(body.tags || "[]");
            return Array.isArray(parsed) ? parsed : [];
        }
        catch {
            return [];
        }
    })(),
});
// Public
// GET /api/blog
exports.getAllBlogs = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { status = "published", featured, category, tag, page = 1, limit = 10, } = req.query;
    const filter = {};
    if (!req.admin)
        filter.status = "published";
    else if (status)
        filter.status = status;
    if (featured)
        filter.featured = featured === "true";
    if (category)
        filter.category = category;
    if (tag)
        filter.tags = { $in: [tag] };
    const skip = (Number(page) - 1) * Number(limit);
    const [blogs, total] = await Promise.all([
        models_1.Blog.find(filter)
            .sort({ publishedAt: -1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .select("-content"),
        models_1.Blog.countDocuments(filter),
    ]);
    (0, apiResponse_1.sendSuccess)(res, 200, "Blogs fetched", {
        blogs,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(total / Number(limit)),
        },
    });
});
// GET /api/blog/:slug
exports.getBlogBySlug = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const blog = await models_1.Blog.findOneAndUpdate({ slug: req.params.slug, status: "published" }, { $inc: { views: 1 } }, { returnDocument: "after" });
    if (!blog)
        throw new errorHandler_1.AppError("Blog post not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Blog fetched", blog);
});
// Get Blog Details by ID
exports.getBlogById = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const blog = await models_1.Blog.findById(id);
    if (!blog)
        throw new errorHandler_1.AppError("Blog post not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Blog fetched", blog);
});
// GET /api/blog/tags
exports.getAllTags = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const tags = await models_1.Blog.distinct("tags", { status: "published" });
    (0, apiResponse_1.sendSuccess)(res, 200, "Tags fetched", tags);
});
// Protected
// POST /api/blog
exports.createBlog = (0, errorHandler_1.catchAsync)(async (req, res) => {
    if (!req.file)
        throw new errorHandler_1.AppError("Thumbnail is required", 400);
    const blog = await models_1.Blog.create({
        ...parseBody(req.body),
        thumbnail: req.file.path,
    });
    (0, apiResponse_1.sendSuccess)(res, 201, "Blog post created", blog);
});
// PATCH /api/blog/:id
exports.updateBlog = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const updates = parseBody(req.body);
    if (req.file) {
        const existing = await models_1.Blog.findById(req.params.id).select("thumbnail");
        if (existing?.thumbnail) {
            const publicId = existing.thumbnail
                .split("/")
                .slice(-2)
                .join("/")
                .split(".")[0];
            await cloudinary_1.cloudinary.uploader.destroy(publicId).catch(() => null);
        }
        updates.thumbnail = req.file.path;
    }
    const blog = await models_1.Blog.findById(req.params.id);
    if (!blog)
        throw new errorHandler_1.AppError("Blog post not found", 404);
    Object.assign(blog, updates);
    await blog.save();
    (0, apiResponse_1.sendSuccess)(res, 200, "Blog post updated", blog);
});
// DELETE /api/blog/:id
exports.deleteBlog = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const blog = await models_1.Blog.findById(req.params.id);
    if (!blog)
        throw new errorHandler_1.AppError("Blog post not found", 404);
    if (blog.thumbnail) {
        const publicId = blog.thumbnail
            .split("/")
            .slice(-2)
            .join("/")
            .split(".")[0];
        await cloudinary_1.cloudinary.uploader.destroy(publicId).catch(() => null);
    }
    await blog.deleteOne();
    (0, apiResponse_1.sendSuccess)(res, 200, "Blog post deleted", null);
});
// PATCH /api/blog/:id/publish — toggle publish/draft
exports.togglePublish = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const blog = await models_1.Blog.findById(req.params.id);
    if (!blog)
        throw new errorHandler_1.AppError("Blog post not found", 404);
    blog.status = blog.status === "published" ? "draft" : "published";
    if (blog.status === "published" && !blog.publishedAt)
        blog.publishedAt = new Date();
    await blog.save();
    (0, apiResponse_1.sendSuccess)(res, 200, `Blog ${blog.status}`, blog);
});
