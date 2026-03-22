import { Request, Response } from "express";
import { Banner } from "../models";
import { catchAsync, AppError } from "../utils/errorHandler";
import { sendSuccess } from "../utils/apiResponse";

// GET /api/banner
export const getBanner = catchAsync(async (req: Request, res: Response) => {
  const banner = await Banner.findOne({ isActive: true }).sort({
    createdAt: -1,
  });
  if (!banner) throw new AppError("No active banner found", 404);
  sendSuccess(res, 200, "Banner fetched", banner);
});

// GET /api/banner/all  — admin: all banners
export const getAllBanners = catchAsync(async (req: Request, res: Response) => {
  const banners = await Banner.find().sort({ createdAt: -1 });
  sendSuccess(res, 200, "Banners fetched", banners);
});

// POST /api/banner
export const createBanner = catchAsync(async (req: Request, res: Response) => {
  const banner = await Banner.create(req.body);
  sendSuccess(res, 201, "Banner created", banner);
});

// PATCH /api/banner/:id
export const updateBanner = catchAsync(async (req: Request, res: Response) => {
  const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!banner) throw new AppError("Banner not found", 404);
  sendSuccess(res, 200, "Banner updated", banner);
});

// PATCH /api/banner/:id/activate
export const activateBanner = catchAsync(
  async (req: Request, res: Response) => {
    await Banner.updateMany({}, { isActive: false });
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true },
    );
    if (!banner) throw new AppError("Banner not found", 404);
    sendSuccess(res, 200, "Banner activated", banner);
  },
);

// DELETE /api/banner/:id
export const deleteBanner = catchAsync(async (req: Request, res: Response) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) throw new AppError("Banner not found", 404);
  sendSuccess(res, 200, "Banner deleted", null);
});
