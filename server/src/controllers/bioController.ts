import type { Request, Response } from "express";
import { Bio } from "../models";
import { catchAsync, AppError } from "../utils/errorHandler";
import { sendSuccess } from "../utils/apiResponse";

// GET /api/bio  — always returns the single bio document
export const getBio = catchAsync(async (req: Request, res: Response) => {
  const bio = await Bio.findOne().sort({ createdAt: -1 });
  if (!bio) throw new AppError("Bio not found", 404);
  sendSuccess(res, 200, "Bio fetched", bio);
});

// POST /api/bio  — create if none exists
export const createBio = catchAsync(async (req: Request, res: Response) => {
  const existing = await Bio.findOne();
  if (existing)
    throw new AppError("Bio already exists. Use PATCH to update.", 400);
  const bio = await Bio.create(req.body);
  sendSuccess(res, 201, "Bio created", bio);
});

// PATCH /api/bio/:id
export const updateBio = catchAsync(async (req: Request, res: Response) => {
  const bio = await Bio.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
    new: true,
    runValidators: true,
  });
  if (!bio) throw new AppError("Bio not found", 404);
  sendSuccess(res, 200, "Bio updated", bio);
});

// PATCH /api/bio/:id/skills  — replace entire skills array
export const updateSkills = catchAsync(async (req: Request, res: Response) => {
  const bio = await Bio.findByIdAndUpdate(
    req.params.id,
    { skills: req.body.skills },
    { returnDocument: "after", new: true },
  );
  if (!bio) throw new AppError("Bio not found", 404);
  sendSuccess(res, 200, "Skills updated", bio);
});

// PATCH /api/bio/:id/experience
export const updateExperience = catchAsync(
  async (req: Request, res: Response) => {
    const bio = await Bio.findByIdAndUpdate(
      req.params.id,
      { experience: req.body.experience },
      { returnDocument: "after", new: true },
    );
    if (!bio) throw new AppError("Bio not found", 404);
    sendSuccess(res, 200, "Experience updated", bio);
  },
);

// PATCH /api/bio/:id/education
export const updateEducation = catchAsync(
  async (req: Request, res: Response) => {
    const bio = await Bio.findByIdAndUpdate(
      req.params.id,
      { education: req.body.education },
      { returnDocument: "after", new: true },
    );
    if (!bio) throw new AppError("Bio not found", 404);
    sendSuccess(res, 200, "Education updated", bio);
  },
);
