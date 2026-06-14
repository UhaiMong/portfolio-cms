import type { Request, Response } from "express";
import { Resume } from "../models";
import { catchAsync, AppError } from "../utils/errorHandler";
import { sendSuccess } from "../utils/apiResponse";
import { cloudinary } from "../config/cloudinary";

// GET /api/resume  — active resume (public)
export const getActiveResume = catchAsync(
  async (req: Request, res: Response) => {
    const resume = await Resume.findOne({ isActive: true });
    if (!resume) throw new AppError("No active resume found", 404);
    sendSuccess(res, 200, "Resume fetched", resume);
  },
);

// PATCH /resume/download
export const downloadResume = catchAsync(
  async (req: Request, res: Response) => {
    const resume = await Resume.findOne({ isActive: true });
    if (!resume) throw new AppError("No active resume found", 404);

    resume.downloadCount += 1;
    await resume.save({ validateBeforeSave: false });

    // Fetch from Cloudinary on server side (no CORS issue)
    const cloudinaryRes = await fetch(resume.fileUrl);

    if (!cloudinaryRes.ok) {
      throw new AppError("Failed to fetch resume file", 500);
    }

    const buffer = await cloudinaryRes.arrayBuffer();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${resume.fileName}"`,
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", buffer.byteLength);
    res.send(Buffer.from(buffer));
  },
);

// GET /api/resume/all  — all resumes (admin)
export const getAllResumes = catchAsync(async (req: Request, res: Response) => {
  const resumes = await Resume.find().sort({ createdAt: -1 });
  sendSuccess(res, 200, "Resumes fetched", resumes);
});

// POST /api/resume/upload
export const uploadResume = catchAsync(
  async (req: Request & { file?: any }, res: Response) => {
    if (!req.file) throw new AppError("Please upload a PDF file", 400);

    const file = req.file as File & {
      path: string;
      filename: string;
      size: number;
    };

    const resume = await Resume.create({
      fileName: file.filename,
      fileUrl: file.path,
      fileSize: Math.round(file.size / 1024),
      version: req.body.version || "1.0",
      isActive: req.body.isActive === "true",
    });

    sendSuccess(res, 201, "Resume uploaded", resume);
  },
);

// PATCH /api/resume/:id/activate
export const activateResume = catchAsync(
  async (req: Request, res: Response) => {
    await Resume.updateMany({}, { isActive: false });
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { returnDocument: "after", new: true },
    );
    if (!resume) throw new AppError("Resume not found", 404);
    sendSuccess(res, 200, "Resume activated", resume);
  },
);

// DELETE /api/resume/:id
export const deleteResume = catchAsync(async (req: Request, res: Response) => {
  const resume = await Resume.findById(req.params.id);
  if (!resume) throw new AppError("Resume not found", 404);

  // Delete from Cloudinary
  const publicId = `portfolio-cms/resume/${resume.fileName.split(".")[0]}`;
  await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });

  await resume.deleteOne();
  sendSuccess(res, 200, "Resume deleted", null);
});
