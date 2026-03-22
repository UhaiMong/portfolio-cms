import { Request, Response } from "express";
import { Blog } from "../models";
import { catchAsync, AppError } from "../utils/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import { cloudinary } from "../config/cloudinary";

// Helper: parse FormData quirks
const parseBody = (body: any) => ({
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
    } catch {
      return [];
    }
  })(),
});

// Public

// GET /api/blog
export const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const {
    status = "published",
    featured,
    category,
    tag,
    page = 1,
    limit = 10,
  } = req.query;

  const filter: any = {};
  if (!req.admin) filter.status = "published";
  else if (status) filter.status = status;

  if (featured) filter.featured = featured === "true";
  if (category) filter.category = category;
  if (tag) filter.tags = { $in: [tag] };

  const skip = (Number(page) - 1) * Number(limit);
  const [blogs, total] = await Promise.all([
    Blog.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select("-content"),
    Blog.countDocuments(filter),
  ]);

  sendSuccess(res, 200, "Blogs fetched", {
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
export const getBlogBySlug = catchAsync(async (req: Request, res: Response) => {
  const blog = await Blog.findOneAndUpdate(
    { slug: req.params.slug, status: "published" },
    { $inc: { views: 1 } },
    { returnDocument: "after" },
  );
  if (!blog) throw new AppError("Blog post not found", 404);
  sendSuccess(res, 200, "Blog fetched", blog);
});
// Get Blog Details by ID
export const getBlogById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) throw new AppError("Blog post not found", 404);
  sendSuccess(res, 200, "Blog fetched", blog);
});

// GET /api/blog/tags
export const getAllTags = catchAsync(async (req: Request, res: Response) => {
  const tags = await Blog.distinct("tags", { status: "published" });
  sendSuccess(res, 200, "Tags fetched", tags);
});

// Protected

// POST /api/blog
export const createBlog = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError("Thumbnail is required", 400);

  const blog = await Blog.create({
    ...parseBody(req.body),
    thumbnail: (req.file as any).path,
  });

  sendSuccess(res, 201, "Blog post created", blog);
});

// PATCH /api/blog/:id
export const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const updates: any = parseBody(req.body);
  if (req.file) {
    const existing = await Blog.findById(req.params.id).select("thumbnail");
    if (existing?.thumbnail) {
      const publicId = existing.thumbnail
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];
      await cloudinary.uploader.destroy(publicId).catch(() => null);
    }
    updates.thumbnail = (req.file as any).path;
  }

  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new AppError("Blog post not found", 404);

  Object.assign(blog, updates);
  await blog.save();

  sendSuccess(res, 200, "Blog post updated", blog);
});

// DELETE /api/blog/:id
export const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new AppError("Blog post not found", 404);

  if (blog.thumbnail) {
    const publicId = blog.thumbnail
      .split("/")
      .slice(-2)
      .join("/")
      .split(".")[0];
    await cloudinary.uploader.destroy(publicId).catch(() => null);
  }

  await blog.deleteOne();
  sendSuccess(res, 200, "Blog post deleted", null);
});

// PATCH /api/blog/:id/publish — toggle publish/draft
export const togglePublish = catchAsync(async (req: Request, res: Response) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) throw new AppError("Blog post not found", 404);
  blog.status = blog.status === "published" ? "draft" : "published";
  if (blog.status === "published" && !blog.publishedAt)
    blog.publishedAt = new Date();
  await blog.save();
  sendSuccess(res, 200, `Blog ${blog.status}`, blog);
});
