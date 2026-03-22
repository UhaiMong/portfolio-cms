"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.activateBanner = exports.updateBanner = exports.createBanner = exports.getAllBanners = exports.getBanner = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../utils/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
// GET /api/banner
exports.getBanner = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const banner = await models_1.Banner.findOne({ isActive: true }).sort({
        createdAt: -1,
    });
    if (!banner)
        throw new errorHandler_1.AppError("No active banner found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Banner fetched", banner);
});
// GET /api/banner/all  — admin: all banners
exports.getAllBanners = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const banners = await models_1.Banner.find().sort({ createdAt: -1 });
    (0, apiResponse_1.sendSuccess)(res, 200, "Banners fetched", banners);
});
// POST /api/banner
exports.createBanner = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const banner = await models_1.Banner.create(req.body);
    (0, apiResponse_1.sendSuccess)(res, 201, "Banner created", banner);
});
// PATCH /api/banner/:id
exports.updateBanner = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const banner = await models_1.Banner.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!banner)
        throw new errorHandler_1.AppError("Banner not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Banner updated", banner);
});
// PATCH /api/banner/:id/activate
exports.activateBanner = (0, errorHandler_1.catchAsync)(async (req, res) => {
    await models_1.Banner.updateMany({}, { isActive: false });
    const banner = await models_1.Banner.findByIdAndUpdate(req.params.id, { isActive: true }, { new: true });
    if (!banner)
        throw new errorHandler_1.AppError("Banner not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Banner activated", banner);
});
// DELETE /api/banner/:id
exports.deleteBanner = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const banner = await models_1.Banner.findByIdAndDelete(req.params.id);
    if (!banner)
        throw new errorHandler_1.AppError("Banner not found", 404);
    (0, apiResponse_1.sendSuccess)(res, 200, "Banner deleted", null);
});
