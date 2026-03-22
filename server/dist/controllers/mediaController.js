"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMedia = exports.getAllMedia = exports.uploadMedia = void 0;
const models_1 = require("../models");
const errorHandler_1 = require("../utils/errorHandler");
const apiResponse_1 = require("../utils/apiResponse");
const cloudinary_1 = require("../config/cloudinary");
// POST /api/media/upload
exports.uploadMedia = (0, errorHandler_1.catchAsync)(async (req, res) => {
    if (!req.file)
        throw new errorHandler_1.AppError("No file uploaded", 400);
    const file = req.file;
    const isImage = file.mimetype.startsWith("image/");
    const media = await models_1.Media.create({
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
    (0, apiResponse_1.sendSuccess)(res, 201, "File uploaded", media);
});
// GET /api/media
exports.getAllMedia = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { fileType, folder, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (fileType)
        filter.fileType = fileType;
    if (folder)
        filter.folder = folder;
    const skip = (Number(page) - 1) * Number(limit);
    const [media, total] = await Promise.all([
        models_1.Media.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
        models_1.Media.countDocuments(filter),
    ]);
    (0, apiResponse_1.sendSuccess)(res, 200, "Media fetched", {
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
exports.deleteMedia = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const media = await models_1.Media.findById(req.params.id);
    if (!media)
        throw new errorHandler_1.AppError("Media not found", 404);
    const resourceType = media.fileType === "pdf" ? "raw" : "image";
    await cloudinary_1.cloudinary.uploader.destroy(media.publicId, {
        resource_type: resourceType,
    });
    await media.deleteOne();
    (0, apiResponse_1.sendSuccess)(res, 200, "Media deleted", null);
});
