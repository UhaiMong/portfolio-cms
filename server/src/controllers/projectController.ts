import type { Request, Response } from "express";
import { Project } from "../models";
import { catchAsync, AppError } from "../utils/errorHandler";
import { sendError, sendSuccess } from "../utils/apiResponse";
import { cloudinary } from "../config/cloudinary";

//  Public

// GET /api/projects
export const getAllProjects = catchAsync(
  async (req: Request, res: Response) => {
    const { status, featured, category, page = 1, limit = 9 } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (featured) filter.featured = featured === "true";
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ featured: -1, order: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Project.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "Projects fetched", {
      projects,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  },
);

// GET /archives/:slug
export const getProjectDetails = async (req: Request, res: Response) => {
  const { slug } = req.params;

  const project = await Project.findOne({ slug: slug } as any);

  if (!project) return sendError(res, 404, "Project not found");

  const [prev, next] = await Promise.all([
    Project.findOne({ order: { $lt: project.order } })
      .sort({ order: -1 })
      .select("title slug thumbnail"),

    Project.findOne({ order: { $gt: project.order } })
      .sort({ order: 1 })
      .select("title slug thumbnail"),
  ]);

  sendSuccess(res, 200, "Project fetched", {
    project,
    prev,
    next,
  });
};

// GET /api/projects/:slug
export const getProjectBySlug = catchAsync(
  async (req: Request, res: Response) => {
    const project = await Project.findOneAndUpdate(
      { slug: req.params.slug } as any,
      { $inc: { views: 1 } },
      { returnDocument: "after" },
    );
    if (!project) throw new AppError("Project not found", 404);
    sendSuccess(res, 200, "Project fetched", project);
  },
);

//  Protected (Admin)

// POST /api/projects
export const createProject = catchAsync(async (req: Request, res: Response) => {
  let { "images[]": images, "techStack[]": techStack, ...rest } = req.body;

  // Express may give a string if only one item was sent — normalize to array
  if (typeof images === "string") images = [images];
  if (typeof techStack === "string") techStack = [techStack];

  const project = await Project.create({
    ...rest,
    images: images ?? [],
    techStack: techStack ?? [],
  });

  sendSuccess(res, 201, "Project created", project);
});

// PUT /api/projects/:id
export const updateProject = catchAsync(async (req: Request, res: Response) => {
  let { "images[]": images, "techStack[]": techStack, ...rest } = req.body;

  // Normalize to array only if the field was actually sent
  if (images !== undefined) {
    if (typeof images === "string") images = [images];
  }
  if (techStack !== undefined) {
    if (typeof techStack === "string") techStack = [techStack];
  }

  const updatePayload: Record<string, unknown> = { ...rest };

  // Only include in update if explicitly sent — prevents wiping existing data
  if (images !== undefined) updatePayload.images = images;
  if (techStack !== undefined) updatePayload.techStack = techStack;

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    updatePayload,
    { returnDocument: "after", new: true, runValidators: true },
  );

  if (!project) return sendError(res, 404, "Project not found");

  sendSuccess(res, 200, "Project updated", project);
});

// DELETE /api/projects/:id
export const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new AppError("Project not found", 404);

  // Delete images from Cloudinary
  const allImages = [project.thumbnail, ...project.images].filter(Boolean);
  await Promise.all(
    allImages.map((url) => {
      const publicId = url.split("/").slice(-2).join("/").split(".")[0];
      return cloudinary.uploader.destroy(publicId);
    }),
  );

  await project.deleteOne();
  sendSuccess(res, 200, "Project deleted", null);
});

// PATCH /api/projects/:id/toggle-featured
export const toggleFeatured = catchAsync(
  async (req: Request, res: Response) => {
    const project = await Project.findById(req.params.id);
    if (!project) throw new AppError("Project not found", 404);
    project.featured = !project.featured;
    await project.save();
    sendSuccess(
      res,
      200,
      `Project ${project.featured ? "featured" : "unfeatured"}`,
      project,
    );
  },
);

// PATCH /api/projects/reorder
export const reorderProjects = catchAsync(
  async (req: Request, res: Response) => {
    const { orders } = req.body; // [{ id, order }]
    await Promise.all(
      orders.map(({ id, order }: { id: string; order: number }) =>
        Project.findByIdAndUpdate(id, { order }),
      ),
    );
    sendSuccess(res, 200, "Projects reordered", null);
  },
);
