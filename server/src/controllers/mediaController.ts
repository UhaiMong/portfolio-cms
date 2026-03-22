import { Request, Response } from "express";
import { Media } from "../models";
import { catchAsync, AppError } from "../utils/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import { cloudinary } from "../config/cloudinary";

// POST /api/media/upload
export const uploadMedia = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) throw new AppError("No file uploaded", 400);

  const file = req.file as any;
  const isImage = file.mimetype.startsWith("image/");

  const media = await Media.create({
    fileName: file.filename,
    originalName: file.originalname,
    fileUrl: file.path,
    publicId: file.filename,
    fileType: isImage
      ? "image"
      : file.mimetype === "application/pdf"
        ? "pdf"
        : "other",
    mimeType: file.mimetype,
    fileSize: Math.round(file.size / 1024),
    folder: req.body.folder || "general",
    usedIn: req.body.usedIn || "",
  });

  sendSuccess(res, 201, "File uploaded", media);
});

// GET /api/media
export const getAllMedia = catchAsync(async (req: Request, res: Response) => {
  const { fileType, folder, page = 1, limit = 20 } = req.query;

  const filter: any = {};
  if (fileType) filter.fileType = fileType;
  if (folder) filter.folder = folder;

  const skip = (Number(page) - 1) * Number(limit);
  const [media, total] = await Promise.all([
    Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Media.countDocuments(filter),
  ]);

  sendSuccess(res, 200, "Media fetched", {
    media,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
    },
  });
});

// DELETE /api/media/:id
export const deleteMedia = catchAsync(async (req: Request, res: Response) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw new AppError("Media not found", 404);

  const resourceType = media.fileType === "pdf" ? "raw" : "image";
  await cloudinary.uploader.destroy(media.publicId, {
    resource_type: resourceType,
  });

  await media.deleteOne();
  sendSuccess(res, 200, "Media deleted", null);
});
